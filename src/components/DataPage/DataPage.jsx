import './DataPage.css'
import { useEffect, useState } from 'react'
import SearchForm from '../SearchForm/SearchForm'
import Preloader from '../Preloader/Preloader'
import NotFound from '../NotFound/NotFound'
import ResultCard from '../ResultCard/ResultCard'
import CountryModal from '../CountryModal/CountryModal'
import {
  getAllCountries,
  getCountriesByCodes,
  searchCountriesByName,
} from '../../utils/restCountriesApi'
import { saveSearchLog } from '../../utils/searchLogApi'

const REQUEST_ERROR_MESSAGE =
  'Desculpe, algo deu errado durante a solicitação. Pode haver um problema de conexão ou o servidor pode estar inativo. Por favor, tente novamente mais tarde.'
const EMPTY_QUERY_MESSAGE = 'Por favor, insira uma palavra-chave'
const STORAGE_KEY = 'countries-search-state'
const INITIAL_VISIBLE_COUNT = 3
const INITIAL_COUNTRY_CODES = ['BRA', 'USA', 'FRA']
// Mapeia buscas em portugues para termos que a API entende melhor.
const SEARCH_ALIASES = {
  brasil: 'brazil',
  franca: 'france',
  japao: 'japan',
  eua: 'united states of america',
  'estados unidos': 'united states of america',
  'estados unidos da america': 'united states of america',
}

function normalizeText(value) {
  // Remove acentos para facilitar a comparacao de texto.
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function resolveSearchQuery(rawQuery) {
  const normalized = normalizeText(rawQuery)
  return SEARCH_ALIASES[normalized] || rawQuery.trim()
}

function isCountryMatch(item, rawQuery, resolvedQuery) {
  const normalizedRawQuery = normalizeText(rawQuery)
  const normalizedResolvedQuery = normalizeText(resolvedQuery)
  const normalizedName = normalizeText(item.name?.common || '')
  const normalizedOfficialName = normalizeText(item.name?.official || '')
  const normalizedPtName = normalizeText(item.translations?.por?.common || '')
  const normalizedPtOfficial = normalizeText(item.translations?.por?.official || '')

  return (
    normalizedName.includes(normalizedResolvedQuery) ||
    normalizedOfficialName.includes(normalizedResolvedQuery) ||
    normalizedName.includes(normalizedRawQuery) ||
    normalizedOfficialName.includes(normalizedRawQuery) ||
    normalizedPtName.includes(normalizedRawQuery) ||
    normalizedPtOfficial.includes(normalizedRawQuery)
  )
}

function loadInitialCountries(
  setResults,
  setHasSearched,
  setErrorMessage,
  setIsLoading,
) {
  // Carrega 3 paises iniciais para a tela nao ficar vazia.
  setIsLoading(true)

  getCountriesByCodes(INITIAL_COUNTRY_CODES)
    .then((initialCountries) => {
      setResults(initialCountries)
      setHasSearched(true)
    })
    .catch(() => {
      setErrorMessage(REQUEST_ERROR_MESSAGE)
      setHasSearched(true)
    })
    .finally(() => {
      setIsLoading(false)
    })
}

function DataPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    // Restaura o ultimo estado salvo quando o usuario volta ao site.
    const savedState = window.localStorage.getItem(STORAGE_KEY)

    if (!savedState) {
      setQuery('')
      loadInitialCountries(setResults, setHasSearched, setErrorMessage, setIsLoading)
      return
    }

    try {
      const parsedState = JSON.parse(savedState)

      setQuery(parsedState.query || '')
      setResults(parsedState.results || [])
      setHasSearched(Boolean(parsedState.hasSearched))
      setVisibleCount(parsedState.visibleCount || INITIAL_VISIBLE_COUNT)

      const hasSavedResults = Array.isArray(parsedState.results) && parsedState.results.length > 0

      if (!hasSavedResults) {
        setQuery('')
        loadInitialCountries(
          setResults,
          setHasSearched,
          setErrorMessage,
          setIsLoading,
        )
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    // Salva busca e resultados para manter o contexto no refresh.
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        query,
        results,
        hasSearched,
        visibleCount,
      }),
    )
  }, [query, results, hasSearched, visibleCount])

  const handleSearch = async (searchQuery) => {
    const normalizedQuery = searchQuery.trim()

    if (!normalizedQuery) {
      setErrorMessage(EMPTY_QUERY_MESSAGE)
      setHasSearched(false)
      return
    }

    setErrorMessage('')
    setIsLoading(true)
    setHasSearched(false)
    setVisibleCount(INITIAL_VISIBLE_COUNT)

    const resolvedQuery = resolveSearchQuery(normalizedQuery)

    try {
      const fetchedResults = await searchCountriesByName(resolvedQuery)
      const matchedResults = fetchedResults.filter((item) =>
        isCountryMatch(item, normalizedQuery, resolvedQuery),
      )
      const finalResults = matchedResults.length > 0 ? matchedResults : fetchedResults

      setResults(finalResults)
      setHasSearched(true)
      await saveSearchLog(normalizedQuery, finalResults.length)
    } catch {
      try {
        // Fallback: se a busca direta falhar, filtra localmente com /all.
        const allCountries = await getAllCountries()
        const fallbackResults = allCountries.filter((item) =>
          isCountryMatch(item, normalizedQuery, resolvedQuery),
        )

        setResults(fallbackResults)
        setHasSearched(true)
        await saveSearchLog(normalizedQuery, fallbackResults.length)
      } catch {
        setResults([])
        setErrorMessage(REQUEST_ERROR_MESSAGE)
        setHasSearched(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="data-page">
      <h2 className="data-page__title">Dados da API</h2>
      <p className="data-page__text">
        Busque por nome de pais para ver bandeira, capital e populacao. Alguns
        resultados iniciais ja aparecem para facilitar a demonstracao.
      </p>

      <SearchForm
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
      />

      {errorMessage && <p className="data-page__error">{errorMessage}</p>}

      {isLoading && <Preloader />}

      {hasSearched && !isLoading && !errorMessage && results.length > 0 && (
        <p className="data-page__count">
          Resultado(s) encontrado(s): {results.length}
        </p>
      )}

      {hasSearched && !isLoading && !errorMessage && results.length === 0 && (
        <NotFound />
      )}

      {results.length > 0 && (
        <ul className="data-page__list">
          {results.slice(0, visibleCount).map((item) => (
            <ResultCard
              key={item.cca3}
              item={item}
              onOpenDetails={setSelectedCountry}
            />
          ))}
        </ul>
      )}

      {results.length > visibleCount && (
        <button
          type="button"
          className="data-page__more-button"
          onClick={() => setVisibleCount((count) => count + 3)}
        >
          Mostrar mais
        </button>
      )}

      <CountryModal country={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </main>
  )
}

export default DataPage

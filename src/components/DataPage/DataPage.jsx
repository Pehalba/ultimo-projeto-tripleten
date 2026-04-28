import './DataPage.css'
import { useEffect, useState } from 'react'
import SearchForm from '../SearchForm/SearchForm'
import Preloader from '../Preloader/Preloader'
import NotFound from '../NotFound/NotFound'
import ResultCard from '../ResultCard/ResultCard'
import { searchCountriesByName } from '../../utils/restCountriesApi'
import { saveSearchLog } from '../../utils/searchLogApi'

const REQUEST_ERROR_MESSAGE =
  'Desculpe, algo deu errado durante a solicitação. Pode haver um problema de conexão ou o servidor pode estar inativo. Por favor, tente novamente mais tarde.'
const EMPTY_QUERY_MESSAGE = 'Por favor, insira uma palavra-chave'
const STORAGE_KEY = 'countries-search-state'
const INITIAL_VISIBLE_COUNT = 3

function DataPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  useEffect(() => {
    const savedState = window.localStorage.getItem(STORAGE_KEY)

    if (!savedState) {
      return
    }

    try {
      const parsedState = JSON.parse(savedState)

      setQuery(parsedState.query || '')
      setResults(parsedState.results || [])
      setHasSearched(Boolean(parsedState.hasSearched))
      setVisibleCount(parsedState.visibleCount || INITIAL_VISIBLE_COUNT)
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
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

    try {
      const fetchedResults = await searchCountriesByName(normalizedQuery)
      setResults(fetchedResults)
      setHasSearched(true)
      await saveSearchLog(normalizedQuery, fetchedResults.length)
    } catch {
      setResults([])
      setErrorMessage(REQUEST_ERROR_MESSAGE)
      setHasSearched(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="data-page">
      <h2 className="data-page__title">Dados da API</h2>
      <p className="data-page__text">
        Busque por nome de pais para ver bandeira, capital e populacao.
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
            <ResultCard key={item.cca3} item={item} />
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
    </main>
  )
}

export default DataPage

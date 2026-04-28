import './DataPage.css'
import { useState } from 'react'
import SearchForm from '../SearchForm/SearchForm'
import Preloader from '../Preloader/Preloader'
import NotFound from '../NotFound/NotFound'
import ResultCard from '../ResultCard/ResultCard'
import mockData from '../../utils/mockData'

function DataPage() {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (query) => {
    setIsLoading(true)
    setHasSearched(false)

    window.setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim()

      const filtered = mockData.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery)
        )
      })

      setResults(filtered)
      setHasSearched(true)
      setIsLoading(false)
    }, 700)
  }

  return (
    <main className="data-page">
      <h2 className="data-page__title">Dados da API</h2>
      <p className="data-page__text">Busque por pokemon, pais ou receita.</p>

      <SearchForm onSearch={handleSearch} />

      {isLoading && <Preloader />}

      {hasSearched && !isLoading && results.length === 0 && <NotFound />}

      {results.length > 0 && (
        <ul className="data-page__list">
          {results.map((item) => (
            <ResultCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </main>
  )
}

export default DataPage

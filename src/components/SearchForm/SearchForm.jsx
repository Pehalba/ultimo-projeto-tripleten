import { useState } from 'react'
import './SearchForm.css'

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!query.trim()) {
      setError('Digite um termo para buscar.')
      return
    }

    setError('')
    onSearch(query)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label className="search-form__label" htmlFor="search-input">
        Buscar dados
      </label>
      <div className="search-form__row">
        <input
          id="search-input"
          className="search-form__input"
          type="text"
          placeholder="Ex: pokemon, pais, receita"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="search-form__button" type="submit">
          Buscar
        </button>
      </div>
      {error && <p className="search-form__error">{error}</p>}
    </form>
  )
}

export default SearchForm

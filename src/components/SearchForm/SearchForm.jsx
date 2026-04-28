import './SearchForm.css'

function SearchForm({ query, onQueryChange, onSearch }) {
  const handleSubmit = (event) => {
    event.preventDefault()
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
          placeholder="Ex: brasil, japan, canada"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <button className="search-form__button" type="submit">
          Buscar
        </button>
      </div>
    </form>
  )
}

export default SearchForm

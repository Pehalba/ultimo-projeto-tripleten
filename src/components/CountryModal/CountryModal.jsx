import './CountryModal.css'

function CountryModal({ country, onClose }) {
  // So renderiza o popup quando existe um pais selecionado.
  if (!country) {
    return null
  }

  const displayName =
    country.translations?.por?.official ||
    country.translations?.por?.common ||
    country.name?.common

  const languages = country.languages
    ? Object.values(country.languages).join(', ')
    : 'Nao informadas'

  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(', ')
    : 'Nao informadas'

  return (
    // Clique fora do card fecha o popup.
    <div className="country-modal" onClick={onClose}>
      <div
        className="country-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="country-modal__close" type="button" onClick={onClose}>
          X
        </button>

        <img
          className="country-modal__flag"
          src={country.flags?.png}
          alt={`Bandeira de ${displayName}`}
        />

        <h3 className="country-modal__title">{displayName}</h3>
        <p className="country-modal__text">
          Continente: {country.continents ? country.continents.join(', ') : '-'}
        </p>
        <p className="country-modal__text">
          Capital: {country.capital ? country.capital[0] : 'Nao informada'}
        </p>
        <p className="country-modal__text">Regiao: {country.region}</p>
        <p className="country-modal__text">
          Populacao: {country.population?.toLocaleString('pt-BR')}
        </p>
        <p className="country-modal__text">Idiomas: {languages}</p>
        <p className="country-modal__text">Moedas: {currencies}</p>
      </div>
    </div>
  )
}

export default CountryModal

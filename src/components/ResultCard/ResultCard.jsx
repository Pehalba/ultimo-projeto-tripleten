import './ResultCard.css'

function ResultCard({ item, onOpenDetails }) {
  const displayName =
    item.translations?.por?.official ||
    item.translations?.por?.common ||
    item.name?.common
  const flagAltText = `Bandeira de ${displayName || 'um pais'}`

  return (
    <li className="result-card">
      <img
        className="result-card__flag"
        src={item.flags?.png}
        alt={flagAltText}
        loading="lazy"
      />
      <h3 className="result-card__title">{displayName}</h3>
      <p className="result-card__description">
        Capital: {item.capital ? item.capital[0] : 'Nao informada'}
      </p>
      <p className="result-card__description">Regiao: {item.region}</p>
      <p className="result-card__category">
        Populacao: {item.population?.toLocaleString('pt-BR')}
      </p>
      <button
        className="result-card__button"
        type="button"
        onClick={() => onOpenDetails(item)}
      >
        Ver mais
      </button>
    </li>
  )
}

export default ResultCard

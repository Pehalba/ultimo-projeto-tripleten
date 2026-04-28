import './ResultCard.css'

function ResultCard({ item }) {
  const flagAltText = `Bandeira de ${item.name?.common || 'um pais'}`

  return (
    <li className="result-card">
      <img
        className="result-card__flag"
        src={item.flags?.png}
        alt={flagAltText}
        loading="lazy"
      />
      <h3 className="result-card__title">{item.name?.common}</h3>
      <p className="result-card__description">
        Capital: {item.capital ? item.capital[0] : 'Nao informada'}
      </p>
      <p className="result-card__description">Regiao: {item.region}</p>
      <p className="result-card__category">
        Populacao: {item.population?.toLocaleString('pt-BR')}
      </p>
    </li>
  )
}

export default ResultCard

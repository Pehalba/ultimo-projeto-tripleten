import './ResultCard.css'

function ResultCard({ item }) {
  return (
    <li className="result-card">
      <h3 className="result-card__title">{item.title}</h3>
      <p className="result-card__description">{item.description}</p>
      <p className="result-card__category">Categoria: {item.category}</p>
    </li>
  )
}

export default ResultCard

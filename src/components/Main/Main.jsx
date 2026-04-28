import './Main.css'
import { Link } from 'react-router-dom'

function Main() {
  return (
    <main className="main">
      <section className="main__hero">
        <h2 className="main__title">Pagina principal</h2>
        <p className="main__text">
          Este projeto foi desenvolvido para buscar paises em uma API publica e
          mostrar os resultados em cards.
        </p>
        <p className="main__text">
          Na pagina Dados da API voce pode pesquisar por nome de pais e ver
          informacoes como bandeira, capital, regiao e populacao.
        </p>
        <Link className="main__button" to="/dados">
          Ver dados da API
        </Link>
      </section>

      <section className="main__guide">
        <h3 className="main__guide-title">Como usar</h3>
        <ol className="main__guide-list">
          <li className="main__guide-item">Digite o nome de um pais.</li>
          <li className="main__guide-item">Clique no botao Buscar.</li>
          <li className="main__guide-item">
            Use Ver mais para abrir os detalhes do pais.
          </li>
        </ol>
      </section>
    </main>
  )
}

export default Main

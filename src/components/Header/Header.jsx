import './Header.css'
import { Link } from 'react-router-dom'
import Navigation from '../Navigation/Navigation'

function Header() {
  return (
    <header className="header">
      <h1 className="header__title">
        <Link className="header__home-link" to="/">
          Projeto Final TripleTen
        </Link>
      </h1>
      <Navigation />
    </header>
  )
}

export default Header

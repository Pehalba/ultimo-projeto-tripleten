import './Navigation.css'
import { NavLink } from 'react-router-dom'

function Navigation() {
  const getLinkClassName = ({ isActive }) =>
    `navigation__link ${isActive ? 'navigation__link_active' : ''}`

  return (
    <nav className="navigation">
      <NavLink className={getLinkClassName} to="/">
        Início
      </NavLink>
      <NavLink className={getLinkClassName} to="/dados">
        Dados da API
      </NavLink>
    </nav>
  )
}

export default Navigation

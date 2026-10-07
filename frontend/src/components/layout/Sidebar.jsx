import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { isArrendatario } from '../../utils/roles'

export default function Sidebar() {
  const { user } = useAuth()
  const contractsLabel = isArrendatario(user?.role) ? 'Mis contratos' : 'Contratos'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="icon">🏠</span> Arrenda
      </div>
      <nav>
        <NavLink to="/panel" className={({ isActive }) => (isActive ? 'active' : '')}>
          📊 Panel
        </NavLink>
        <NavLink to="/contratos" className={({ isActive }) => (isActive ? 'active' : '')}>
          📄 {contractsLabel}
        </NavLink>
        <NavLink to="/perfil" className={({ isActive }) => (isActive ? 'active' : '')}>
          👤 Perfil
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <div>{user?.nombre || 'Usuario'}</div>
        <div className="role-badge">{user?.role || '—'}</div>
      </div>
    </aside>
  )
}

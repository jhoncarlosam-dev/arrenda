import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { initials } from '../../utils/formatters'
import { isArrendador } from '../../utils/roles'
import Button from '../ui/Button'

export default function Topbar({ title, subtitle, actions, showNewContract }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  return (
    <header className="topbar">
      <div>
        {subtitle}
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        {actions}
        {showNewContract && isArrendador(user?.role) && (
          <Button variant="primary" onClick={() => navigate('/contratos/nuevo')}>
            + Nuevo contrato
          </Button>
        )}
        <div ref={ref} style={{ position: 'relative' }}>
          <button type="button" className="user-menu" onClick={() => setOpen((v) => !v)}>
            <div className="avatar">{initials(user?.nombre)}</div>
            <span>{user?.nombre}</span>
          </button>
          {open && (
            <div className="dropdown-menu">
              <Link to="/perfil" onClick={() => setOpen(false)}>
                Perfil
              </Link>
              <button type="button" onClick={() => logout()}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

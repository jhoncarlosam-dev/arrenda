import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Spinner from '../components/ui/Spinner'

export default function PrivateRoute({ children, roles }) {
  const { isAuthenticated, loading, role } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Spinner label="Cargando sesión…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/panel" replace />
  }

  return children
}

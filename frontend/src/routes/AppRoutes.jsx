import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import VerifyEmailPage from '../pages/auth/VerifyEmailPage'
import DashboardPage from '../pages/DashboardPage'
import ContractDetailPage from '../pages/contracts/ContractDetailPage'
import ContractFormPage from '../pages/contracts/ContractFormPage'
import ContractsPage from '../pages/contracts/ContractsPage'
import ProfilePage from '../pages/profile/ProfilePage'
import { ROLES } from '../utils/roles'
import PrivateRoute from './PrivateRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/recuperar" element={<ForgotPasswordPage />} />
      <Route path="/restablecer" element={<ResetPasswordPage />} />
      <Route path="/verificar-email" element={<VerifyEmailPage />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/panel" replace />} />
        <Route path="/panel" element={<DashboardPage />} />
        <Route path="/contratos" element={<ContractsPage />} />
        <Route
          path="/contratos/nuevo"
          element={
            <PrivateRoute roles={[ROLES.ARRENDADOR]}>
              <ContractFormPage mode="create" />
            </PrivateRoute>
          }
        />
        <Route path="/contratos/:id" element={<ContractDetailPage />} />
        <Route
          path="/contratos/:id/editar"
          element={
            <PrivateRoute roles={[ROLES.ARRENDADOR]}>
              <ContractFormPage mode="edit" />
            </PrivateRoute>
          }
        />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/panel" replace />} />
    </Routes>
  )
}

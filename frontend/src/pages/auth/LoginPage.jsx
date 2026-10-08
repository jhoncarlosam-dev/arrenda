import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import AuthLayout from '../../components/layout/AuthLayout'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { withNativeValues } from '../../utils/formSubmit'

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '', remember: false } })

  if (!loading && isAuthenticated) {
    return <Navigate to={location.state?.from || '/panel'} replace />
  }

  const onSubmit = async ({ email, password, remember }) => {
    setFormError('')
    try {
      await login(email, password, remember)
      navigate(location.state?.from || '/panel', { replace: true })
    } catch (error) {
      setFormError(
        error.response?.status === 401
          ? 'Correo o contraseña incorrectos.'
          : getApiErrorMessage(error),
      )
    }
  }

  return (
    <AuthLayout
      tagline="Gestión de contratos de arriendo para arrendadores y arrendatarios en Colombia."
      features={[
        'Crea y administra contratos de arrendamiento',
        'Consulta contratos y exporta recibos en PDF/PNG',
        'Gestión segura con roles y autenticación JWT',
      ]}
    >
      <h2>Iniciar sesión</h2>
      <p className="subtitle">Ingresa con tu correo y contraseña</p>
      {formError && <Alert variant="error">{formError}</Alert>}
      <form onSubmit={withNativeValues(handleSubmit, onSubmit, setValue)}>
        <Input
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="tu@correo.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'El correo es obligatorio.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Ingresa un correo electrónico válido.',
            },
          })}
        />
        <Input
          id="password"
          type="password"
          label="Contraseña"
          error={errors.password?.message}
          {...register('password', { required: 'La contraseña es obligatoria.' })}
        />
        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400 }}>
            <input type="checkbox" {...register('remember')} /> Recordarme
          </label>
          <Link to="/recuperar" className="link">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button type="submit" variant="primary" disabled={isSubmitting} style={{ width: '100%', marginTop: 8 }}>
          {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </form>
      <p className="text-center mt-4" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="link">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  )
}

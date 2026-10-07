import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../../api/usersApi'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { withNativeValues } from '../../utils/formSubmit'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async ({ email }) => {
    try {
      await requestPasswordReset(email)
    } catch {
      // Mensaje genérico anti-enumeración
    }
    setSent(true)
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <h1 style={{ color: 'var(--color-title)', fontSize: '1.5rem' }}>Arrenda</h1>
      </div>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px 48px' }}>
        <div className="auth-card card" style={{ padding: 32, maxWidth: 'none' }}>
          <h2>Recuperar contraseña</h2>
          <p className="subtitle">Te enviaremos un enlace si el correo está registrado</p>
          {sent && (
            <Alert variant="success">
              Si ese correo está registrado, recibirás un enlace en breve.
            </Alert>
          )}
          <form onSubmit={withNativeValues(handleSubmit, onSubmit, setValue)}>
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="tu@correo.com"
              error={errors.email?.message}
              {...register('email', { required: 'El correo es obligatorio.' })}
            />
            <Button type="submit" variant="primary" disabled={isSubmitting} style={{ width: '100%' }}>
              {isSubmitting ? 'Enviando…' : 'Enviar enlace'}
            </Button>
          </form>
          <p className="text-center mt-4">
            <Link to="/login" className="link">
              ← Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { confirmEmailVerification } from '../../api/usersApi'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getApiErrorMessage } from '../../utils/apiErrors'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [done, setDone] = useState(false)
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { token: params.get('token') || '' },
  })

  const onSubmit = async ({ token }) => {
    setFormError('')
    try {
      await confirmEmailVerification(token)
      setDone(true)
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No se pudo verificar el correo.'))
    }
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '48px 16px' }}>
      <div style={{ maxWidth: 480, margin: '32px auto' }} className="card">
        <div className="card-body text-center">
          <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
          <h2 style={{ color: 'var(--color-title)', marginBottom: 8 }}>Verificar correo</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
            Hemos enviado un enlace de verificación a tu correo. Haz clic en el enlace o ingresa el
            token recibido.
          </p>
          {done && <Alert variant="success">Tu correo está verificado. Ya puedes iniciar sesión.</Alert>}
          {formError && <Alert variant="error">{formError}</Alert>}
          {!done && (
            <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'left' }}>
              <Input
                id="token"
                label="Token de verificación"
                placeholder="Pega el token aquí"
                error={errors.token?.message}
                {...register('token', { required: 'El token es obligatorio.' })}
              />
              <Button type="submit" variant="primary" disabled={isSubmitting} style={{ width: '100%' }}>
                {isSubmitting ? 'Confirmando…' : 'Confirmar email'}
              </Button>
            </form>
          )}
          <p className="text-center mt-4">
            <Link to="/login" className="link">
              Ir a iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

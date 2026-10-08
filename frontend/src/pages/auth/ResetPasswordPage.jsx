import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { confirmPasswordReset } from '../../api/usersApi'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { withNativeValues } from '../../utils/formSubmit'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { token: params.get('token') || '' },
  })

  const onSubmit = async ({ token, new_password }) => {
    setFormError('')
    try {
      await confirmPasswordReset(token, new_password)
      toast.success('Contraseña restablecida. Inicia sesión.')
      navigate('/login')
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'No se pudo restablecer la contraseña.'))
    }
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <h1 style={{ color: 'var(--color-title)', fontSize: '1.5rem' }}>Arrenda</h1>
      </div>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px 48px' }}>
        <div className="auth-card card" style={{ padding: 32, maxWidth: 'none' }}>
          <h2>Nueva contraseña</h2>
          <p className="subtitle">Ingresa tu nueva contraseña</p>
          {formError && <Alert variant="error">{formError}</Alert>}
          <form onSubmit={withNativeValues(handleSubmit, onSubmit, setValue)}>
            <Input
              id="token"
              label="Token"
              placeholder="Pega el token del correo"
              error={errors.token?.message}
              {...register('token', { required: 'El token es obligatorio.' })}
            />
            <Input
              id="new-pass"
              type="password"
              label="Nueva contraseña"
              hint="Mínimo 8 caracteres"
              error={errors.new_password?.message}
              {...register('new_password', {
                required: 'La contraseña es obligatoria.',
                minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres.' },
              })}
            />
            <Input
              id="confirm-pass"
              type="password"
              label="Confirmar contraseña"
              error={errors.confirm?.message}
              {...register('confirm', {
                validate: (v) => v === watch('new_password') || 'Las contraseñas no coinciden.',
              })}
            />
            <Button type="submit" variant="primary" disabled={isSubmitting} style={{ width: '100%' }}>
              {isSubmitting ? 'Guardando…' : 'Restablecer contraseña'}
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

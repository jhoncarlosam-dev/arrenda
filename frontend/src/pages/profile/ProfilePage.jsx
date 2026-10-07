import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { changePassword, requestEmailVerification, updateMe } from '../../api/usersApi'
import { useAuth } from '../../auth/AuthContext'
import Topbar from '../../components/layout/Topbar'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { formatDateLong } from '../../utils/formatters'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [tab, setTab] = useState('datos')
  const [requesting, setRequesting] = useState(false)

  const profileForm = useForm({
    values: {
      nombre: user?.nombre || '',
      email: user?.email || '',
    },
  })
  const passwordForm = useForm()

  const onSaveProfile = async (values) => {
    try {
      await updateMe(values)
      await refreshUser()
      toast.success('Perfil actualizado')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const onChangePassword = async (values) => {
    try {
      await changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      })
      passwordForm.reset()
      toast.success('Contraseña actualizada')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo cambiar la contraseña.'))
    }
  }

  const onRequestVerify = async () => {
    setRequesting(true)
    try {
      await requestEmailVerification()
      toast.success('Si el envío de correo está activo, recibirás un enlace en breve.')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setRequesting(false)
    }
  }

  return (
    <>
      <Topbar title="Mi perfil" />
      <main className="page-body">
        {user && !user.is_verified && (
          <Alert variant="warning">
            ⚠️ Tu correo no está verificado.{' '}
            <button
              type="button"
              className="link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              onClick={onRequestVerify}
              disabled={requesting}
            >
              Solicitar verificación
            </button>
          </Alert>
        )}
        {user?.is_verified && (
          <Alert variant="success">Tu correo está verificado.</Alert>
        )}
        <div className="tabs">
          <button type="button" className={`tab ${tab === 'datos' ? 'active' : ''}`} onClick={() => setTab('datos')}>
            Datos personales
          </button>
          <button
            type="button"
            className={`tab ${tab === 'password' ? 'active' : ''}`}
            onClick={() => setTab('password')}
          >
            Cambiar contraseña
          </button>
          <button
            type="button"
            className={`tab ${tab === 'email' ? 'active' : ''}`}
            onClick={() => setTab('email')}
          >
            Verificación de email
          </button>
        </div>

        {tab === 'datos' && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div className="card-header">
              <h3>Información de la cuenta</h3>
            </div>
            <div className="card-body">
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)}>
                <Input
                  id="nombre"
                  label="Nombre completo"
                  error={profileForm.formState.errors.nombre?.message}
                  {...profileForm.register('nombre', { required: 'El nombre es obligatorio.' })}
                />
                <Input
                  id="email"
                  type="email"
                  label="Correo electrónico"
                  hint="Al cambiar el email, deberás verificarlo nuevamente."
                  error={profileForm.formState.errors.email?.message}
                  {...profileForm.register('email', { required: 'El correo es obligatorio.' })}
                />
                <div className="form-group">
                  <label>Tipo de cuenta</label>
                  <div>
                    <Badge>{user?.role}</Badge>
                  </div>
                  <p className="form-hint">El rol no se puede cambiar después del registro.</p>
                </div>
                <div className="form-group">
                  <label>Miembro desde</label>
                  <div className="value" style={{ color: 'var(--color-title)' }}>
                    {formatDateLong(user?.created_at)}
                  </div>
                </div>
                <Button type="submit" variant="primary" disabled={profileForm.formState.isSubmitting}>
                  {profileForm.formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {tab === 'password' && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div className="card-header">
              <h3>Cambiar contraseña</h3>
            </div>
            <div className="card-body">
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)}>
                <Input
                  id="current"
                  type="password"
                  label="Contraseña actual"
                  error={passwordForm.formState.errors.current_password?.message}
                  {...passwordForm.register('current_password', {
                    required: 'Indica tu contraseña actual.',
                  })}
                />
                <Input
                  id="new"
                  type="password"
                  label="Nueva contraseña"
                  hint="Mínimo 8 caracteres"
                  error={passwordForm.formState.errors.new_password?.message}
                  {...passwordForm.register('new_password', {
                    required: 'La nueva contraseña es obligatoria.',
                    minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres.' },
                  })}
                />
                <Button type="submit" variant="secondary" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? 'Guardando…' : 'Actualizar contraseña'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {tab === 'email' && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div className="card-header">
              <h3>Verificación de email</h3>
            </div>
            <div className="card-body">
              {user?.is_verified ? (
                <Alert variant="success">Tu correo está verificado.</Alert>
              ) : (
                <>
                  <p style={{ marginBottom: 16, color: 'var(--color-text-muted)' }}>
                    El backend registra el token de verificación en logs (el envío de correo aún es
                    un stub). Puedes solicitar el token y pegarlo en{' '}
                    <a href="/verificar-email" className="link">
                      Verificar correo
                    </a>
                    .
                  </p>
                  <Button variant="primary" onClick={onRequestVerify} disabled={requesting}>
                    {requesting ? 'Solicitando…' : 'Solicitar verificación'}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register as registerUser } from '../../api/authApi'
import AuthLayout from '../../components/layout/AuthLayout'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { ROLES } from '../../utils/roles'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: ROLES.ARRENDADOR } })

  const onSubmit = async (values) => {
    setFormError('')
    try {
      await registerUser({
        nombre: values.nombre,
        email: values.email,
        password: values.password,
        role: values.role,
      })
      toast.success('Cuenta creada. Revisa tu correo para verificar tu cuenta.')
      navigate('/login')
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      tagline="Únete a la plataforma y comienza a gestionar tus contratos de arriendo."
      features={[
        'Registro gratuito para arrendadores y arrendatarios',
        'Verificación de correo electrónico',
        'Interfaz simple y en español',
      ]}
    >
      <h2>Crear cuenta</h2>
      <p className="subtitle">Completa tus datos para registrarte</p>
      {formError && <Alert variant="error">{formError}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="nombre"
          label="Nombre completo"
          placeholder="María Gómez"
          error={errors.nombre?.message}
          {...register('nombre', { required: 'El nombre es obligatorio.' })}
        />
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
          hint="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register('password', {
            required: 'La contraseña es obligatoria.',
            minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres.' },
          })}
        />
        <Select
          id="role"
          label="Tipo de cuenta"
          hint="El rol no se puede cambiar después del registro."
          {...register('role')}
        >
          <option value={ROLES.ARRENDADOR}>Arrendador — propietario del inmueble</option>
          <option value={ROLES.ARRENDATARIO}>Arrendatario — inquilino</option>
        </Select>
        <Button type="submit" variant="primary" disabled={isSubmitting} style={{ width: '100%', marginTop: 8 }}>
          {isSubmitting ? 'Creando…' : 'Crear cuenta'}
        </Button>
      </form>
      <p className="text-center mt-4" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="link">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  )
}

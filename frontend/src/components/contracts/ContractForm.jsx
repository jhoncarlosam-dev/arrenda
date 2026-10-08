import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { getUserById } from '../../api/usersApi'
import { withNativeValues } from '../../utils/formSubmit'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

function clausesToText(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

export default function ContractForm({ defaultValues, submitting, onSubmit, submitLabel }) {
  const navigate = useNavigate()
  const [lookup, setLookup] = useState(null)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      arrendatario_id: defaultValues?.arrendatario_id || '',
      direccion: defaultValues?.direccion || '',
      tipo: defaultValues?.tipo || 'residencial',
      valor: defaultValues?.valor ?? '',
      servicios: defaultValues?.servicios || '',
      clausulas_opcionales: clausesToText(defaultValues?.clausulas_opcionales),
    },
  })

  const arrendatarioId = watch('arrendatario_id')

  useEffect(() => {
    const id = Number(arrendatarioId)
    if (!id) {
      setLookup(null)
      return undefined
    }
    let cancelled = false
    getUserById(id)
      .then(({ data }) => {
        if (!cancelled) setLookup(data)
      })
      .catch(() => {
        if (!cancelled) setLookup({ missing: true, id })
      })
    return () => {
      cancelled = true
    }
  }, [arrendatarioId])

  const submit = (values) => {
    let clausulas = null
    const raw = values.clausulas_opcionales?.trim()
    if (raw) {
      try {
        clausulas = JSON.parse(raw)
      } catch {
        setError('clausulas_opcionales', {
          message: 'El JSON de cláusulas no es válido.',
        })
        return
      }
    }
    onSubmit({
      arrendatario_id: Number(values.arrendatario_id),
      direccion: values.direccion,
      tipo: values.tipo,
      valor: Number(String(values.valor).replace(/[^\d.]/g, '')),
      servicios: values.servicios || null,
      clausulas_opcionales: clausulas,
    })
  }

  return (
    <form onSubmit={withNativeValues(handleSubmit, submit, setValue)}>
      <Input
        id="arrendatario_id"
        label="Arrendatario"
        type="number"
        placeholder="ID del arrendatario registrado"
        error={errors.arrendatario_id?.message}
        hint={
          lookup?.missing
            ? 'No se encontró un usuario con ese ID. Puedes guardar igual si el backend lo acepta.'
            : lookup?.nombre
              ? `${lookup.nombre}${lookup.email ? ` — ${lookup.email}` : ''} (ID: ${lookup.id})`
              : 'El arrendatario debe estar registrado en la plataforma.'
        }
        {...register('arrendatario_id', {
          required: 'Indica el ID del arrendatario.',
          min: { value: 1, message: 'ID inválido.' },
        })}
      />
      <Input
        id="direccion"
        label="Dirección del inmueble"
        placeholder="Calle, número, ciudad"
        error={errors.direccion?.message}
        {...register('direccion', { required: 'La dirección es obligatoria.' })}
      />
      <div className="detail-grid">
        <Select
          id="tipo"
          label="Tipo de inmueble"
          error={errors.tipo?.message}
          {...register('tipo', { required: 'Selecciona un tipo.' })}
        >
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
          <option value="mixto">Mixto</option>
        </Select>
        <Input
          id="valor"
          label="Valor mensual (COP)"
          placeholder="1200000"
          error={errors.valor?.message}
          {...register('valor', { required: 'El valor es obligatorio.' })}
        />
      </div>
      <Input
        id="servicios"
        label="Servicios incluidos"
        placeholder="Agua, Luz, Gas…"
        hint="Opcional. Separa con comas."
        {...register('servicios')}
      />
      <Textarea
        id="clausulas"
        label="Cláusulas opcionales (JSON)"
        rows={4}
        placeholder='{"mascotas": "no permitidas"}'
        hint="Opcional. Formato JSON para cláusulas adicionales."
        error={errors.clausulas_opcionales?.message}
        {...register('clausulas_opcionales')}
      />
      <div className="flex gap-2" style={{ marginTop: 8 }}>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Guardando…' : submitLabel}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/contratos')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

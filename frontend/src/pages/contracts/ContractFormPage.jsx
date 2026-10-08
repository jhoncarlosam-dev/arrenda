import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createContract, getContract, updateContract } from '../../api/contractsApi'
import { useAuth } from '../../auth/AuthContext'
import ContractForm from '../../components/contracts/ContractForm'
import Topbar from '../../components/layout/Topbar'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { fieldErrorsFromApi, getApiErrorMessage } from '../../utils/apiErrors'
import { isArrendador } from '../../utils/roles'

export default function ContractFormPage({ mode }) {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [contract, setContract] = useState(null)

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false
    getContract(id)
      .then(({ data }) => {
        if (!cancelled) setContract(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  if (!isArrendador(user?.role)) {
    return <Navigate to="/contratos" replace />
  }

  const onSubmit = async (payload) => {
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        const { data } = await updateContract(id, payload)
        toast.success('Contrato actualizado')
        navigate(`/contratos/${data.id}`)
      } else {
        const { data } = await createContract(payload)
        toast.success('Contrato creado')
        navigate(`/contratos/${data.id}`)
      }
    } catch (err) {
      const fields = fieldErrorsFromApi(err)
      setError(
        Object.values(fields)[0] || getApiErrorMessage(err, 'No se pudo guardar el contrato.'),
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Topbar
        title={isEdit ? `Editar contrato #${id}` : 'Nuevo contrato'}
        subtitle={
          <Link to="/contratos" className="link" style={{ fontSize: '0.85rem' }}>
            ← Cancelar
          </Link>
        }
      />
      <main className="page-body">
        {error && <Alert variant="error">{error}</Alert>}
        {loading ? (
          <Spinner label="Cargando contrato…" />
        ) : (
          <div className="card" style={{ maxWidth: 720 }}>
            <div className="card-body">
              <ContractForm
                defaultValues={contract}
                submitting={saving}
                onSubmit={onSubmit}
                submitLabel={isEdit ? 'Guardar cambios' : 'Crear contrato'}
              />
            </div>
          </div>
        )}
      </main>
    </>
  )
}

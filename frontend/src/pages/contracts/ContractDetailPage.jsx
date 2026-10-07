import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { deleteContract, getContract } from '../../api/contractsApi'
import { exportReceiptPdf, exportReceiptPng } from '../../api/receiptsApi'
import { useAuth } from '../../auth/AuthContext'
import ReceiptPreview from '../../components/contracts/ReceiptPreview'
import Topbar from '../../components/layout/Topbar'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { useUserDirectory } from '../../hooks/useUserDirectory'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { formatDateLong, formatMoney, tipoBadgeClass, tipoLabel } from '../../utils/formatters'
import { isArrendador, isArrendatario } from '../../utils/roles'

export default function ContractDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getContract(id)
      .then(({ data }) => {
        if (!cancelled) {
          setContract(data)
          setError('')
          setForbidden(false)
        }
      })
      .catch((err) => {
        if (cancelled) return
        if (err.response?.status === 403) {
          setForbidden(true)
          toast.error('No tienes permisos para acceder a este contrato.')
        } else if (err.response?.status === 404) {
          setError('Contrato no encontrado.')
        } else {
          setError(getApiErrorMessage(err))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const { getName } = useUserDirectory(
    contract ? [contract.arrendador_id, contract.arrendatario_id] : [],
  )

  const handleExport = async (format) => {
    const label = format === 'pdf' ? 'PDF' : 'PNG'
    toast.loading(`Exportando recibo ${label}…`, { id: 'export' })
    try {
      if (format === 'pdf') await exportReceiptPdf(contract.id)
      else await exportReceiptPng(contract.id)
      toast.success('Recibo descargado', { id: 'export' })
    } catch (err) {
      toast.error(getApiErrorMessage(err), { id: 'export' })
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteContract(contract.id)
      toast.success('Contrato eliminado')
      navigate('/contratos')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  const backLabel = isArrendatario(user?.role) ? '← Volver a mis contratos' : '← Volver a contratos'
  const clauses = contract?.clausulas_opcionales

  return (
    <>
      <Topbar
        title={contract ? `Contrato #${contract.id}` : 'Contrato'}
        subtitle={
          <Link to="/contratos" className="link" style={{ fontSize: '0.85rem' }}>
            {backLabel}
          </Link>
        }
        actions={
          contract && (
            <div className="flex gap-2">
              {isArrendador(user?.role) && (
                <>
                  <Button variant="secondary" onClick={() => navigate(`/contratos/${contract.id}/editar`)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                    Eliminar
                  </Button>
                </>
              )}
              {isArrendatario(user?.role) && (
                <>
                  <Button variant="primary" onClick={() => handleExport('pdf')}>
                    📄 Exportar PDF
                  </Button>
                  <Button variant="secondary" onClick={() => handleExport('png')}>
                    🖼️ Exportar PNG
                  </Button>
                </>
              )}
            </div>
          )
        }
      />
      <main className="page-body">
        {loading && <Spinner label="Cargando contrato…" />}
        {forbidden && (
          <Alert variant="error">No tienes permisos para acceder a este contrato.</Alert>
        )}
        {error && <Alert variant="error">{error}</Alert>}
        {!loading && !contract && !forbidden && error && (
          <Button variant="secondary" onClick={() => navigate('/contratos')}>
            Volver a la lista
          </Button>
        )}
        {contract && (
          <>
            {isArrendatario(user?.role) && (
              <Alert variant="info">
                ℹ️ Puedes descargar el recibo de arrendamiento en formato PDF o PNG para tus
                registros.
              </Alert>
            )}
            <div className="card">
              <div className="card-header">
                <h3>{contract.direccion || 'Sin dirección'}</h3>
                <span className={`badge ${tipoBadgeClass(contract.tipo)}`}>
                  {tipoLabel(contract.tipo)}
                </span>
              </div>
              <div className="card-body">
                <div className="detail-grid">
                  <div>
                    <div className="detail-field">
                      <div className="label">Valor mensual</div>
                      <div className="value" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                        {formatMoney(contract.valor)} COP
                      </div>
                    </div>
                    <div className="detail-field">
                      <div className="label">Dirección</div>
                      <div className="value">{contract.direccion || '—'}</div>
                    </div>
                    <div className="detail-field">
                      <div className="label">Servicios incluidos</div>
                      <div className="value">{contract.servicios || 'Ninguno'}</div>
                    </div>
                  </div>
                  <div>
                    <div className="detail-field">
                      <div className="label">Arrendador</div>
                      <div className="value">{getName(contract.arrendador_id)}</div>
                    </div>
                    <div className="detail-field">
                      <div className="label">Arrendatario</div>
                      <div className="value">
                        {getName(contract.arrendatario_id)} (ID: {contract.arrendatario_id})
                      </div>
                    </div>
                    <div className="detail-field">
                      <div className="label">Fecha de creación</div>
                      <div className="value">{formatDateLong(contract.created_at)}</div>
                    </div>
                  </div>
                </div>
                {clauses && typeof clauses === 'object' && Object.keys(clauses).length > 0 && (
                  <>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />
                    <h4 style={{ color: 'var(--color-title)', marginBottom: 16 }}>Cláusulas opcionales</h4>
                    <div style={{ background: 'var(--color-bg)', padding: 16, borderRadius: 8, fontSize: '0.9rem' }}>
                      {Object.entries(clauses).map(([key, value]) => (
                        <p key={key} style={{ marginTop: 8 }}>
                          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {isArrendatario(user?.role) && <ReceiptPreview contract={contract} />}
          </>
        )}
      </main>
      <Modal
        open={confirmOpen}
        title="¿Eliminar contrato?"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </>
        }
      >
        <p>
          Esta acción no se puede deshacer. El contrato <strong>#{contract?.id}</strong> será
          eliminado permanentemente.
        </p>
      </Modal>
    </>
  )
}

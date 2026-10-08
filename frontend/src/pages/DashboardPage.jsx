import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { listMyContracts } from '../api/contractsApi'
import { exportReceiptPdf } from '../api/receiptsApi'
import { useAuth } from '../auth/AuthContext'
import ContractCard from '../components/contracts/ContractCard'
import Topbar from '../components/layout/Topbar'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { useUserDirectory } from '../hooks/useUserDirectory'
import { getApiErrorMessage } from '../utils/apiErrors'
import { firstName, formatMoney, formatMoneyCompact } from '../utils/formatters'
import { isArrendador, isArrendatario } from '../utils/roles'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState({ items: [], total: 0 })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listMyContracts({ skip: 0, limit: 100 })
      .then(({ data }) => {
        if (!cancelled) {
          setPage({
            items: data?.items || [],
            total: data?.total ?? (data?.items || []).length,
          })
          setError('')
        }
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
  }, [])

  const counterpartIds = useMemo(
    () =>
      page.items.map((c) =>
        isArrendador(user?.role) ? c.arrendatario_id : c.arrendador_id,
      ),
    [page.items, user?.role],
  )
  const { getName } = useUserDirectory(counterpartIds)

  const stats = useMemo(() => {
    const items = page.items
    const totalValor = items.reduce((sum, c) => sum + Number(c.valor || 0), 0)
    const tenants = new Set(items.map((c) => c.arrendatario_id))
    return {
      count: page.total || items.length,
      totalValor,
      tenants: tenants.size,
    }
  }, [page])

  const recent = page.items.slice(0, 5)
  const arrendador = isArrendador(user?.role)

  const handleExport = async (contract) => {
    toast.loading('Exportando recibo PDF…', { id: 'export' })
    try {
      await exportReceiptPdf(contract.id)
      toast.success('Recibo descargado', { id: 'export' })
    } catch (err) {
      toast.error(getApiErrorMessage(err), { id: 'export' })
    }
  }

  return (
    <>
      <Topbar
        title={arrendador ? 'Panel de control' : `Bienvenida, ${firstName(user?.nombre)}`}
        showNewContract={arrendador}
      />
      <main className="page-body">
        {isArrendatario(user?.role) && user?.is_verified && (
          <Alert variant="info">
            ℹ️ Tu correo está verificado. Puedes exportar recibos de tus contratos activos.
          </Alert>
        )}
        {isArrendatario(user?.role) && user && !user.is_verified && (
          <Alert variant="warning">
            ⚠️ Tu correo no está verificado.{' '}
            <Link to="/perfil" className="link">
              Ir al perfil
            </Link>
          </Alert>
        )}
        {error && <Alert variant="error">{error}</Alert>}
        {loading ? (
          <Spinner label="Cargando contratos…" />
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="label">Contratos activos</div>
                <div className="value">{stats.count}</div>
              </div>
              {arrendador ? (
                <>
                  <div className="stat-card">
                    <div className="label">Ingresos mensuales</div>
                    <div className="value">{formatMoneyCompact(stats.totalValor)}</div>
                  </div>
                  <div className="stat-card">
                    <div className="label">Arrendatarios</div>
                    <div className="value">{stats.tenants}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="stat-card">
                    <div className="label">Canon mensual total</div>
                    <div className="value">{formatMoney(stats.totalValor)}</div>
                  </div>
                  <div className="stat-card">
                    <div className="label">Recibos exportados</div>
                    <div className="value">—</div>
                  </div>
                </>
              )}
            </div>
            <div className="card">
              <div className="card-header">
                <h3>{arrendador ? 'Contratos recientes' : 'Mis contratos'}</h3>
                <Link to="/contratos" className="link">
                  Ver todos →
                </Link>
              </div>
              <div className="card-body" style={{ paddingTop: 12 }}>
                {recent.length === 0 ? (
                  arrendador ? (
                    <EmptyState
                      icon="📄"
                      title="No tienes contratos aún"
                      description="Crea tu primer contrato de arrendamiento para comenzar a gestionar tus inmuebles."
                      ctaLabel="+ Crear contrato"
                      onCta={() => navigate('/contratos/nuevo')}
                    />
                  ) : (
                    <EmptyState
                      icon="🏠"
                      title="No participas en ningún contrato"
                      description="Cuando un arrendador te asigne a un contrato, aparecerá aquí."
                    />
                  )
                ) : (
                  recent.map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      role={user?.role}
                      counterpartName={getName(
                        arrendador ? contract.arrendatario_id : contract.arrendador_id,
                      )}
                      onExport={handleExport}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}

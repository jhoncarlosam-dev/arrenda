import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { listMyContracts } from '../../api/contractsApi'
import { exportReceiptPdf } from '../../api/receiptsApi'
import { useAuth } from '../../auth/AuthContext'
import ContractCard from '../../components/contracts/ContractCard'
import Topbar from '../../components/layout/Topbar'
import Alert from '../../components/ui/Alert'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/Spinner'
import { useUserDirectory } from '../../hooks/useUserDirectory'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { isArrendador, isArrendatario } from '../../utils/roles'

const LIMIT = 20

export default function ContractsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [skip, setSkip] = useState(0)
  const [query, setQuery] = useState('')
  const [tipo, setTipo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState({ items: [], total: 0 })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listMyContracts({ skip, limit: LIMIT })
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
  }, [skip])

  const counterpartIds = useMemo(
    () =>
      page.items.map((c) =>
        isArrendador(user?.role) ? c.arrendatario_id : c.arrendador_id,
      ),
    [page.items, user?.role],
  )
  const { getName } = useUserDirectory(counterpartIds)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return page.items.filter((c) => {
      if (tipo && String(c.tipo).toLowerCase() !== tipo) return false
      if (!q) return true
      const counterpart = getName(
        isArrendador(user?.role) ? c.arrendatario_id : c.arrendador_id,
      )
      return (
        String(c.direccion || '')
          .toLowerCase()
          .includes(q) ||
        String(counterpart).toLowerCase().includes(q) ||
        String(c.id).includes(q)
      )
    })
  }, [page.items, query, tipo, getName, user?.role])

  const handleExport = async (contract) => {
    toast.loading('Exportando recibo PDF…', { id: 'export' })
    try {
      await exportReceiptPdf(contract.id)
      toast.success('Recibo descargado', { id: 'export' })
    } catch (err) {
      toast.error(getApiErrorMessage(err), { id: 'export' })
    }
  }

  const empty = !loading && page.items.length === 0
  const noResults = !loading && page.items.length > 0 && filtered.length === 0

  return (
    <>
      <Topbar
        title={isArrendatario(user?.role) ? 'Mis contratos' : 'Contratos'}
        showNewContract
      />
      <main className="page-body">
        <div className="toolbar">
          <input
            type="search"
            className="search-input"
            placeholder="Buscar por dirección o arrendatario…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 6 }}
          >
            <option value="">Todos los tipos</option>
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>
        {error && <Alert variant="error">{error}</Alert>}
        {loading && <Spinner label="Cargando contratos…" />}
        {empty &&
          (isArrendador(user?.role) ? (
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
          ))}
        {noResults && (
          <EmptyState
            icon="🔍"
            title="Sin resultados"
            description="No hay contratos que coincidan con la búsqueda."
            ctaLabel="Limpiar filtros"
            onCta={() => {
              setQuery('')
              setTipo('')
            }}
          />
        )}
        {!loading &&
          filtered.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              role={user?.role}
              counterpartName={getName(
                isArrendador(user?.role) ? contract.arrendatario_id : contract.arrendador_id,
              )}
              onExport={handleExport}
            />
          ))}
        {!loading && page.total > LIMIT && (
          <Pagination
            skip={skip}
            limit={LIMIT}
            total={page.total}
            onPage={(pageIndex) => setSkip(pageIndex * LIMIT)}
          />
        )}
      </main>
    </>
  )
}

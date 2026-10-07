import { Link } from 'react-router-dom'
import { formatDate, formatMoney, tipoBadgeClass, tipoLabel } from '../../utils/formatters'
import { isArrendador, isArrendatario } from '../../utils/roles'
import Button from '../ui/Button'

export default function ContractCard({
  contract,
  counterpartName,
  role,
  onExport,
  showActions = true,
}) {
  const tipo = contract.tipo
  const counterpartLabel = isArrendador(role) ? 'Arrendatario' : 'Arrendador'
  const counterpartId = isArrendador(role) ? contract.arrendatario_id : contract.arrendador_id

  return (
    <div className="contract-card">
      <div>
        <h4>{contract.direccion || 'Sin dirección'}</h4>
        <div className="contract-meta">
          <span>
            <span className={`badge ${tipoBadgeClass(tipo)}`}>{tipoLabel(tipo)}</span>
          </span>
          {contract.id != null && <span>ID: #{contract.id}</span>}
          <span>
            {counterpartLabel}: {counterpartName || `ID ${counterpartId}`}
          </span>
          {contract.servicios && <span>Servicios: {contract.servicios}</span>}
          {contract.created_at && <span>Creado: {formatDate(contract.created_at)}</span>}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="contract-value">{formatMoney(contract.valor)}/mes</div>
        {showActions && (
          <div className="flex gap-2" style={{ marginTop: 8, justifyContent: 'flex-end' }}>
            <Link to={`/contratos/${contract.id}`} className="btn btn-ghost btn-sm">
              Ver
            </Link>
            {isArrendador(role) && (
              <Link to={`/contratos/${contract.id}/editar`} className="btn btn-secondary btn-sm">
                Editar
              </Link>
            )}
            {isArrendatario(role) && (
              <Button variant="secondary" size="sm" onClick={() => onExport?.(contract)}>
                Exportar recibo
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

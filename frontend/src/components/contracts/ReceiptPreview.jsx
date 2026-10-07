import { formatMoney, tipoLabel } from '../../utils/formatters'

export default function ReceiptPreview({ contract }) {
  if (!contract) return null
  return (
    <div className="card" style={{ marginTop: 24, maxWidth: 680 }}>
      <div className="card-header">
        <h3>Vista previa del recibo</h3>
      </div>
      <div className="card-body" style={{ background: '#fafafa' }}>
        <div
          style={{
            background: 'white',
            border: '2px solid #ddd',
            borderRadius: 8,
            padding: 32,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <h3
            style={{
              color: '#2c3e50',
              borderBottom: '2px solid #3498db',
              paddingBottom: 8,
              marginBottom: 24,
            }}
          >
            Recibo de Arrendamiento
          </h3>
          <p style={{ marginBottom: 12, color: '#333' }}>Contrato ID: {contract.id}</p>
          <p style={{ marginBottom: 12, color: '#333' }}>Dirección: {contract.direccion || '—'}</p>
          <p style={{ marginBottom: 12, color: '#333' }}>Tipo: {tipoLabel(contract.tipo)}</p>
          <p style={{ marginBottom: 12, color: '#333' }}>Valor: {formatMoney(contract.valor)}</p>
          {contract.servicios && <p style={{ color: '#333' }}>Servicios: {contract.servicios}</p>}
        </div>
      </div>
    </div>
  )
}

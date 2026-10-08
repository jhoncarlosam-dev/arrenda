export default function Spinner({ label = 'Cargando…' }) {
  return (
    <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-muted)' }}>
      <div className="spinner" />
      <p>{label}</p>
    </div>
  )
}

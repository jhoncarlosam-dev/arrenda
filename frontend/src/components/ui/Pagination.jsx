export default function Pagination({ skip, limit, total, onPage }) {
  const pageCount = Math.max(1, Math.ceil((total || 0) / limit))
  const current = Math.floor(skip / limit) + 1
  const pages = []
  for (let i = 1; i <= pageCount; i += 1) {
    if (pageCount > 7 && Math.abs(i - current) > 2 && i !== 1 && i !== pageCount) {
      if (pages[pages.length - 1] !== '…') pages.push('…')
      continue
    }
    pages.push(i)
  }

  const from = total === 0 ? 0 : skip + 1
  const to = Math.min(skip + limit, total)

  return (
    <>
      <div className="pagination">
        <button type="button" disabled={current <= 1} onClick={() => onPage(current - 2)}>
          ← Anterior
        </button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`e-${idx}`} style={{ padding: '8px' }}>
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={p === current ? 'active' : ''}
              onClick={() => onPage(p - 1)}
            >
              {p}
            </button>
          ),
        )}
        <button type="button" disabled={current >= pageCount} onClick={() => onPage(current)}>
          Siguiente →
        </button>
      </div>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: 12 }}>
        Mostrando {from}–{to} de {total} contratos
      </p>
    </>
  )
}

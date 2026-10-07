const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatMoney(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  return cop.format(n)
}

export function formatMoneyCompact(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '—'
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    const text = Number.isInteger(m) ? String(m) : m.toFixed(1).replace('.', ',')
    return `$${text}M`
  }
  return formatMoney(n)
}

export function formatDate(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateLong(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function initials(nombre = '') {
  const parts = String(nombre).trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function tipoLabel(tipo) {
  const map = {
    residencial: 'Residencial',
    comercial: 'Comercial',
    mixto: 'Mixto',
  }
  if (!tipo) return '—'
  return map[String(tipo).toLowerCase()] || tipo
}

export function tipoBadgeClass(tipo) {
  const t = String(tipo || '').toLowerCase()
  if (t === 'residencial') return 'badge-blue'
  if (t === 'comercial') return 'badge-amber'
  if (t === 'mixto') return 'badge-gray'
  return 'badge-gray'
}

export function firstName(nombre = '') {
  return String(nombre).trim().split(/\s+/)[0] || 'usuario'
}

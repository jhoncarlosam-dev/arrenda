import api from './axios'

function filenameFromDisposition(header, fallback) {
  if (!header) return fallback
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header)
  return match ? decodeURIComponent(match[1]) : fallback
}

async function downloadReceipt(id, format) {
  const response = await api.get(`/receipts/${id}/export/${format}`, {
    responseType: 'blob',
  })
  const blob = new Blob([response.data], {
    type: format === 'pdf' ? 'application/pdf' : 'image/png',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filenameFromDisposition(
    response.headers['content-disposition'],
    `recibo-${id}.${format}`,
  )
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportReceiptPdf(id) {
  return downloadReceipt(id, 'pdf')
}

export function exportReceiptPng(id) {
  return downloadReceipt(id, 'png')
}

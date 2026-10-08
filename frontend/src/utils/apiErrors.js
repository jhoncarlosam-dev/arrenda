const STATUS_MESSAGES = {
  401: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  403: 'No tienes permisos para acceder a este contrato.',
  404: 'Contrato no encontrado.',
  422: 'Revisa los datos del formulario.',
  500: 'Error interno del servidor. Intenta de nuevo más tarde.',
}

export function getApiErrorMessage(error, fallback = 'Ocurrió un error. Intenta de nuevo.') {
  if (!error) return fallback
  if (!error.response) {
    return 'No se pudo conectar con el servidor.'
  }
  const { status, data } = error.response
  if (data?.data && Array.isArray(data.data) && data.data[0]?.msg) {
    return data.data[0].msg
  }
  if (typeof data?.message === 'string' && data.message && data.message !== 'Validation Error') {
    return mapBackendMessage(data.message, status)
  }
  if (typeof data?.detail === 'string') {
    return mapBackendMessage(data.detail, status)
  }
  return STATUS_MESSAGES[status] || fallback
}

function mapBackendMessage(message, status) {
  const lower = message.toLowerCase()
  if (lower.includes('incorrect email') || lower.includes('incorrect password')) {
    return 'Correo o contraseña incorrectos.'
  }
  if (lower.includes('already exists')) {
    return 'Ya existe una cuenta con este correo.'
  }
  if (lower.includes('already verified')) {
    return 'Tu correo ya está verificado.'
  }
  if (lower.includes('not found') && status === 404) {
    return STATUS_MESSAGES[404]
  }
  if (lower.includes('not enough permissions') || lower.includes('not authorized')) {
    return STATUS_MESSAGES[403]
  }
  return message
}

export function fieldErrorsFromApi(error) {
  const items = error?.response?.data?.data
  if (!Array.isArray(items)) return {}
  const mapped = {}
  for (const item of items) {
    const loc = item.loc || []
    const field = loc[loc.length - 1]
    if (typeof field === 'string' && field !== 'body') {
      mapped[field] = item.msg || 'Valor inválido'
    }
  }
  return mapped
}

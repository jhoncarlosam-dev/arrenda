export const ROLES = {
  ARRENDADOR: 'ARRENDADOR',
  ARRENDATARIO: 'ARRENDATARIO',
}

export function isArrendador(role) {
  return role === ROLES.ARRENDADOR
}

export function isArrendatario(role) {
  return role === ROLES.ARRENDATARIO
}

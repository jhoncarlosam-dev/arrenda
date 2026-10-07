import { useCallback, useEffect, useState } from 'react'
import { getUserById } from '../api/usersApi'

const cache = new Map()

export function useUserDirectory(ids = []) {
  const [users, setUsers] = useState(() => {
    const initial = {}
    ids.forEach((id) => {
      if (cache.has(id)) initial[id] = cache.get(id)
    })
    return initial
  })

  const load = useCallback(async (list) => {
    const unique = [...new Set(list.filter(Boolean))]
    await Promise.all(
      unique.map(async (id) => {
        if (cache.has(id)) return
        try {
          const { data } = await getUserById(id)
          cache.set(id, data)
        } catch {
          cache.set(id, { id, nombre: `Usuario #${id}`, email: '', missing: true })
        }
      }),
    )
    const next = {}
    unique.forEach((id) => {
      next[id] = cache.get(id)
    })
    setUsers((prev) => ({ ...prev, ...next }))
  }, [])

  useEffect(() => {
    load(ids)
  }, [ids.join(','), load]) // eslint-disable-line react-hooks/exhaustive-deps

  const getName = useCallback(
    (id) => users[id]?.nombre || (id ? `ID ${id}` : '—'),
    [users],
  )

  return { users, getName, load }
}

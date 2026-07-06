import { useState, useEffect } from 'react'
import { ServiceRequest } from '../types/service'

let requests: ServiceRequest[] = []
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach(fn => fn())
}

export const serviceRequestStore = {
  getAll(): ServiceRequest[] {
    return requests
  },
  add(request: ServiceRequest) {
    requests = [request, ...requests]
    notify()
  },
  updateStatus(id: string, status: ServiceRequest['status']) {
    requests = requests.map(r => (r.id === id ? { ...r, status } : r))
    notify()
  },
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}

export function useServiceRequests(): ServiceRequest[] {
  const [state, setState] = useState<ServiceRequest[]>(serviceRequestStore.getAll())
  useEffect(() => {
    return serviceRequestStore.subscribe(() => setState([...serviceRequestStore.getAll()]))
  }, [])
  return state
}

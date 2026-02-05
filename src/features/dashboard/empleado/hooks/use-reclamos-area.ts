"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

export interface Reclamos {
  id: string
  descripcion?: string
  tipoReclamo: {
    nombre: string
  }
  prioridad: string
  criticidad: string
  estado: string
  proyecto: {
    clienteId: string
  }
}

export function useReclamosArea() {
  const token = useAuthStore((s) => s.auth?.access_token)

  return useQuery({
    queryKey: ["reclamos-area"],
    enabled: !!token,
    queryFn: () => {
      if (!token) throw new Error("No token")
      return api.reclamos.listarPorArea(token) as Promise<Reclamos[]>
    },
  })
}

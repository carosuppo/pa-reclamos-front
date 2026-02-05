"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

export interface UpdateClaimPayload {
  tipoReclamoId?: string
  areaId?: string
  descripcion: string
  prioridad?: "ALTA" | "MEDIA" | "BAJA"
  criticidad?: "ALTA" | "MEDIA" | "BAJA"
}

export function useActualizarReclamo(reclamoId: string) {
  const token = useAuthStore((state) => state.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateClaimPayload) => {
      if (!token) throw new Error("No hay token de autenticación")
      return api.reclamos.actualizar(reclamoId, payload, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] })
      queryClient.invalidateQueries({ queryKey: ["reclamo", reclamoId] })
      queryClient.invalidateQueries({ queryKey: ["cambio-estado", reclamoId] })
    },
  })
}

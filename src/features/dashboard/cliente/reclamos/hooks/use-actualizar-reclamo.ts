"use client"

import { useAuthStore } from "@/stores/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useActualizarReclamo(reclamoId: string) {
  const token = useAuthStore(s => s.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      descripcion: string
      prioridad?: string
      criticidad?: string
      tipoReclamoId?: string
      areaId?: string
    }) => {
      if (!token) throw new Error("No hay token")
      return api.reclamos.actualizarReclamo(reclamoId, payload, token)
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["reclamo", reclamoId],
        refetchType: "active",
      })

      queryClient.invalidateQueries({ queryKey: ["claims"] })
      queryClient.invalidateQueries({ queryKey: ["claims", "area"] })
      queryClient.invalidateQueries({ queryKey: ["cambios-estado", reclamoId] })
    },
  })
}

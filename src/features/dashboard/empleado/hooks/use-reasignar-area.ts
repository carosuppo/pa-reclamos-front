"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

export function useReasignarArea(reclamoId: string) {
  const token = useAuthStore((s) => s.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { areaId: string; descripcion?: string }) => {
      if (!token) throw new Error("No token")
      return api.reclamos.reasignarArea(reclamoId, payload, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reclamos-area"] })
      queryClient.invalidateQueries({ queryKey: ["historial-reclamo", reclamoId] })
    },
  })
}

"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"

export function useActualizarEstado(reclamoId: string) {
  const token = useAuthStore((s) => s.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { estado: string; descripcion?: string }) => {
      if (!token) throw new Error("No token")
      return api.reclamos.actualizarEstado(reclamoId, payload, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reclamos-area"] })
      queryClient.invalidateQueries({ queryKey: ["historial-reclamo", reclamoId] })
    },
  })
}

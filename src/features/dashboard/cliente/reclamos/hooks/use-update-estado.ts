"use client"

import { useAuthStore } from "@/stores/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { claimService } from "../services/claim-service"

export function useUpdateEstado(reclamoId: string) {
  const token = useAuthStore(s => s.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { estado: string; descripcion: string }) => {
      if (!token) throw new Error("No hay token")
      return claimService.updateEstado(reclamoId, payload, token)
    },

    onSuccess: async () => {
      // 🔁 REFETCH DETAIL (CLAVE)
      await queryClient.invalidateQueries({
        queryKey: ["reclamo", reclamoId],
        refetchType: "active",
      })

      // 🔁 REFETCH LISTAS (POR SI ACASO)
      queryClient.invalidateQueries({
        queryKey: ["claims"],
      })

      queryClient.invalidateQueries({
        queryKey: ["claims", "area"],
      })

      // 🔁 HISTORIAL
      queryClient.invalidateQueries({
        queryKey: ["cambios-estado", reclamoId],
      })
    },
  })
}

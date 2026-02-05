import { useAuthStore } from "@/stores/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimService } from "../../cliente/reclamos/services/claim-service";

export function useReasignarArea(reclamoId: string) {
  const token = useAuthStore(s => s.auth?.access_token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { areaId: string; descripcion: string }) => {
      if (!token) throw new Error("No hay token")
      return claimService.reassignArea(reclamoId, payload, token)
    },

    onSuccess: async () => {
      // 🔁 DETAIL
      await queryClient.invalidateQueries({
        queryKey: ["reclamo", reclamoId],
        refetchType: "active",
      })

      // 🔁 LISTA CLIENTE
      queryClient.invalidateQueries({
        queryKey: ["claims"],
      })

      // 🔁 LISTA POR ÁREA
      queryClient.invalidateQueries({
        queryKey: ["claims", "area"],
      })
    },
  })
}



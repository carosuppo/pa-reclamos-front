import { useAuthStore } from "@/stores/auth"
import { Claim } from "../types/claim"
import { useQuery } from "@tanstack/react-query"
import { claimService } from "../services/claim-service"

export function useClaim(reclamoId: string) {
  const token = useAuthStore(s => s.auth?.access_token)

  return useQuery<Claim>({
    queryKey: ["reclamo", reclamoId],
    queryFn: async () => {
      if (!token) throw new Error("No token")
      return claimService.getClaimById(reclamoId, token)
    },
    enabled: !!token && !!reclamoId,
    staleTime: 3 * 1000,
  })
}

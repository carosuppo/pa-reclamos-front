// En hooks/use-area-claims.ts
import { useQuery } from "@tanstack/react-query"
import { claimService } from "../services/claim-service"
import { useAuthStore } from "@/stores/auth"

export function useAreaClaims() {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery({
    queryKey: ["claims", "area"],
    queryFn: async () => {
      if (!token) throw new Error("No hay token")
      return claimService.getClaimsByArea(token)
    },
    enabled: !!token,
  })
}
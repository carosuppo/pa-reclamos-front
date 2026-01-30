import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Claim } from "../types/claim"

export function useClaimDetail(reclamoId: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["claim", reclamoId],
    queryFn: () => {
      // Nunca se ejecuta
      throw new Error("No fetch")
    },
    enabled: false,

    initialData: () => {
      const claimsCliente =
        queryClient.getQueryData<Claim[]>(["claims"])

      const claimsArea =
        queryClient.getQueryData<Claim[]>(["claims", "area"])

      return (
        claimsCliente?.find(c => c.id === reclamoId) ??
        claimsArea?.find(c => c.id === reclamoId)
      )
    },
  })
}

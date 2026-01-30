"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { claimService } from "../services/claim-service"
import { useAuthStore } from "@/stores/auth"
import type { Claim, CreateClaimPayload } from "../types/claim"

export function useClaims() {
  const token = useAuthStore((state) => state.auth?.access_token)

  const query = useQuery<Claim[]>({
    queryKey: ["claims"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token")
      const claims = await claimService.getClaims(token)
      return claims
    },
    enabled: !!token,
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async (payload: CreateClaimPayload) => {
      if (!token) throw new Error("No authentication token")
      return claimService.createClaim(payload, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] })
    },
  })

  return {
    claims: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    createClaim: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message || null,
    refetch: query.refetch,
  }
}

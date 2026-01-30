"use client"

import { useClaims } from "../hooks/use-claims"
import { ClaimCard } from "./claim-card"

export function ListaReclamos() {
  const { claims, isLoading, error } = useClaims()


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (claims.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tienes reclamos registrados</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {claims.map((claim) => (
          <ClaimCard key={claim.id}
          claim={claim}
          showClient={false}
          />
        ))}
      </div>
    </div>
  )
}

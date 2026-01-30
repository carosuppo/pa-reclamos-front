import { useAreaClaims } from "../hooks/use-area-reclamo"
import { ClaimCard } from "./claim-card"

export function ListaReclamosArea() {
  const { data: claims = [], isLoading, error } = useAreaClaims()

  if (isLoading) return <div className="animate-spin ..."></div> // Spinner

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reclamos de mi Área</h2>
      <div className="grid gap-4">
        {claims.map((claim) => (
          <ClaimCard 
            key={claim.id}
            claim={claim}
          />
        ))}
      </div>
    </div>
  )
}
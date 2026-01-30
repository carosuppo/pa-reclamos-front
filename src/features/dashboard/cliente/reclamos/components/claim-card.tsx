import Link from "next/link"
import type { Claim } from "../types/claim"
import { STATUS_LABELS } from "../constants/claim-options"
import { formatDate } from "@/helpers/format"

interface ClaimCardProps {
  claim: Claim;
  showClient?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  resolved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
}

const PRIORITY_COLORS: Record<string, string> = {
  ALTA: "bg-red-500/20 text-red-400",
  MEDIA: "bg-yellow-500/20 text-yellow-400",
  BAJA: "bg-green-500/20 text-green-400",
}

export function ClaimCard({ claim, showClient = true }: ClaimCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{claim.title}</h3>
          <p className="text-xs text-muted-foreground font-mono">ID: {claim.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[claim.status]}`}>
          {STATUS_LABELS[claim.status]}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Proyecto: {claim.projectName}
      </p>
      {showClient && (
        <p className="text-xs text-muted-foreground">
          Cliente: {claim.clientName}
        </p>
      )}

      <p className="text-muted-foreground text-sm line-clamp-2">{claim.description}</p>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[claim.priority]}`}>
            Prioridad: {claim.priority === "ALTA" ? "Alta" : claim.priority === "MEDIA" ? "Media" : "Baja"}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(claim.createdAt)}</span>
        </div>
        <Link
          href={`/reclamos/${claim.id}`}
          className="px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 border border-primary/20 rounded hover:bg-primary/5 transition-colors"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  )
}

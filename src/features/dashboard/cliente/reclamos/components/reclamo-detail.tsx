"use client"

import { formatDateTime } from "@/helpers/format"
import { STATUS_LABELS } from "../constants/claim-options"
import { useCambioEstado } from "../hooks/use-cambio-estado"
import { UpdateEstadoYAreaForm } from "./actualizar-reclamo-form"
import { useClaimDetail } from "../hooks/use-claim-detail"
import { useClaim } from "../hooks/use-claim"

interface ReclamoDetailProps {
  reclamoId: string
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

export function ReclamoDetail({ reclamoId }: ReclamoDetailProps) {
  const {
    data: reclamo,
    isLoading: reclamoLoading,
    error: reclamoError,
  } = useClaim(reclamoId)
  const {
    data: cambiosEstado = [],
    isLoading: cambiosLoading,
    error: cambiosError,
  } = useCambioEstado(reclamoId)


  if (reclamoLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (reclamoError || !reclamo) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">
          {reclamoError?.message || "No se encontró el reclamo solicitado"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Reclamo Information */}
      <div className="bg-card rounded-xl p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {reclamo.title}
            </h2>
            <p className="text-xs text-muted-foreground font-mono mb-4">
              ID: {reclamo.id}
            </p>
            <p className="text-xs text-muted-foreground font-mono mb-4">
              Proyecto: {reclamo.projectName}
            </p>
            <p className="text-muted-foreground">{reclamo.description}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLORS[reclamo.status]}`}
          >
            {STATUS_LABELS[reclamo.status]}
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${PRIORITY_COLORS[reclamo.priority]}`}
          >
            Prioridad:{" "}
            {reclamo.priority === "ALTA"
              ? "Alta"
              : reclamo.priority === "MEDIA"
                ? "Media"
                : "Baja"}
          </span>
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${PRIORITY_COLORS[reclamo.criticality]}`}
          >
            Criticidad:{" "}
            {reclamo.criticality === "ALTA"
              ? "Alta"
              : reclamo.criticality === "MEDIA"
                ? "Media"
                : "Baja"}
          </span>
          <span className="text-sm text-muted-foreground">
            Creado: {formatDateTime(reclamo.createdAt)}
          </span>
        </div>
      </div>
      
      <UpdateEstadoYAreaForm reclamoId={reclamoId} />

      {/* State Change History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Historial de Estados
        </h3>

        {cambiosLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : cambiosError ? (
          <div className="text-center py-8">
            <p className="text-red-400">
              Error al cargar el historial: {cambiosError.message}
            </p>
          </div>
        ) : cambiosEstado.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay historial de estados disponible
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cambiosEstado.map((cambio, index) => (
              <div
                key={cambio.id}
                className="bg-card rounded-lg p-4 border-l-4 border-l-primary"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[
                          cambio.estado === "PENDIENTE"
                            ? "pending"
                            : cambio.estado === "EN_PROCESO"
                              ? "in_progress"
                              : cambio.estado === "RESUELTO"
                                ? "resolved"
                                : "pending"
                        ]
                          }`}
                      >
                        {cambio.estado === "PENDIENTE"
                          ? "Pendiente"
                          : cambio.estado === "EN_PROCESO"
                            ? "En Proceso"
                            : cambio.estado === "RESUELTO"
                              ? "Resuelto"
                              : cambio.estado}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {index === 0 ? "Estado inicial" : `Cambio ${index}`}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {cambio.descripcion}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        Inicio: {formatDateTime(new Date(cambio.fechaInicio))}
                      </p>
                      {cambio.fechaFin && (
                        <p>Fin: {formatDateTime(new Date(cambio.fechaFin))}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { formatDateTime } from "@/helpers/format"
import { STATUS_LABELS } from "../../cliente/reclamos/constants/claim-options"
import { useCambioEstado } from "../../cliente/reclamos/hooks/use-cambio-estado"
import { ActualizarEstadoForm } from "./actualizar-estado-form"
import { useReclamoDetail } from "../../cliente/reclamos/hooks/use-reclamo-detail"
import { ReasignarAreaForm } from "./reasignar-area-form" 

interface ReclamoDetailProps {
  reclamoId: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  in_progress: "bg-blue-500/20 text-blue-400",
  resolved: "bg-green-500/20 text-green-400",
}

const PRIORITY_COLORS: Record<string, string> = {
  ALTA: "bg-red-500/20 text-red-400",
  MEDIA: "bg-yellow-500/20 text-yellow-400",
  BAJA: "bg-green-500/20 text-green-400",
}

export function ReclamoDetail({ reclamoId }: ReclamoDetailProps) {
  const [openActualizar, setOpenActualizar] = useState(false)
  const [openReasignar, setOpenReasignar] = useState(false)

  const {
    data: reclamo,
    isLoading: reclamoLoading,
    error: reclamoError,
  } = useReclamoDetail(reclamoId)
  
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
    console.log("Reclamo Error:", reclamoError);
    console.log(reclamo);
    return (
      <div className="text-center py-12">
        <p className="text-red-400">
          {reclamoError?.message || "No se encontró el reclamo solicitado"}
        </p>
      </div>
    )
  }

  
  console.log("Reclamo Detail Rendered with ID:", reclamoId);
  console.log("Reclamo Data:", reclamo);
  console.log("Nombre del Proyecto:", reclamo.projectName);
  
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
      
      <div className="flex flex-wrap gap-3 justify-start">
        <button
          onClick={() => setOpenActualizar(true)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-muted transition-all"
        >
          Cambiar Estado
        </button>

        <button
          onClick={() => setOpenReasignar(true)}
          className="px-4 py-2 rounded-lg bg-primary text-foreground hover:bg-muted transition-all"
        >
          Reasignar Área
        </button>
      </div>

      <ActualizarEstadoForm
        open={openActualizar}
        onClose={() => setOpenActualizar(false)}
        reclamoId={reclamo.id}
        estadoActual={reclamo.status}
      />

      <ReasignarAreaForm
        open={openReasignar}
        onClose={() => setOpenReasignar(false)}
        reclamoId={reclamo.id}
      />

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

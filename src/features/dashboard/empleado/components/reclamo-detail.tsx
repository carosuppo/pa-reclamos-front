"use client"

import { useState } from "react"
import { Button } from "@mui/material"

import { useReclamoDetail } from "@/features/dashboard/cliente/reclamos/hooks/use-reclamo-detail"
import { ActualizarEstadoDialog } from "./actualizar-estado-dialog"
import { ReasignarAreaDialog } from "./reasignar-area-dialog"
import { ReclamoTimeline } from "./reclamo-timeline"

interface Props {
  reclamoId: string
}

export function ReclamoDetail({ reclamoId }: Props) {
  const { data: reclamo, isLoading, error } = useReclamoDetail(reclamoId)

  const [openEstado, setOpenEstado] = useState(false)
  const [openArea, setOpenArea] = useState(false)

  if (isLoading) return <p>Cargando...</p>
  if (error || !reclamo) return <p>Error al cargar reclamo</p>

  const isResuelto = reclamo.status === "resolved"

  return (
    <div className="space-y-6">
      {/* Info básica */}
      <div className="bg-card p-6 rounded-xl">
        <h1 className="text-xl font-bold">{reclamo.title}</h1>
        <p className="text-muted-foreground">{reclamo.description}</p>
      </div>

      {/* Timeline */}
      <ReclamoTimeline reclamoId={reclamoId} />

      {/* Acciones */}
      {!isResuelto ? (
        <div className="flex gap-3">
          <Button variant="contained" onClick={() => setOpenEstado(true)}>
            Cambiar estado
          </Button>

          <Button variant="outlined" onClick={() => setOpenArea(true)}>
            Reasignar área
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Reclamo resuelto. No se permiten más acciones.
        </p>
      )}

      {/* Dialogs */}
      <ActualizarEstadoDialog
        open={openEstado}
        onClose={() => setOpenEstado(false)}
        reclamoId={reclamoId}
        estadoActual={reclamo.status}
      />

      <ReasignarAreaDialog
        open={openArea}
        onClose={() => setOpenArea(false)}
        reclamoId={reclamoId}
        estadoActual={reclamo.status}
      />
    </div>
  )
}

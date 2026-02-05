"use client"

import { useState } from "react"
import { Dialog } from "@mui/material"
import { toast } from "sonner"

import { FormSelect } from "../../cliente/reclamos/components/form/form-select"
import { FormTextarea } from "../../cliente/reclamos/components/form/form-textarea"
import { useReclamoDetail } from "../../cliente/reclamos/hooks/use-reclamo-detail"
import { useActualizarEstado } from "../hooks/use-actualizar-estado"

interface Props {
  open: boolean
  onClose: () => void
  reclamoId: string
  estadoActual: string
}

const ESTADOS_TRANSICIONES: Record<
  "pending" | "in_progress" | "resolved",
  { label: string; value: string }[]
> = {
  pending: [
    { label: "En Proceso", value: "EN_PROCESO" },
    { label: "Resuelto", value: "RESUELTO" },
  ],
  in_progress: [{ label: "Resuelto", value: "RESUELTO" }],
  resolved: [],
}


export function ActualizarEstadoForm({
  open,
  onClose,
  reclamoId,
}: Props) {
  const [estado, setEstado] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const { data: reclamo } = useReclamoDetail(reclamoId)
  const { mutateAsync: actualizarEstado, isPending } =
    useActualizarEstado(reclamoId)

  const estadoActualDb = reclamo?.status
  const reclamoResuelto = reclamo?.status === "resolved"

  const estadosOptions = estadoActualDb
    ? ESTADOS_TRANSICIONES[estadoActualDb] || []
    : []

  const isFormValid = estado !== "" && descripcion.trim() !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (reclamoResuelto) {
      toast.error("No se puede modificar el reclamo", {
        description: "El reclamo ya se encuentra resuelto.",
      })
      return
    }

    const ok = window.confirm(
      `¿Confirmás cambiar el estado de ${estadoActualDb} a ${estado}?`
    )
    if (!ok) return

    try {
      await actualizarEstado({ estado, descripcion })
      setEstado("")
      setDescripcion("")
      onClose()

      toast.success("Estado actualizado correctamente", {
        description: "El cambio de estado se registró con éxito.",
      })
    } catch (error) {
      toast.error("Error al actualizar el estado", {
        description: "No se pudo registrar el cambio. Intentá nuevamente.",
      })
      console.error("Error updating estado:", error)
    }
  }
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Actualizar estado del reclamo
          </h2>
          <p className="text-muted-foreground">
            Cambiá el estado del reclamo según su progreso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {reclamoResuelto && (
            <p className="text-sm text-red-500 text-center">
              Este reclamo ya fue resuelto y no puede modificarse.
            </p>
          )}

          <FormSelect
            label={`Nuevo Estado`}
            id="estado"
            value={estado}
            onChange={(value) => {
            setEstado(value)
          }}
            required
            disabled={reclamoResuelto || estadosOptions.length === 0}
            options={estadosOptions}
          />

          <FormTextarea
            label="Descripción del Cambio"
            id="descripcion"
            value={descripcion}
            onChange={setDescripcion}
            placeholder="Detalle del cambio de estado"
            required
            rows={4}
            disabled={reclamoResuelto}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="w-full py-3 px-6 rounded-lg border border-border text-foreground hover:bg-muted transition-all disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!isFormValid || isPending || reclamoResuelto}
              className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isPending ? "Actualizando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
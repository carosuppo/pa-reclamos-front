"use client"

import { useState } from "react"
import { useEffect } from "react"
import { toast } from "sonner"
import { Dialog } from "@mui/material"
import { FormTextarea } from "./form/form-textarea"
import { FormSelect } from "./form/form-select"
import { useClaim } from "../hooks/use-claim"
import { useActualizarReclamo } from "../hooks/use-actualizar-reclamo"
import { useTipoReclamo } from "../hooks/use-tipo-reclamo"
import { useAreas } from "../hooks/use-areas"

interface Props {
  open: boolean
  onClose: () => void
  reclamoId: string
}

const MEDIDAS_OPTIONS = [
  { label: "Alta", value: "ALTA" },
  { label: "Media", value: "MEDIA" },
  { label: "Baja", value: "BAJA" },
]

export function ActualizarReclamoForm({
  open,
  onClose,
  reclamoId,
}: Props) {
  const { data: reclamo } = useClaim(reclamoId)
  const { mutateAsync: actualizarReclamo, isPending } =
    useActualizarReclamo(reclamoId)

  const { data: areas = [] } = useAreas()

  const areasOptions = areas.map(a => ({
    label: a.nombre,
    value: a.id,
  }))
  
  const { data: tipoReclamos = [] } = useTipoReclamo()

  const tipoReclamoOptions = tipoReclamos.map((a) => ({
    label: a.nombre,
    value: a.id,
  }))

  const reclamoResuelto = reclamo?.status === "resolved"

  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState("")
  const [criticidad, setCriticidad] = useState("")
  const [tipoReclamoId, setTipoReclamoId] = useState("")
  const [areaId, setAreaId] = useState("")

  // Setea los valores actuales del reclamo en el formulario
  useEffect(() => {
    if (reclamo) {
      setDescripcion(reclamo.description || "")
      setPrioridad(reclamo.priority || "")
      setCriticidad(reclamo.criticality || "")
      setTipoReclamoId(reclamo.type || "")
      setAreaId(reclamo.area || "")
    }
  }, [reclamo])

  const isFormValid = descripcion.trim().length > 0
/**
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (estadoSeleccionado) {
      updateEstado({ estado, descripcion })
      return
    }

    if (areaSeleccionada) {
      reassignArea({ areaId, descripcion })
      return
    }
  }
*/

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (reclamoResuelto) {
        toast.error("No se puede modificar el reclamo", {
          description: "El reclamo ya se encuentra resuelto.",
        })
        return
      }

      const ok = window.confirm(
        `¿Confirmás actualizar el reclamo?`
      )
      if (!ok) return

      try {
        await ({
        descripcion,
        prioridad,
        criticidad,
        tipoReclamoId,
        areaId,
      })
        setDescripcion("")
        onClose()

        toast.success("Reclamo actualizado correctamente", {
          description: "El reclamo se actualizó con éxito.",
        })
      } catch (error) {
        toast.error("Error al actualizar el reclamo", {
          description: "No se pudo registrar el cambio. Intentá nuevamente.",
        })
        console.error("Error updating reclamo:", error)
      }
    }

    console.log({reclamo})
  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Modificar reclamo
            </h2>
            <p className="text-muted-foreground">
              Corregí la información del reclamo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {reclamoResuelto && (
              <p className="text-sm text-red-500 text-center">
                Este reclamo ya fue resuelto y no puede modificarse.
              </p>
            )}

            <FormTextarea
              label="Descripción"
              id="descripcion"
              value={reclamo?.description || ""}
              onChange={setDescripcion}
              rows={2}
              disabled={reclamoResuelto}
            />

            <FormSelect
              label="Prioridad"
              id="prioridad"
              value={prioridad}
              onChange={setPrioridad}
              options={MEDIDAS_OPTIONS}
              disabled={reclamoResuelto}
            />

            <FormSelect
              label="Criticidad"
              id="criticidad"
              value={criticidad}
              onChange={setCriticidad}
              options={MEDIDAS_OPTIONS}
              disabled={reclamoResuelto}
            />

            <FormSelect
              label="Tipo de Reclamo"
              id="tipoReclamoId"
              value={tipoReclamoId}
              onChange={setTipoReclamoId}
              options={tipoReclamoOptions}
              disabled={reclamoResuelto}
            />

            <FormSelect
              label="Área sugerida"
              id="areaId"
              value={areaId}
              onChange={setAreaId}
              options={areasOptions} 
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
                {isPending ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  )
}

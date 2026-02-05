"use client"

import { useState } from "react"
import { Dialog } from "@mui/material"
import { toast } from "sonner"

import { FormSelect } from "../../cliente/reclamos/components/form/form-select"
import { FormTextarea } from "../../cliente/reclamos/components/form/form-textarea"
import { useReclamoDetail } from "../../cliente/reclamos/hooks/use-reclamo-detail"
import { useAreas } from "../../cliente/reclamos/hooks/use-areas"
import { useReasignarArea } from "../hooks/use-reasignar-area"

interface Props {
  open: boolean
  onClose: () => void
  reclamoId: string
}

export function ReasignarAreaForm({
  open,
  onClose,
  reclamoId,
}: Props) {
  const [areaId, setAreaId] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const { data: reclamo } = useReclamoDetail(reclamoId)
  const { data: areas = [] } = useAreas()
  const { mutateAsync: reassignArea, isPending } = useReasignarArea(reclamoId)

  const reclamoResuelto = reclamo?.status === "resolved"

  const areasOptions = areas.map((a) => ({
    label: a.nombre,
    value: a.id,
  }))

  const isFormValid = areaId !== "" && descripcion.trim() !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (reclamoResuelto) {
      toast.error("No se puede modificar el reclamo", {
        description: "El reclamo ya se encuentra resuelto.",
      })
      return
    }

    const areaSeleccionada = areas.find((a) => a.id === areaId)

    const ok = window.confirm(
      `¿Confirmás reasignar el reclamo al área "${areaSeleccionada?.nombre}"?`
    )
    if (!ok) return

    try {
      await reassignArea({ areaId, descripcion })
      setAreaId("")
      setDescripcion("")
      onClose()

      toast.success("Área reasignada correctamente", {
        description: "La reasignación se registró con éxito.",
      })
    } catch (error) {
      toast.error("Error al reasignar el área", {
        description: "No se pudo registrar el cambio. Intentá nuevamente.",
      })
      console.error("Error reassigning area:", error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Reasignar área del reclamo
          </h2>
          <p className="text-muted-foreground">
            Derivá el reclamo a otra área para su resolución
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {reclamoResuelto && (
            <p className="text-sm text-red-500 text-center">
              Este reclamo ya fue resuelto y no puede modificarse.
            </p>
          )}

          <FormSelect
            label="Nueva Área"
            id="areaId"
            value={areaId}
            onChange={setAreaId}
            required
            disabled={reclamoResuelto || areasOptions.length === 0}
            options={areasOptions}
          />

          <FormTextarea
            label="Descripción del Cambio"
            id="descripcion"
            value={descripcion}
            onChange={setDescripcion}
            placeholder="Motivo de la reasignación"
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
              {isPending ? "Reasignando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

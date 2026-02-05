"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { CRITICALITY_OPTIONS, PRIORITY_OPTIONS } from "../constants/claim-options"
import { useActualizarReclamo } from "../hooks/use-actualizar-reclamo"
import { useAreas } from "../hooks/use-areas"
import { useTipoReclamo } from "../hooks/use-tipo-reclamo"
import { FormRadioGroup } from "./form/form-radio-group"
import { FormSelect } from "./form/form-select"
import { FormTextarea } from "./form/form-textarea"

interface ActualizarReclamoFormProps {
  reclamoId: string
  initialValues: {
    tipoReclamoId?: string
    areaId?: string
    descripcion: string
    prioridad?: "ALTA" | "MEDIA" | "BAJA"
    criticidad?: "ALTA" | "MEDIA" | "BAJA"
  }
}

export function ActualizarReclamoForm({
  reclamoId,
  initialValues,
}: ActualizarReclamoFormProps) {
  const [formData, setFormData] = useState(initialValues)

  useEffect(() => {
    setFormData(initialValues)
  }, [initialValues])

  const { data: areas = [], isLoading: areasLoading } = useAreas()
  const { data: tiposReclamo = [], isLoading: tiposReclamoLoading } = useTipoReclamo()
  const { mutateAsync: actualizarReclamo, isPending: isSubmitting } =
    useActualizarReclamo(reclamoId)

  const areasOptions = useMemo(
    () => areas.map((area) => ({ value: area.id, label: area.nombre })),
    [areas],
  )

  const tiposReclamoOptions = useMemo(
    () => tiposReclamo.map((tipo) => ({ value: tipo.id, label: tipo.nombre })),
    [tiposReclamo],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await actualizarReclamo({
        tipoReclamoId: formData.tipoReclamoId || undefined,
        areaId: formData.areaId || undefined,
        descripcion: formData.descripcion,
        prioridad: formData.prioridad,
        criticidad: formData.criticidad,
      })

      toast.success("Reclamo actualizado", {
        description: "Los cambios se guardaron correctamente.",
      })
    } catch (error) {
      toast.error("Error al actualizar reclamo", {
        description:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el reclamo. Intentá nuevamente.",
      })
    }
  }

  return (
    <div className="bg-card rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Actualizar reclamo</h3>
        <p className="text-sm text-muted-foreground">
          Editá los datos y guardá los cambios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSelect
          label="Tipo de Reclamo"
          id="tipoReclamoId"
          value={formData.tipoReclamoId || ""}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, tipoReclamoId: value }))
          }
          options={tiposReclamoOptions}
        />

        <FormSelect
          label="Área"
          id="areaId"
          value={formData.areaId || ""}
          onChange={(value) => setFormData((prev) => ({ ...prev, areaId: value }))}
          options={areasOptions}
        />

        <FormTextarea
          label="Descripción Detallada"
          id="descripcion"
          value={formData.descripcion}
          onChange={(value) => setFormData((prev) => ({ ...prev, descripcion: value }))}
          placeholder="Describa su reclamo con el mayor detalle posible"
          required
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormRadioGroup
            label="Prioridad"
            name="prioridad"
            value={formData.prioridad || ""}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                prioridad: value as "ALTA" | "MEDIA" | "BAJA",
              }))
            }
            options={PRIORITY_OPTIONS}
          />

          <FormRadioGroup
            label="Criticidad"
            name="criticidad"
            value={formData.criticidad || ""}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                criticidad: value as "ALTA" | "MEDIA" | "BAJA",
              }))
            }
            options={CRITICALITY_OPTIONS}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || areasLoading || tiposReclamoLoading || !formData.descripcion.trim()}
          className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Guardando..."
            : areasLoading || tiposReclamoLoading
              ? "Cargando..."
              : "Guardar cambios"}
        </button>
      </form>
    </div>
  )
}

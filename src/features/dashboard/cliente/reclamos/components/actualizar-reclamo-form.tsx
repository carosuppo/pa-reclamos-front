import { useState } from "react"
import { useUpdateEstado } from "../hooks/use-update-estado"
import { FormTextarea } from "./form/form-textarea"
import { FormSelect } from "./form/form-select"
import { useReassignArea } from "../hooks/use-reassign-area"
import { useAreas } from "../hooks/use-areas"

export function UpdateEstadoYAreaForm({ reclamoId }: { reclamoId: string }) {
  const [estado, setEstado] = useState("")
  const [areaId, setAreaId] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const { mutate: updateEstado, isPending: updatingEstado } =
    useUpdateEstado(reclamoId)

  const { mutate: reassignArea, isPending: reassigningArea } =
    useReassignArea(reclamoId)

  const { data: areas = [] } = useAreas()

  const areasOptions = areas.map(a => ({
    label: a.nombre,
    value: a.id,
  }))

  const estadoSeleccionado = estado !== ""
  const areaSeleccionada = areaId !== ""

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

  return (
    <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Actualizar Reclamo
        </h2>
        <p className="text-muted-foreground">
          Cambia el estado o reasigna el área del reclamo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSelect
          label="Nuevo Estado"
          id="estado"
          value={estado}
          onChange={(value) => {
            setEstado(value)
            if (value) setAreaId("") // limpia área si elijo estado
          }}
          disabled={areaSeleccionada}
          options={[
            { label: "Pendiente", value: "PENDIENTE" },
            { label: "En Proceso", value: "EN_PROCESO" },
            { label: "Resuelto", value: "RESUELTO" },
            { label: "Rechazado", value: "RECHAZADO" },
          ]}
        />

        <FormSelect
          label="Reasignar Área"
          id="areaId"
          value={areaId}
          onChange={(value) => {
            setAreaId(value)
            if (value) setEstado("") // limpia estado si elijo área
          }}
          disabled={estadoSeleccionado}
          options={areasOptions}
        />

        <FormTextarea
          label="Descripción del Cambio"
          id="descripcion"
          value={descripcion}
          onChange={setDescripcion}
          placeholder="Detalle del cambio de estado o reasignación"
          required
          rows={4}
        />

        <button
          type="submit"
          disabled={
            updatingEstado ||
            reassigningArea ||
            (!estadoSeleccionado && !areaSeleccionada)
          }
          className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {(updatingEstado || reassigningArea)
            ? "Actualizando..."
            : "Guardar Cambios"}
        </button>
      </form>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"
import { toast } from "sonner"

import { FormSelect } from "@/features/dashboard/cliente/reclamos/components/form/form-select"
import { FormTextarea } from "@/features/dashboard/cliente/reclamos/components/form/form-textarea"
import { useAreas } from "@/features/dashboard/cliente/reclamos/hooks/use-areas"
import { useReasignarArea } from "../hooks/use-reasignar-area"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface Props {
  open: boolean
  onClose: () => void
  reclamoId: string
  estadoActual: string // viene de useReclamoDetail().status
}

export function ReasignarAreaDialog({
  open,
  onClose,
  reclamoId,
  estadoActual,
}: Props) {
  const [areaId, setAreaId] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: areas = [] } = useAreas()
  const { mutateAsync, isPending } = useReasignarArea(reclamoId)

  const isResuelto = estadoActual === "resolved"

  const areaOptions = areas.map((area) => ({
    value: area.id,
    label: area.nombre,
  }))

  const handleSubmit = () => {
    if (isResuelto) {
      toast.error("No se puede reasignar un reclamo resuelto")
      return
    }

    if (!areaId) {
      toast.error("Debe seleccionar un área")
      return
    }

    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    try {
      await mutateAsync({ areaId, descripcion })

      toast.success("Área reasignada correctamente")
      setConfirmOpen(false)
      onClose()
      setAreaId("")
      setDescripcion("")
    } catch {
      toast.error("Error al reasignar área")
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Reasignar área del reclamo</DialogTitle>

        <DialogContent className="space-y-4 mt-2">
          {isResuelto && (
            <p className="text-sm text-red-500">
              No es posible reasignar un reclamo que ya fue resuelto.
            </p>
          )}

          <FormSelect
            label="Área destino"
            id="areaId"
            value={areaId}
            onChange={setAreaId}
            options={areaOptions}
            required
            disabled={isResuelto}
          />

          <FormTextarea
            label="Descripción"
            id="descripcion"
            value={descripcion}
            onChange={setDescripcion}
            rows={4}
            disabled={isResuelto}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || isResuelto}
            variant="contained"
          >
            Reasignar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar reasignación"
        description="¿Está seguro que desea reasignar este reclamo a otra área?"
        confirmText="Confirmar"
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}

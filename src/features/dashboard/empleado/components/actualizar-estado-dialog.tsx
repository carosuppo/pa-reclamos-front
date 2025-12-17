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
import { useActualizarEstado } from "../hooks/use-actualizar-estado"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface Props {
  open: boolean
  onClose: () => void
  reclamoId: string
  estadoActual: string // viene de useReclamoDetail().status
}

const ESTADOS_OPTIONS = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "RESUELTO", label: "Resuelto" },
]

export function ActualizarEstadoDialog({
  open,
  onClose,
  reclamoId,
  estadoActual,
}: Props) {
  const [estado, setEstado] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { mutateAsync, isPending } = useActualizarEstado(reclamoId)

  const isResuelto = estadoActual === "resolved"

  const handleSubmit = () => {
    if (isResuelto) {
      toast.error("No se puede modificar un reclamo resuelto")
      return
    }

    if (!estado) {
      toast.error("Debe seleccionar un estado")
      return
    }

    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    try {
      await mutateAsync({ estado, descripcion })

      toast.success("Estado actualizado correctamente")
      setConfirmOpen(false)
      onClose()
      setEstado("")
      setDescripcion("")
    } catch {
      toast.error("Error al actualizar el estado")
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Actualizar estado del reclamo</DialogTitle>

        <DialogContent className="space-y-4 mt-2">
          {isResuelto && (
            <p className="text-sm text-red-500">
              Este reclamo ya fue resuelto y no puede modificarse.
            </p>
          )}

          <FormSelect
            label="Nuevo estado"
            id="estado"
            value={estado}
            onChange={setEstado}
            options={ESTADOS_OPTIONS}
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
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar cambio de estado"
        description="¿Está seguro que desea cambiar el estado del reclamo?"
        confirmText="Confirmar"
        loading={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}

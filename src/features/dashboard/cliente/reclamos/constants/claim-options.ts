export const CLAIM_TYPES = [
  { value: "product_failure", label: "Falla de Producto" },
  { value: "service_question", label: "Duda de Servicio" },
  { value: "incident", label: "Incidencia" },
] as const

export const PRIORITY_OPTIONS = [
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Media" },
  { value: "BAJA", label: "Baja" },
] as const

export const CRITICALITY_OPTIONS = [
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Media" },
  { value: "BAJA", label: "Baja" },
] as const

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  in_progress: "En Proceso",
  resolved: "Resuelto",
}

export type ClaimType = "product_failure" | "service_question" | "incident"
export type Priority = "ALTA" | "MEDIA" | "BAJA"
export type Criticality = "ALTA" | "MEDIA" | "BAJA"
export type ClaimStatus = "pending" | "in_progress" | "resolved" | "rejected"

export interface Claim {
  id: string
  title: string
  description: string
  type: ClaimType
  priority: Priority
  criticality: Criticality
  status: ClaimStatus
  attachments: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
  projectName: string
  clientName: string
}

export interface CreateClaimPayload {
  tipoReclamoId: string
  proyectoId: string
  areaId: string
  descripcion: string
  prioridad: string
  criticidad: string
}

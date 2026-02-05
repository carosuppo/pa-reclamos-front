export type Priority = "ALTA" | "MEDIA" | "BAJA"
export type Criticality = "ALTA" | "MEDIA" | "BAJA"
export type ClaimStatus = "pending" | "in_progress" | "resolved"

export interface Claim {
  id: string
  description: string
  type: string
  priority: Priority
  criticality: Criticality
  status: ClaimStatus
  createdAt: Date
  updatedAt: Date
  userId: string
  projectName: string
  areaId?: string
}


export interface CreateClaimPayload {
  tipoReclamoId: string
  proyectoId: string
  areaId: string
  descripcion: string
  prioridad: string
  criticidad: string
}

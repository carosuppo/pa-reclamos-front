"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/auth"
import type { Claim } from "../types/claim"

interface ApiClaimResponse {
  id: string
  descripcion?: string
  tipoReclamo?: {
    id?: string
    nombre?: string
  }
  prioridad?: string
  criticidad?: string
  estado?: string
  createdAt?: string
  updatedAt?: string
  proyecto?: {
    clienteId?: string
    nombre?: string
  }
  areaId?: string
}

function mapApiStatus(apiStatus: string): Claim["status"] {
  const statusMap: Record<string, Claim["status"]> = {
    PENDIENTE: "pending",
    EN_PROCESO: "in_progress",
    RESUELTO: "resolved",
  }
  return statusMap[apiStatus] || "pending"
}

function mapApiPriority(apiPriority?: string): Claim["priority"] {
  if (apiPriority === "ALTA" || apiPriority === "MEDIA" || apiPriority === "BAJA") {
    return apiPriority
  }
  return "MEDIA"
}

function mapApiCriticality(apiCriticality?: string): Claim["criticality"] {
  if (apiCriticality === "ALTA" || apiCriticality === "MEDIA" || apiCriticality === "BAJA") {
    return apiCriticality
  }
  return "MEDIA"
}

function transformApiClaim(apiClaim: ApiClaimResponse): Claim {
  return {
    id: apiClaim.id,
    description: apiClaim.descripcion || "",
    type: apiClaim.tipoReclamo?.id || "N/A",
    priority: mapApiPriority(apiClaim.prioridad),
    criticality: mapApiCriticality(apiClaim.criticidad),
    status: mapApiStatus(apiClaim.estado || "N/A"),
    createdAt: new Date(apiClaim.createdAt || Date.now()),
    updatedAt: new Date(apiClaim.updatedAt || Date.now()),
    userId: apiClaim.proyecto?.clienteId || "N/A",
    projectName: apiClaim.proyecto?.nombre || "N/A",
  }
}

export function useReclamoDetail(reclamoId: string) {
  const token = useAuthStore((state) => state.auth?.access_token)

  return useQuery<Claim | undefined>({
    queryKey: ["reclamo", reclamoId],
    enabled: false, // Desactivamos la búsqueda automática (se usará la caché)
    queryFn: async () => {
      if (!token) throw new Error("No authentication token")

      const response = await api.reclamos.obtenerPorId(reclamoId, token)
      console.log({ response })
      return transformApiClaim(response as ApiClaimResponse)
    },
    enabled: !!token && !!reclamoId,
  })
}

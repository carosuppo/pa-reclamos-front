import { api } from "@/lib/api"
import type { Claim, CreateClaimPayload } from "../types/claim"

// Transform API response to match our Claim interface
function transformApiClaim(apiClaim: any): Claim {
  return {
    id: apiClaim.id,
    title: apiClaim.descripcion?.substring(0, 50) + "..." || "Reclamo sin título",
    description: apiClaim.descripcion || "",
    type: apiClaim.tipoReclamo?.nombre?.toLowerCase().replace(/\s+/g, '_') || "incident",
    priority: mapApiPriority(apiClaim.prioridad || "MEDIA"),
    criticality: mapApiCriticality(apiClaim.criticidad || "MEDIA"),
    status: mapApiStatus(apiClaim.estado || "PENDIENTE"),
    attachments: apiClaim.archivo ? [apiClaim.archivo] : [],
    createdAt: new Date(apiClaim.createdAt || Date.now()),
    updatedAt: new Date(apiClaim.updatedAt || Date.now()),
    userId: apiClaim.proyecto?.clienteId || "",
    projectName: apiClaim.proyectoNombre, 
    clientName: apiClaim.clienteNombre,
  }
}

// Map API status to our status enum
function mapApiStatus(apiStatus: string): Claim['status'] {
  const statusMap: Record<string, Claim['status']> = {
    'PENDIENTE': 'pending',
    'EN_PROCESO': 'in_progress',
    'RESUELTO': 'resolved',
  }
  return statusMap[apiStatus] || 'pending'
}

// Map API priority to our priority enum
function mapApiPriority(apiPriority: string): Claim['priority'] {
  const priorityMap: Record<string, Claim['priority']> = {
    'ALTA': 'ALTA',
    'MEDIA': 'MEDIA',
    'BAJA': 'BAJA',
  }
  return priorityMap[apiPriority] || 'MEDIA'
}

// Map API criticality to our criticality enum
function mapApiCriticality(apiCriticality: string): Claim['criticality'] {
  const criticalityMap: Record<string, Claim['criticality']> = {
    'ALTA': 'ALTA',
    'MEDIA': 'MEDIA',
    'BAJA': 'BAJA',
  }
  return criticalityMap[apiCriticality] || 'MEDIA'
}

// Transform our payload to API format
function transformToApiPayload(payload: CreateClaimPayload) {
  return {
    tipoReclamoId: payload.tipoReclamoId,
    proyectoId: payload.proyectoId,
    areaId: payload.areaId,
    descripcion: payload.descripcion,
    prioridad: payload.prioridad,
    criticidad: payload.criticidad,
  }
}

export const claimService = {
  async getClaims(token: string): Promise<Claim[]> {
    try {
      const response = await api.reclamos.listarPorCliente(token)
      if (Array.isArray(response)) {
        return response.map(transformApiClaim)
      }
      return []
    } catch (error) {
      console.error('Error fetching claims:', error)
      return []
    }
  },

  async createClaim(payload: CreateClaimPayload, token: string): Promise<Claim> {
    try {
      const apiPayload = transformToApiPayload(payload)
      const response = await api.reclamos.crear(apiPayload, token)
      return transformApiClaim(response)
    } catch (error) {
      console.error('Error creating claim:', error)
      throw error
    }
  },

  async getClaimsByArea(token: string): Promise<Claim[]> {
    try {
      const response = await api.reclamos.listarPorArea(token); 
      
      if (Array.isArray(response)) {
        return response.map(transformApiClaim);
      }
      return [];
    } catch (error) {
      console.error('Error fetching area claims:', error);
      return [];
    }
  },

  async updateEstado(
    reclamoId: string,
    payload: { estado: string; descripcion: string },
    token: string,
  ) {
    return api.reclamos.updateEstado(reclamoId, payload, token)
  },

  async reassignArea(
    reclamoId: string,
    payload: { areaId: string; descripcion: string },
    token: string,
  ) {
    return api.reclamos.reassignArea(reclamoId, payload, token)
  },

  async getClaimById(id: string, token: string): Promise<Claim> {
    const response = await api.reclamos.obtenerPorId(id, token)
    return transformApiClaim(response)
  }
}

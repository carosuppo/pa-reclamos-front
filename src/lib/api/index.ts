"use client"
/**
 * API Client Global (versión rápida basada en OpenAPI)
 *
 * Para el TP usamos un único cliente `api` que llama directamente a los
 * endpoints del backend usando la URL de `NEXT_PUBLIC_BACKEND_UR`.
 *
 * Más adelante, si hace falta, se puede refactorizar a servicios por feature,
 * pero para el deadline esta capa única es suficiente y limpia.
 */

const BASE_URL = "http://localhost:3001"

if (!BASE_URL) {
  // En desarrollo es útil ver esto si la env var no está configurada.
  // No tiramos error aquí para no romper el build en caso de SSR.
  // eslint-disable-next-line no-console
  console.warn(
    "[api] NEXT_PUBLIC_BACKEND_URL no está definida. Configura la URL del backend en tu .env.local",
  )
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  token?: string
}

async function request<TResponse = unknown>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {},
): Promise<TResponse> {
  const url = `${BASE_URL ?? ""}${path}`

  const finalToken =
    token ??
    (typeof window !== "undefined"
      ? localStorage.getItem("access_token") ?? undefined
      : undefined)

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (finalToken) {
    headers.Authorization = `Bearer ${finalToken}`
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (res.ok) {
    return res.json()
  } else {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
}


// ============================================
// API GLOBAL - agrupado por funcionalidad
// ============================================

export const api = {
  // ------------------------------------------
  // AUTH
  // ------------------------------------------
  auth: {
    login: (credentials: { email: string; contraseña: string }) =>
      request<{ access_token: string }>("/auth/login", {
        method: "POST",
        body: credentials,
      }),

    registerCliente: (data: {
      email: string
      contraseña: string
      nombre: string
      telefono: string
    }) =>
      request<{ access_token: string }>("/auth/register-cliente", {
        method: "POST",
        body: data,
      }),

    registerEmpleado: (data: {
      email: string
      contraseña: string
      nombre: string
      telefono: string
    }) =>
      request<{ access_token: string }>("/auth/register-empleado", {
        method: "POST",
        body: data,
      }),
  },

  // ------------------------------------------
  // PROYECTOS
  // ------------------------------------------
  proyectos: {
    crear: (
      data: {
        nombre: string
        descripcion?: string
        tipoProyectoId: string
      },
      token: string,
    ) =>
      request("/proyecto", {
        method: "POST",
        body: data,
        token,
      }),

    listar: (token: string) =>
      request("/proyecto", {
        method: "GET",
        token,
      }),

    obtenerPorId: (id: string, token: string) =>
      request(`/proyecto/${id}`, {
        method: "GET",
        token,
      }),

    actualizar: (
      id: string,
      data: Record<string, unknown>,
      token: string,
    ) =>
      request(`/proyecto/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),

    eliminar: (id: string, token: string) =>
      request(`/proyecto/${id}`, {
        method: "DELETE",
        token,
      }),

    listarPorTipoProyecto: (tipoProyectoId: string, token: string) =>
      request(`/proyecto/tipo-proyecto/${tipoProyectoId}`, {
        method: "GET",
        token,
      }),
  },

  // ------------------------------------------
  // TIPO PROYECTO
  // ------------------------------------------
  tipoProyecto: {
    listar: (token: string) =>
      request("/tipo-proyecto", {
        method: "GET",
        token,
      }),

    obtenerPorId: (id: string, token: string) =>
      request(`/tipo-proyecto/${id}`, {
        method: "GET",
        token,
      }),
  },

  // ------------------------------------------
  // RECLAMOS
  // ------------------------------------------
  reclamos: {
    crear: (data: Record<string, unknown>, token: string) =>
      request("/reclamo", {
        method: "POST",
        body: data,
        token,
      }),

    listarPorCliente: (token: string) =>
      request("/reclamo", {
        method: "GET",
        token,
      }),

    listarPorArea: (token: string) =>
      request("/reclamo/area", {
        method: "GET",
        token,
      }),
    
    updateEstado(id: string, data: any, token: string) {
      return fetch(`${BASE_URL}/reclamo/update-estado/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(r => r.json())
      },

    reassignArea(id: string, data: any, token: string) {
      return fetch(`${BASE_URL}/reclamo/reassign-area/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }).then(r => r.json())
    },

    obtenerPorId(id: string, token: string) {
      return fetch(`${BASE_URL}/reclamo/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then(r => r.json())
    },

    },

    filtros: (
      params: {
        estado?: string
        fechaDesde?: string
        fechaFin?: string
        clienteId?: string
        areaId?: string
      },
      token: string,
    ) => {
      const queryParams = new URLSearchParams()
      if (params.estado) queryParams.append("estado", params.estado)
      if (params.fechaDesde) queryParams.append("fechaDesde", params.fechaDesde)
      if (params.fechaFin) queryParams.append("fechaFin", params.fechaFin)
      if (params.clienteId) queryParams.append("clienteId", params.clienteId)
      if (params.areaId) queryParams.append("areaId", params.areaId)

      return request(`/reclamo/filtros?${queryParams.toString()}`, {
        method: "GET",
        token,
      })
    },

    tiempoPromedioResolucion: (token: string) =>
      request("/reclamo/tiempo-promedio-resolucion", {
        method: "GET",
        token,
      }),

    cantidadPromedioResolucion: (token: string) =>
      request("/reclamo/cantidad-promedio-resolucion", {
        method: "GET",
        token,
      }),

    actualizarEstado: (
      id: string,
      data: Record<string, unknown>,
      token: string,
    ) =>
      request(`/reclamo/update-estado/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),

    reasignarArea: (
      id: string,
      data: Record<string, unknown>,
      token: string,
    ) =>
      request(`/reclamo/reassign-area/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),

    actualizar: (
      id: string,
      data: Record<string, unknown>,
      token: string,
    ) =>
      request(`/reclamo/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),

  // ------------------------------------------
  // TIPO RECLAMO
  // ------------------------------------------
  tipoReclamo: {
    listar: (token: string) =>
      request("/tipo-reclamo", {
        method: "GET",
        token,
      }),

    obtenerPorId: (id: string, token: string) =>
      request(`/tipo-reclamo/${id}`, {
        method: "GET",
        token,
      }),
  },

  // ------------------------------------------
  // CAMBIO ESTADO
  // ------------------------------------------
  cambioEstado: {
    obtenerHistorialPorReclamo: (reclamoId: string, token: string) =>
      request(`/cambio-estado/${reclamoId}`, {
        method: "GET",
        token,
      }),

    listarPorEstado: (estado: string, token: string) =>
      request(`/cambio-estado/estado/${estado}`, {
        method: "GET",
        token,
      }),
  },

  // ------------------------------------------
  // AREAS
  // ------------------------------------------
  areas: {
    crear: (
      data: {
        nombre: string
        descripcion?: string
      },
      token: string,
    ) =>
      request("/area", {
        method: "POST",
        body: data,
        token,
      }),

    listar: (token: string) =>
      request("/area", {
        method: "GET",
        token,
      }),

    obtenerPorId: (id: string, token: string) =>
      request(`/area/${id}`, {
        method: "GET",
        token,
      }),

    actualizar: (
      id: string,
      data: Record<string, unknown>,
      token: string,
    ) =>
      request(`/area/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),

    eliminar: (id: string, token: string) =>
      request(`/area/${id}`, {
        method: "DELETE",
        token,
      }),
  },

  // ------------------------------------------
  // CLIENTE
  // ------------------------------------------
  cliente: {
    actualizarPerfil: (data: Record<string, unknown>, token: string) =>
      request("/cliente/update", {
        method: "PUT",
        body: data,
        token,
      }),
  },

  // ------------------------------------------
  // EMPLEADO
  // ------------------------------------------
  empleado: {
    actualizarPerfil: (data: Record<string, unknown>, token: string) =>
      request("/empleado/update", {
        method: "PUT",
        body: data,
        token,
      }),

    asignarArea: (
      email: string,
      data: Record<string, unknown>,
      token: string,
    ) =>
      request(`/empleado/${email}/area`, {
        method: "PATCH",
        body: data,
        token,
      }),
  },
} as const

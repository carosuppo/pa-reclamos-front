"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Claim } from "../types/claim"
import { useAuthStore } from "@/stores/auth";

export function useReclamoDetail(reclamoId: string) {
  const queryClient = useQueryClient();
  // Accedemos directamente a state.user que está en la raíz de la store
  const userRole = useAuthStore((state) => state.user?.role); 

  return useQuery<Claim | undefined>({
    queryKey: ["reclamo", reclamoId],
    enabled: false, // Desactivamos la búsqueda automática (se usará la caché)
    queryFn: async () => {
      // Usamos el rol para decidir qué caché mirar
      const cacheKey = userRole === "empleado" ? ["claims", "area"] : ["claims"];

      const claims = queryClient.getQueryData<Claim[]>(cacheKey);
      const reclamo = claims?.find((c) => c.id === reclamoId);

      if (!reclamo) {
        throw new Error("Reclamo no encontrado en la memoria local. Por favor, regresa a la lista.");
      }

      return reclamo;
    },
    staleTime: Infinity, // No volver a buscar mientras la app esté abierta
  });
}
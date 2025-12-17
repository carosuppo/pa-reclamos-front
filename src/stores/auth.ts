"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { AuthData } from "@/features/auth/types/auth"
import { decodeJWT, isTokenExpired } from "@/utils/jwt"

export interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  auth: AuthData | null
  user: User | null
  _hasHydrated: boolean
  setAuth: (auth: AuthData | null) => void
  clearAuth: () => void
  setHasHydrated: (state: boolean) => void
}

// Helper para sincronizar el token con cookies
function syncTokenWithCookie(token: string | null) {
  if (typeof window === "undefined") return

  if (token) {
    // Guardar el token en una cookie
    // Nota: esta cookie NO es HttpOnly para que pueda ser leída por el middleware
    // eslint-disable-next-line
    document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  } else {
    // Eliminar la cookie
    // eslint-disable-next-line
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,
      user: null,
      _hasHydrated: false,
      setAuth: (auth) => {
        set({ auth })
        if (auth?.access_token) {
          // Sincronizar con cookie para que el middleware pueda acceder
          syncTokenWithCookie(auth.access_token)

          const decoded = decodeJWT(auth.access_token)
          if (decoded) {
            const user: User = {
              id: decoded.sub || "",
              email: decoded.email || `usuario-${decoded.sub}@example.com`,
              name: decoded.name || decoded.sub || `Usuario ${decoded.role || 'Cliente'}`,
              role: decoded.role?.toLowerCase() || "cliente",
            }
            set({ user })
          }
        } else {
          // Limpiar cookie
          syncTokenWithCookie(null)
          set({ user: null })
        }
      },
      clearAuth: () => {
        // Limpiar cookie al hacer logout
        syncTokenWithCookie(null)
        set({ auth: null, user: null })
      },
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        auth: state.auth,
        user: state.user,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Auth store hydration error:", error)
          return
        }

        // When rehydrating from localStorage, check if token is expired
        if (state?.auth?.access_token) {
          if (isTokenExpired(state.auth.access_token)) {
            // Token is expired, clear the state and cookie
            state.auth = null
            state.user = null
            syncTokenWithCookie(null)
          } else {
            // Token is valid, ensure user info is decoded and sync with cookie
            syncTokenWithCookie(state.auth.access_token)

            const decoded = decodeJWT(state.auth.access_token)
            if (decoded && !state.user) {
              state.user = {
                id: decoded.sub || "",
                email: decoded.email || `usuario-${decoded.sub}@example.com`,
                name: decoded.name || decoded.sub || `Usuario ${decoded.role || 'Cliente'}`,
                role: decoded.role?.toLowerCase() || "cliente",
              }
            }
          }
        }

        // Mark hydration as complete
        state?.setHasHydrated(true)
      },
    },
  ),
)

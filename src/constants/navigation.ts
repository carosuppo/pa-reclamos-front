// Icon keys for navigation items
export type IconKey = 'plus' | 'list' | 'folder' | 'users' | 'barChart' | 'settings'

export type NavigationItem = {
  label: string
  href: string
  icon: IconKey
}

export type UserRole = 'cliente' | 'empleado' | 'admin'

// Navigation items based on user role
export const NAVIGATION_ITEMS_BY_ROLE: Record<UserRole, NavigationItem[]> = {
  cliente: [
    {
      label: "Crear Reclamo",
      href: "/cliente/crear-reclamo",
      icon: "plus",
    },
    {
      label: "Mis Reclamos",
      href: "/cliente/reclamos",
      icon: "list",
    },
    {
      label: "Crear Proyecto",
      href: "/cliente/crear-proyecto",
      icon: "plus",
    },
    {
      label: "Mis Proyectos",
      href: "/cliente/proyectos",
      icon: "folder",
    },
    {
      label: "Reportes",
      href: "/cliente/reportes",
      icon: "barChart",
    }
  ],
  empleado: [
    {
      label: "Reclamos de mi Área",
      href: "/empleado/reclamos-area",
      icon: "list",
    },
    {
      label: "Reportes",
      href: "/empleado/reportes",
      icon: "barChart",
    },
  ],
  admin: [], // Admin navigation not implemented
}

// Legacy export for backward compatibility
export const NAVIGATION_ITEMS = NAVIGATION_ITEMS_BY_ROLE.cliente

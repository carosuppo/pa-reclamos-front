import type React from "react"
import { MainLayout } from "@/components/layout/main-layout"

interface EmpleadoLayoutProps {
  children: React.ReactNode
}

export default function ClienteLayout({ children }: EmpleadoLayoutProps) {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full w-full">
        {children}
      </div>
    </MainLayout>
  )
}

import type React from "react"
import { MainLayout } from "@/components/layout/main-layout"

interface DetailLayoutProps {
  children: React.ReactNode
}

export default function DetailLayout({ children }: DetailLayoutProps) {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full w-full">
        {children}
      </div>
    </MainLayout>
  )
}

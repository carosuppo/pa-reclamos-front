"use client"

import Link from "next/link"
import { useReclamosArea } from "../hooks/use-reclamos-area"

export function ReclamoList() {
  const { data = [], isLoading } = useReclamosArea()

  if (isLoading) return <p>Cargando...</p>

  return (
    <div className="grid gap-4">
      {data.map((reclamo: any) => (
        <Link
          key={reclamo.id}
          href={`/empleado/reclamos/${reclamo.id}`}
          className="bg-card p-4 rounded-xl hover:bg-muted transition"
        >
          <h3 className="font-semibold">{reclamo.tipoReclamo?.nombre}</h3>
          <p className="text-sm text-muted-foreground">
            Estado: {reclamo.estado}
          </p>
        </Link>
      ))}
    </div>
  )
}

import { ReclamoDetail } from "@/features/dashboard/cliente/reclamos/components/reclamo-detail"

interface ReclamoDetailPageProps {
  params: Promise <{ 
    reclamoId: string
  }>
}

export default async function ReclamoDetailPage({ params }: ReclamoDetailPageProps) {
  const { reclamoId } =  await params

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Detalle del Reclamo
        </h1>
      </div>

      <ReclamoDetail reclamoId={reclamoId} />
    </div>
  )
}

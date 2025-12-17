import { ReclamoDetail } from "@/features/dashboard/empleado/components/reclamo-detail"

export default function ReclamoDetailPage({
  params,
}: {
  params: { reclamoId: string }
}) {
  return <ReclamoDetail reclamoId={params.reclamoId} />
}

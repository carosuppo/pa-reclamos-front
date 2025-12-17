import { ReclamoList } from "@/features/dashboard/empleado/components/reclamo-list"

export default function ReclamosEmpleadoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reclamos de mi área</h1>
      <ReclamoList />
    </div>
  )
}

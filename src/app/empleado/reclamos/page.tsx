import { ListaReclamosArea } from "@/features/dashboard/empleado/components/lista-reclamos-area"

export default function ReclamosEmpleadoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reclamos de mi área</h1>
      <ListaReclamosArea />
    </div>
  )
}

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth"
import { saveAuthToken } from "@/utils/auth-storage"
import { useRegisterMutation } from "./useAuthMutations"

export function useRegisterForm() {
  const router = useRouter()
  const { mutateAsync, isPending, error } = useRegisterMutation()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const contraseña = formData.get("password") as string
    const nombre = formData.get("nombre") as string
    const telefono = formData.get("telefono") as string

    if (email && contraseña && nombre && telefono) {
      try {
        const data = await mutateAsync({ email, contraseña, nombre, telefono })
        setAuth(data)
        saveAuthToken(data.access_token)
        // Redirigir a la página principal después de registro exitoso
        router.push("/")
      } catch (err) {
        console.error("ERROR REGISTER:", err)
      }
    }
  }

  return {
    handleSubmit,
    loading: isPending,
    error: error?.message || null,
  }
}

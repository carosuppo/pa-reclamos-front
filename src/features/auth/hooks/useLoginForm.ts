import { useRouter } from "next/navigation"
import { useLoginMutation } from "./useAuthMutations"
import { saveAuthToken } from "@/utils/auth-storage"

export function useLoginForm() {
  const router = useRouter()
  const { mutateAsync, isPending, error } = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (email && password) {
      try {
        const data = await mutateAsync({ email, contraseña:password })
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
  };
}


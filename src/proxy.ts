import { type NextRequest, NextResponse } from "next/server"

// Middleware-like proxy usado por Next.js 15+ en vez de `middleware.ts`
// Protección optimista de rutas:
// - Permite siempre: /login y /register
// - Para el resto de rutas, chequea de forma OPTIMISTA si existe un token JWT
//   en una cookie (por ejemplo "access_token")
// - Si no hay token, redirige a /login
//
// NOTA: La autenticación funciona con Zustand store (@/stores/auth)
// El store sincroniza automáticamente el token con cookies para que este
// middleware pueda acceder a él desde el servidor.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas que NO requieren autenticación
  const publicPaths = ["/login", "/register"]

  // Ignorar assets estáticos, archivos públicos, y rutas internas de Next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next()
  }

  // Si la ruta actual es pública, dejamos pasar
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Chequeo "optimista": simplemente miramos si hay un token en cookies.
  // No se valida ni se decodifica el JWT aquí.
  const token = request.cookies.get("access_token")?.value

  if (!token) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    // Opcional: preservar la ruta original para un posible redirect post-login
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}


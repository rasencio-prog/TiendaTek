
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

// Definimos la estructura de los datos de sesión, debe ser la misma que en la API
interface SessionData {
  isLoggedIn: boolean;
}

// Configuración de la sesión, debe ser la misma que en la API
const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'tiendatek-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function middleware(req: NextRequest) {
  
  // Obtenemos la sesión a partir de las cookies de la petición
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);

  // Si el usuario no está logueado (isLoggedIn no es true), lo redirigimos a la página de login
  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Si el usuario sí está logueado, permitimos que la petición continúe
  return NextResponse.next();
}

// El "matcher" especifica en qué rutas se debe ejecutar este middleware
export const config = {
  matcher: '/dashboard/:path*',
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session'; // <-- ¡NUEVA IMPORTACIÓN!

export async function middleware(req: NextRequest) {
  const session = await getSession(cookies()); // <-- ¡USAMOS EL NUEVO HELPER!

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
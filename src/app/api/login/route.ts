
import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service'; // <-- ¡NUEVA IMPORTACIÓN!
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionData {
  isLoggedIn: boolean;
  userId: string;
  email: string;
  rol: string;
}

const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'tiendatek-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function POST(req: NextRequest) {
  // --- DEPURACIÓN DE VARIABLES DE ENTORNO ---
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Cargada" : "NO CARGADA");
  console.log("Supabase Service Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Cargada" : "NO CARGADA");
  // --- FIN DEPURACIÓN ---

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 });
  }

  console.log(`Buscando usuario con email: ${email}`);

  // Usamos el cliente de servicio para esta operación privilegiada
  const { data: user, error: userError } = await supabaseService
    .from('usuarios')
    .select('id, email, password_hash, rol')
    .eq('email', email)
    .single();

  if (userError) {
    console.error('Error de Supabase al buscar usuario:', userError);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }

  if (!user) {
    console.log('La consulta a Supabase no devolvió ningún usuario.');
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  console.log('--- INICIO DEPURACIÓN DE HASH ---');
  console.log('Contraseña recibida del frontend:', password);
  console.log('Hash guardado en la BD:', user.password_hash);

  const passwordIsValid = await bcrypt.compare(password, user.password_hash);

  console.log('¿La comparación de bcrypt fue exitosa?:', passwordIsValid);
  console.log('--- FIN DEPURACIÓN DE HASH ---');

  if (!passwordIsValid) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = await getIronSession<SessionData>(cookies() as any, sessionOptions);
  session.isLoggedIn = true;
  session.userId = user.id;
  session.email = user.email;
  session.rol = user.rol;
  await session.save();

  return NextResponse.json({ message: 'Login exitoso' }, { status: 200 });
}

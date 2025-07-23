import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/session'; // <-- ¡NUEVA IMPORTACIÓN!

export async function POST(req: NextRequest) {
  const session = await getSession(cookies()); // <-- ¡USAMOS EL NUEVO HELPER!
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 });
  }

  console.log(`Buscando usuario con email: ${email}`);

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
  session.isLoggedIn = true;
  session.userId = user.id;
  session.email = user.email;
  session.rol = user.rol;
  await session.save();

  return NextResponse.json({ message: 'Login exitoso' }, { status: 200 });
}
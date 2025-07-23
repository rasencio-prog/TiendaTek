import { getIronSession } from "iron-session";
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// Definimos la estructura de los datos de sesión
export interface SessionData {
  isLoggedIn: boolean;
  userId: string;
  email: string;
  rol: string;
}

// Configuración de la sesión
const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'tiendatek-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(cookies: Promise<ReadonlyRequestCookies> | ReadonlyRequestCookies) {
  if (!process.env.SECRET_COOKIE_PASSWORD) {
    throw new Error("SECRET_COOKIE_PASSWORD no está definida. Por favor, configúrala en tus variables de entorno.");
  }
  const resolvedCookies = await cookies;
  return getIronSession<SessionData>(resolvedCookies, sessionOptions);
}
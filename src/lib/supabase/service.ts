
import { createClient } from '@supabase/supabase-js'

// Este cliente usa las claves de entorno del servidor y tiene privilegios de administrador.
// NUNCA debe ser expuesto o usado en el lado del cliente (navegador).
export const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

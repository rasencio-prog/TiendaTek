'use server';

import { supabaseService } from '@/lib/supabase/service';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  const { data, error } = await supabaseService.from('usuarios').select('id, nombre, email, rol');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data;
}

export async function createUser(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rol = formData.get('rol') as string;

  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await supabaseService.from('usuarios').insert([{ nombre, email, password_hash, rol }]);

  if (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Error al crear el usuario' };
  }

  revalidatePath('/dashboard/usuarios');
  return { success: true, message: 'Usuario creado exitosamente' };
}

export async function updateUser(formData: FormData) {
  const id = formData.get('id') as string;
  const nombre = formData.get('nombre') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rol = formData.get('rol') as string;

  const updateData: { nombre: string; email: string; password_hash?: string; rol: string } = { nombre, email, rol };

  if (password) {
    updateData.password_hash = await bcrypt.hash(password, 10);
  }

  const { error } = await supabaseService.from('usuarios').update(updateData).eq('id', id);

  if (error) {
    console.error('Error updating user:', error);
    return { success: false, message: 'Error al actualizar el usuario' };
  }

  revalidatePath('/dashboard/usuarios');
  return { success: true, message: 'Usuario actualizado exitosamente' };
}

export async function deleteUser(id: string) {
  const { error } = await supabaseService.from('usuarios').delete().eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    return { success: false, message: 'Error al eliminar el usuario' };
  }

  revalidatePath('/dashboard/usuarios');
  return { success: true, message: 'Usuario eliminado exitosamente' };
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUser, updateUser } from './actions';

// Definimos el tipo para el usuario para mayor claridad
type User = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
};

interface UserFormModalProps {
  user?: User;
  children: React.ReactNode;
  onSuccess: () => void; // Callback para ejecutar tras una operación exitosa
}

export function UserFormModal({ user, children, onSuccess }: UserFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!user;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const action = isEditMode ? updateUser : createUser;
    const result = await action(formData);

    if (result.success) {
      onSuccess(); // Llamamos al callback para refrescar los datos
      setIsOpen(false); // Cerramos el modal
    }
    // Aquí podrías manejar el caso de `result.success === false` mostrando un error
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">{isEditMode ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {isEditMode && <input type="hidden" name="id" value={user.id} />}
          <div>
            <Label htmlFor="nombre" className="text-xs">Nombre</Label>
            <Input id="nombre" name="nombre" defaultValue={user?.nombre} required className="text-sm" />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={user?.email} required className="text-sm" />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs">Contraseña</Label>
            <Input id="password" name="password" type="password" placeholder={isEditMode ? 'Dejar en blanco para no cambiar' : ''} className="text-sm" />
          </div>
          <div>
            <Label htmlFor="rol" className="text-xs">Rol</Label>
            <Select name="rol" defaultValue={user?.rol}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="cajero">Cajero</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="text-sm">{isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

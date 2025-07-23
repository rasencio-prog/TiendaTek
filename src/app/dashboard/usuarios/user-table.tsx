'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteUser } from './actions';
import { UserFormModal } from './user-form-modal';

import { Pencil, Trash2 } from 'lucide-react';

// Definimos el tipo para el usuario
type User = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
};

interface UsersTableProps {
  users: User[];
  onActionSuccess: () => void; // Callback para refrescar
}

export function UsersTable({ users, onActionSuccess }: UsersTableProps) {
  async function handleDelete(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const result = await deleteUser(id);
      if (result.success) {
        onActionSuccess();
      }
      // Aquí podrías manejar el caso de error
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">Nombre</TableHead>
          <TableHead className="text-xs">Email</TableHead>
          <TableHead className="text-xs">Rol</TableHead>
          <TableHead className="text-xs">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="text-xs">{user.nombre}</TableCell>
            <TableCell className="text-xs">{user.email}</TableCell>
            <TableCell className="text-xs">{user.rol}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <UserFormModal user={user} onSuccess={onActionSuccess}>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </UserFormModal>
                <Button variant="outline" size="icon" onClick={() => handleDelete(user.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

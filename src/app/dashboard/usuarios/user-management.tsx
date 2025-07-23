'use client';

import { useState, useMemo, startTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UsersTable } from './user-table';
import { UserFormModal } from './user-form-modal';
import { getUsers } from './actions'; // Importamos la acción para obtener usuarios

// Definimos el tipo para los usuarios para mayor seguridad de tipos
type User = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
};

export function UserManagement({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', or 'cajero'

  // Función para recargar los usuarios desde la base de datos
  const refreshUsers = () => {
    startTransition(() => {
      getUsers().then(setUsers);
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameMatch = user.nombre.toLowerCase().includes(nameFilter.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(emailFilter.toLowerCase());
      const roleMatch = roleFilter === 'all' || user.rol === roleFilter;
      return nameMatch && emailMatch && roleMatch;
    });
  }, [users, nameFilter, emailFilter, roleFilter]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Gestión de Usuarios</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:flex-1 gap-4">
          <Input 
            placeholder="Filtrar por nombre..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="text-sm"
          />
          <Input 
            placeholder="Filtrar por email..."
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="text-sm"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón para agregar */}
      <div className="flex justify-start">
        <UserFormModal onSuccess={refreshUsers}>
          <Button variant="outline">+ Agregar Usuario</Button>
        </UserFormModal>
      </div>

      {/* Tabla de Usuarios */}
      <UsersTable users={filteredUsers} onActionSuccess={refreshUsers} />
    </div>
  );
}

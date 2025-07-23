import { getUsers } from './actions';
import { UserManagement } from './user-management';

export default async function UsuariosPage() {
  // Obtenemos los datos iniciales en el servidor
  const initialUsers = await getUsers();

  return (
    // Pasamos los datos iniciales al componente de cliente
    <UserManagement initialUsers={initialUsers} />
  );
}
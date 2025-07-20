
import Link from "next/link";

const links = [
  { href: "/dashboard/inventario", label: "Inventario" },
  { href: "/dashboard/ventas", label: "Ventas" },
  { href: "/dashboard/usuarios", label: "Gestión de Usuarios" },
  { href: "/dashboard/reportes", label: "Reportes" },
];

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">TiendaTek</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="block p-2 rounded hover:bg-gray-700">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

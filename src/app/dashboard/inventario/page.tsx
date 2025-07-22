import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "@/components/ProductTable";
import { cookies } from 'next/headers';

// Definimos el tipo de dato para un producto, basándonos en tu tabla
export type Product = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  activo: boolean;
};

export default async function InventarioPage() {
  const cookieStore = cookies(); // Obtenemos el cookieStore aquí
  const supabase = createClient(cookieStore); // Se lo pasamos a createClient

  const { data: products, error } = await supabase
    .from("productos")
    .select("id, nombre, descripcion, precio, stock, activo");

  if (error) {
    console.error("Error fetching products:", error);
    // Puedes mostrar un mensaje de error más amigable aquí
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Inventario de Productos</h1>
        <p className="text-red-500">Error al cargar productos: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Inventario de Productos</h1>
      <ProductTable products={products as Product[]} />
    </div>
  );
}

// Comentario de prueba para Git
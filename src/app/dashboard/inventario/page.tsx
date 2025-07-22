
import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "@/components/ProductTable";
import { cookies } from 'next/headers'; // <-- ¡NUEVA IMPORTACIÓN!

// Definimos el tipo de dato para un producto, basándonos en tu tabla
export type Product = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  activo: boolean;
};

async function getProducts(): Promise<Product[]> {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("productos")
    .select("id, nombre, descripcion, precio, stock, activo");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

export default async function InventarioPage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Inventario de Productos</h1>
      <ProductTable products={products} />
    </div>
  );
}

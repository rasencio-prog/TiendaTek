
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/app/dashboard/inventario/page"; // Reutilizamos el tipo

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.nombre}</TableCell>
                <TableCell>{product.descripcion || "N/A"}</TableCell>
                <TableCell className="text-right">${product.precio.toFixed(2)}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.activo ? "Activo" : "Inactivo"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No se encontraron productos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

import { ProductByCategory } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(id: string): Promise<ProductByCategory[]> {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return res.json() as Promise<ProductByCategory[]>;
}

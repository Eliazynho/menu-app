import { Restaurant } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRestaurants(): Promise<Restaurant[]> {
  const res = await fetch(`${API_URL}/restaurants`);
  if (!res.ok) throw new Error("Erro ao buscar restaurantes");
  return res.json() as Promise<Restaurant[]>;
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant> {
  const res = await fetch(`${API_URL}/restaurants/${slug}`);
  if (!res.ok) throw new Error("Erro ao buscar restaurante");
  return res.json() as Promise<Restaurant>;
}

export async function createRestaurant(
  data: Partial<Restaurant>
): Promise<Restaurant> {
  const res = await fetch(`${API_URL}/restaurants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar restaurante");
  return res.json() as Promise<Restaurant>;
}

export async function updateRestaurant(
  slug: string,
  data: Partial<Restaurant>
): Promise<Restaurant> {
  const res = await fetch(`${API_URL}/restaurants/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar restaurante");
  return res.json() as Promise<Restaurant>;
}

export async function deleteRestaurant(
  slug: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/restaurants/${slug}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar restaurante");
  return res.json() as Promise<{ message: string }>;
}

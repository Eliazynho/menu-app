import { OrderPayload } from "@/types"; // você já deve ter um tipo definido

export async function createNewOrder(data: OrderPayload, token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao criar pedido");

  return await response.json();
}

import { UserData, userCreate } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createClient(data: userCreate): Promise<UserData> {
  const res = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar restaurante");
  return res.json() as Promise<UserData>;
}

export async function validateUser(token: string): Promise<UserData> {
  const res = await fetch(`${API_URL}/clients/validate-client`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Erro ao criar restaurante");
  return res.json() as Promise<UserData>;
}

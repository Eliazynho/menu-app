import { UserData, ValidateData, userCreate } from "@/types";

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

export async function validateUser(
  token: string
): Promise<ValidateData | null> {
  const res = await fetch(`${API_URL}/auth/validate-client`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    console.log("Token inválido ou expirado (401 Unauthorized).");
    return null; // ou trate como quiser (ex: lançar erro, retornar false, etc)
  }

  if (!res.ok) {
    // Outros erros genéricos
    throw new Error(`Erro na validação do usuário: ${res.status}`);
  }

  const data = (await res.json()) as ValidateData;
  console.log("Dados do usuário:", data);
  return data;
}

// pages/api/additionals.ts (versão corrigida)
import { AdditionalCategory } from "@/types"; // Importe o tipo correto
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Corrija o tipo de retorno para Promise<AdditionalCategory[]>
export async function getAdditionals(
  id: string
): Promise<AdditionalCategory[]> {
  const res = await fetch(`${API_URL}/additional-categories/${id}/additionals`);

  if (!res.ok) {
    // Considere logar o status ou a resposta para debug em caso de erro
    console.error(`Erro ao buscar adicionais para ID ${id}: ${res.status}`);
    throw new Error("Erro ao buscar adicionais");
  }

  // Corrija a asserção de tipo para AdditionalCategory[]
  const data = await res.json();
  // Opcional: Adicione uma verificação básica aqui se a estrutura for crítica
  // Ex: if (!Array.isArray(data)) throw new Error("Formato de resposta inesperado");

  return data as AdditionalCategory[];
}

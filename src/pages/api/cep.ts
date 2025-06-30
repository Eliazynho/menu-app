import { CepAddress } from "@/types";

export async function getAddressByCep(cep: string): Promise<CepAddress> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cep/getCep?cep=${cep}`
  );

  return res.json() as Promise<CepAddress>;
}

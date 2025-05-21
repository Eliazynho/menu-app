export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  additionalOptions?: string[]; // Lista de opções adicionais para o produto
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  price_from?: boolean;
  components?: string[];
  additionalOptions?: string[];
}

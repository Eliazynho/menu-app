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

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  color: string;
  minimum_order_value: number;
  delivery_time: string;
  opening_hours: string;
  logo_url?: string; // Link da logo (opcional)
  background_url?: string; // Link da imagem de fundo (opcional)
}

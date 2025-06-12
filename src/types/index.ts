export interface ProductByCategory {
  id: string;
  name: string;
  description: string;
  products: [
    {
      id: string;
      name: string;
      price: number;
      category_id: string;
      description: string;
      image_url: string;
    }
  ];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id?: string;
  add_categoriesId?: string;
}
// types/index.ts
export interface CartRestaurant {
  id: string;
  name: string;
  logo_url?: string;
  color?: string;
  delivery_fee?: number;
}

export interface CartItem {
  product: Product;
  additionalOptions: Record<string, number>;
  quantity: number;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  delivery_fee?: number;
  created_at?: string;
  color: string;
  minimum_order_value: number;
  delivery_time: string;
  opening_hours: string;
  logo_url?: string; // Link da logo (opcional)
  background_url?: string; // Link da imagem de fundo (opcional)
}

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export interface PaymentMethod {
  type: "credit" | "debit" | "pix" | "cash";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  name?: string;
}

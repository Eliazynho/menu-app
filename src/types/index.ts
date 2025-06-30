export interface UserData {
  client: {
    id: string;
    restaurant_id: string;
    name: string;
    phone: string;
    created_at: string;
  };
  token: string;
}

export interface ValidateData {
  id: string;
  restaurant_id: string;
  name: string;
  phone: string;
  created_at: string;
}

export interface userCreate {
  name: string;
  phone: string;
  restaurant_id: string;
}

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
  add_categoriesId?: AdditionalCategory[];
}
// types/index.ts
export interface CartRestaurant {
  phone?: string;
  address?: string;
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

// types/additionals.ts
export interface AdditionalOption {
  id: string;
  name: string;
  price: number;
  created_at: string;
  restaurant_id: string;
  add_categories_id: string;
}

export interface AdditionalCategory {
  id: string;
  name: string;
  restaurant_id: string;
  created_at: string;
  additional_options: AdditionalOption[];
}

export interface AdditionalsState {
  categories: AdditionalCategory[];
  loading: boolean;
  error: string | null;
  currentRestaurantId: string | null;
}

export interface CepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  client_id: string;
  client_address_id: string;
  status: "Novo" | "Preparando" | "Finalizado" | "Cancelado" | string;
  total: number;
  created_at: string;
  description: string;
  payment_method: "money" | "credit_card" | "pix" | string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  additionals: OrderItemAdditional[];
}

export interface OrderItemAdditional {
  id: string;
  order_item_id: string;
  additional_option_id: string;
  quantity: number;
  created_at: string;
  price: number;
  name: string;
}

export interface OrderPayload {
  restaurant_id: string;
  client_id: string;
  status: string;
  total: number;
  description: string;
  payment_method: "money" | "credit" | "pix";
  client_address_id?: string; // substitui client_address
  items: {
    product_id: string;
    quantity: number;
    additionals?: {
      additional_option_id: string;
      quantity: number;
    }[];
  }[];
}

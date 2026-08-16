// Tipos que reflejan exactamente las columnas de tu MySQL Workbench

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  is_active?: boolean;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  image_url?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  category_id?: number;
  // Campos enriquecidos por el JOIN de catalog.service.ts
  category_name?: string;
  category_slug?: string;
  base_price?: number;
  stock?: number;
  attributes?: Record<string, string>;
  image_url?: string;
  variations?: ProductVariation[];
}

export interface PriceHistory {
  recorded_date: string;
  recorded_price: number;
  competitor_name: string;
}

export interface Supplier {
  id: number;
  company_name: string;
  contact_email?: string;
  phone?: string;
  created_at?: string;
}

export interface Order {
  id: number;
  user_id?: number;
  guest_email?: string;
  status: 'pending' | 'paid' | 'cancelled' | 'shipped';
  total_amount: number;
  created_at: string;
}

export interface User {
  id: number;
  firstName?: string;
  name?: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

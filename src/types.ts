export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  available: boolean;
  featured: boolean;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  landmark?: string;
  notes?: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    specialNotes?: string;
  }[];
  total: number;
  status: "New" | "Preparing" | "Dispatched" | "Delivered" | "Cancelled";
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Food" | "Bakery" | "Coffee" | "Cafe" | "Behind the Scenes";
  image: string;
  caption?: string;
}

export interface CafeSettings {
  cafeName: string;
  tagline: string;
  phone: string;
  internationalPhone: string;
  address: string;
  googleLocation: string;
  aryWhatsApp: string;
  aryWhatsAppIntl: string;
  openingHours: string;
  deliveryMinOrder: number;
  deliveryFee: number;
}

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  landmark: string;
  notes: string;
}

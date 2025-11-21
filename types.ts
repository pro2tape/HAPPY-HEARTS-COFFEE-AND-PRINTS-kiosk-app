export enum Category {
  IcedCoffee = 'Iced Coffee',
  HotCoffee = 'Hot Coffee',
  Frappe = 'Frappes',
  MilkTea = 'Milk Tea',
  FruitSoda = 'Fruit Soda',
  Meals = 'Rice & Meals',
  Snacks = 'Snacks',
  Dessert = 'Desserts'
}

export interface MenuItemVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  basePrice?: number;
  variants?: MenuItemVariant[];
  description?: string;
}

export interface CartItem extends MenuItem {
  cartId: string;
  quantity: number;
  selectedVariant?: MenuItemVariant;
}

export enum OrderStatus {
  Pending = 'Pending',
  Preparing = 'Preparing',
  Ready = 'Ready',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Order {
  id: string;
  orderNumber: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
  customerName?: string;
}

export interface StaffLog {
  id: string;
  staffName: string;
  clockIn: number;
  clockOut?: number;
  date: string; // ISO Date string YYYY-MM-DD
  hourlyRate: number;
}

export interface StaffMember {
  id: string;
  name: string;
  pin: string;
  hourlyRate: number;
}
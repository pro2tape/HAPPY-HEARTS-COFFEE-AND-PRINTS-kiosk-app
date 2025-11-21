import { Category, MenuItem, StaffMember } from './types';

// --- Reusable Variant Configs ---
const ICED_COFFEE_VARIANTS = [
  { name: 'Primera (8oz)', price: 49 },
  { name: 'Segonda (12oz)', price: 69 },
  { name: 'Tresiera (16oz)', price: 89 },
  { name: 'Quarta (22oz)', price: 109 },
];

const FRUIT_SODA_VARIANTS = [
  { name: 'Primera (8oz)', price: 29 },
  { name: 'Segonda (12oz)', price: 39 },
  { name: 'Tresiera (16oz)', price: 49 },
  { name: 'Quarta (22oz)', price: 59 },
];

const FRAPPE_VARIANTS = [
  { name: 'Small (12oz)', price: 109 },
  { name: 'Medium (16oz)', price: 135 },
  { name: 'Large (22oz)', price: 160 },
];

const MILK_TEA_VARIANTS = [
  { name: 'Small', price: 35 },
  { name: 'Regular', price: 50 },
  { name: 'Large', price: 70 },
];

const DESSERT_VARIANTS = [
  { name: 'Small', price: 40 },
  { name: 'Regular', price: 55 },
  { name: 'Large', price: 85 },
];

const FRIES_VARIANTS = [
  { name: 'Small', price: 25 },
  { name: 'Medium', price: 35 },
  { name: 'Large', price: 50 },
];

export const MENU_ITEMS: MenuItem[] = [
  // --- Iced Coffee ---
  { id: 'ic-1', name: 'Caramel Macchiato', category: Category.IcedCoffee, variants: ICED_COFFEE_VARIANTS },
  { id: 'ic-2', name: 'Mocha Latte', category: Category.IcedCoffee, variants: ICED_COFFEE_VARIANTS },
  { id: 'ic-3', name: 'Vanilla Latte', category: Category.IcedCoffee, variants: ICED_COFFEE_VARIANTS },
  { id: 'ic-4', name: 'Cappucino Latte', category: Category.IcedCoffee, variants: ICED_COFFEE_VARIANTS },
  { id: 'ic-5', name: 'Vietnamese Coffee', category: Category.IcedCoffee, variants: ICED_COFFEE_VARIANTS },
  { id: 'ic-6', name: 'Dirty Matcha', category: Category.IcedCoffee, variants: ICED_COFFEE_VARIANTS },
  { id: 'ic-7', name: 'Spanish Latte', category: Category.IcedCoffee, variants: ICED_COFFEE_VARIANTS },
  { id: 'ic-8', name: 'Oreo Cream Latte', category: Category.IcedCoffee, variants: ICED_COFFEE_VARIANTS },

  // --- Fruit Soda ---
  { id: 'fs-1', name: 'Rootbeer', category: Category.FruitSoda, variants: FRUIT_SODA_VARIANTS },
  { id: 'fs-2', name: 'Strawberry', category: Category.FruitSoda, variants: FRUIT_SODA_VARIANTS },
  { id: 'fs-3', name: 'Apple Green', category: Category.FruitSoda, variants: FRUIT_SODA_VARIANTS },
  { id: 'fs-4', name: 'Bubble Gum', category: Category.FruitSoda, variants: FRUIT_SODA_VARIANTS },
  { id: 'fs-5', name: 'Blueberry', category: Category.FruitSoda, variants: FRUIT_SODA_VARIANTS },

  // --- Hot Coffee (Fixed Price) ---
  { id: 'hc-1', name: 'Americano', category: Category.HotCoffee, basePrice: 49 },
  { id: 'hc-2', name: 'Latte', category: Category.HotCoffee, basePrice: 49 },
  { id: 'hc-3', name: 'Cappuccino', category: Category.HotCoffee, basePrice: 49 },
  { id: 'hc-4', name: 'Caramel Latte', category: Category.HotCoffee, basePrice: 49 },
  { id: 'hc-5', name: 'Mocha Latte', category: Category.HotCoffee, basePrice: 49 },
  { id: 'hc-6', name: 'Spanish Latte', category: Category.HotCoffee, basePrice: 49 },
  { id: 'hc-7', name: 'Matcha Latte', category: Category.HotCoffee, basePrice: 49 },
  { id: 'hc-8', name: 'Hot Chocolate', category: Category.HotCoffee, basePrice: 49 },

  // --- Frappes ---
  { id: 'fr-1', name: 'Happy Hearts Signature', category: Category.Frappe, variants: FRAPPE_VARIANTS },
  { id: 'fr-2', name: 'Caramel Frappe', category: Category.Frappe, variants: FRAPPE_VARIANTS },
  { id: 'fr-3', name: 'Cookies & Cream', category: Category.Frappe, variants: FRAPPE_VARIANTS },
  { id: 'fr-4', name: 'Strawberry Frappe', category: Category.Frappe, variants: FRAPPE_VARIANTS },
  { id: 'fr-5', name: 'Mocha Frappe', category: Category.Frappe, variants: FRAPPE_VARIANTS },
  { id: 'fr-6', name: 'Matcha Frappe', category: Category.Frappe, variants: FRAPPE_VARIANTS },
  { id: 'fr-7', name: 'Vanilla Frappe', category: Category.Frappe, variants: FRAPPE_VARIANTS },
  { id: 'fr-8', name: 'Choco Frappe', category: Category.Frappe, variants: FRAPPE_VARIANTS },

  // --- Milk Tea ---
  { id: 'mt-1', name: 'Chocolate', category: Category.MilkTea, variants: MILK_TEA_VARIANTS },
  { id: 'mt-2', name: 'Matcha', category: Category.MilkTea, variants: MILK_TEA_VARIANTS },
  { id: 'mt-3', name: 'Salted Caramel', category: Category.MilkTea, variants: MILK_TEA_VARIANTS },
  { id: 'mt-4', name: 'Cookies n\' Cream', category: Category.MilkTea, variants: MILK_TEA_VARIANTS },
  { id: 'mt-5', name: 'Okinawa', category: Category.MilkTea, variants: MILK_TEA_VARIANTS },
  { id: 'mt-6', name: 'Thai Milk Tea', category: Category.MilkTea, variants: MILK_TEA_VARIANTS },
  { id: 'mt-7', name: 'Honey Dew', category: Category.MilkTea, variants: MILK_TEA_VARIANTS },

  // --- Snacks: Burgers ---
  {
    id: 'sn-b1', name: 'Regular Burger', category: Category.Snacks,
    variants: [{ name: 'Solo A', price: 35 }, { name: 'Combo 1 (w/ Drink)', price: 45 }]
  },
  {
    id: 'sn-b2', name: 'Cheese Burger', category: Category.Snacks,
    variants: [{ name: 'Solo B', price: 40 }, { name: 'Combo 2 (w/ Drink)', price: 55 }]
  },
  {
    id: 'sn-b3', name: 'Ham & Cheese Burger', category: Category.Snacks,
    variants: [{ name: 'Solo C', price: 65 }, { name: 'Combo 3 (w/ Drink)', price: 85 }] // Est price for combo
  },
  { id: 'sn-b4', name: 'Date Combo', category: Category.Snacks, basePrice: 110, description: '2 Burgers + Drinks' },
  { id: 'sn-b5', name: 'Barkada Combo', category: Category.Snacks, basePrice: 160, description: '3 Burgers + Pitcher' },

  // --- Snacks: Hotdog ---
  { id: 'sn-h1', name: 'Regular Hotdog', category: Category.Snacks, basePrice: 35 },
  { id: 'sn-h2', name: 'Classic Hotdog', category: Category.Snacks, basePrice: 45 },
  { id: 'sn-h3', name: 'Hungarian Big Hotdog', category: Category.Snacks, basePrice: 69 },
  { id: 'sn-h4', name: 'Cheesy Overload Hotdog', category: Category.Snacks, basePrice: 55 },

  // --- Snacks: Nachos ---
  { id: 'sn-n1', name: 'Solo Nachos', category: Category.Snacks, basePrice: 55, description: 'Cheesy & Veggie on top' },
  { id: 'sn-n2', name: 'Double Nachos', category: Category.Snacks, basePrice: 85, description: 'Cheesy, Veggie & Ground Meat' },
  { id: 'sn-n3', name: 'Nachos Overload', category: Category.Snacks, basePrice: 130, description: 'French Fries, Cheesy, Veggie & Meat' },

  // --- Snacks: Fries ---
  { id: 'sn-f1', name: 'French Fries', category: Category.Snacks, variants: FRIES_VARIANTS },
  { id: 'sn-f2', name: 'Cheesy Fries Overload', category: Category.Snacks, basePrice: 65 },
  { id: 'sn-f3', name: 'Cheesy Fries & Ham', category: Category.Snacks, basePrice: 75 },
  { id: 'sn-f4', name: 'Cheesy + Hotdog Overload', category: Category.Snacks, basePrice: 95 },

  // --- Snacks: Sandwiches & Pasta ---
  { id: 'sn-s1', name: 'Ham & Cheese Sandwich', category: Category.Snacks, basePrice: 45 },
  { id: 'sn-s2', name: 'Tuna Sandwich', category: Category.Snacks, basePrice: 55 },
  { id: 'sn-s3', name: 'Pancit Canton', category: Category.Snacks, basePrice: 30 },
  { 
    id: 'sn-ch1', name: 'Happy Clubhouse Set A', category: Category.Snacks, basePrice: 140,
    description: '4pcs Sandwiches + Medium Fries'
  },
  { 
    id: 'sn-ch2', name: 'Happy Clubhouse Set B', category: Category.Snacks, basePrice: 170,
    description: '4pcs Sandwiches + Medium Fries + 3 Ice Tea'
  },
  { 
    id: 'sn-ch3', name: 'Happy Clubhouse Set C', category: Category.Snacks, basePrice: 180,
    description: '6pcs Sandwiches + Large Fries'
  },

  // --- Meals ---
  {
    id: 'ml-1', name: 'Lugaw', category: Category.Meals,
    variants: [{ name: 'Small', price: 15 }, { name: 'Plain', price: 25 }, { name: 'With Egg', price: 35 }]
  },
  {
    id: 'ml-2', name: 'Sopas', category: Category.Meals,
    variants: [{ name: 'Small', price: 15 }, { name: 'Plain', price: 25 }, { name: 'With Egg', price: 35 }]
  },
  {
    id: 'ml-3', name: 'Happy Ramen', category: Category.Meals,
    variants: [{ name: 'Regular', price: 65 }, { name: 'Overload', price: 85 }]
  },

  // --- Desserts ---
  { id: 'ds-1', name: 'Halo-Halo Overload', category: Category.Dessert, variants: DESSERT_VARIANTS },
  { id: 'ds-2', name: 'Mais Con Yelo', category: Category.Dessert, variants: DESSERT_VARIANTS },
  { id: 'ds-3', name: 'Saging Con Yelo', category: Category.Dessert, variants: DESSERT_VARIANTS },
  { id: 'ds-4', name: 'Manga Con Yelo', category: Category.Dessert, variants: DESSERT_VARIANTS },
  { id: 'ds-5', name: 'Crema De Leche', category: Category.Dessert, variants: DESSERT_VARIANTS },
  { 
    id: 'ds-6', name: 'Mango Graham', category: Category.Dessert, 
    variants: [
      { name: 'Small', price: 55 },
      { name: 'Regular', price: 80 },
      { name: 'Large', price: 120 }
    ]
  },
];

export const STAFF_MEMBERS: StaffMember[] = [
  { id: 's1', name: 'Maria', pin: '1234', hourlyRate: 65 },
  { id: 's2', name: 'Juan', pin: '5678', hourlyRate: 65 },
];
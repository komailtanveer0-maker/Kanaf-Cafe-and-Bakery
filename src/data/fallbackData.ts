import { MenuItem, Category, GalleryItem, CafeSettings } from "../types";
import rawMenuData from "../data_menu.json";

export const initialCategories: Category[] = rawMenuData.categories as Category[];
export const initialMenuItems: MenuItem[] = rawMenuData.items as MenuItem[];

export const initialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Craving the Signature Grilled Panini",
    category: "Food",
    image: "/assets/kanaf_panini_poster.jpg",
    caption: "Golden grilled panini packed with seasoned chicken and melted cheese."
  },
  {
    id: "gal-2",
    title: "Golden Crunchy Crispy Chicken",
    category: "Food",
    image: "/assets/kanaf_crispy_chicken.jpg",
    caption: "Crispy chicken tenders drizzled with chef's creamy white sauce."
  },
  {
    id: "gal-3",
    title: "Freshly Made Specialty Coffee",
    category: "Coffee",
    image: "/assets/kanaf_coffee_poster.jpg",
    caption: "Rich aroma and comforting taste of freshly brewed Arabica coffee."
  },
  {
    id: "gal-4",
    title: "Luxury Crimson Velvet Lounge",
    category: "Cafe",
    image: "/assets/kanaf_cafe_interior.jpg",
    caption: "Finest cafe ambiance in Chakwal with plush velvet chairs and warm ambient glow."
  },
  {
    id: "gal-5",
    title: "The Dining Experience",
    category: "Cafe",
    image: "/assets/kanaf_hero_cinematic.jpg",
    caption: "Handcrafted food and bakery treats served in an editorial modern setting."
  },
  {
    id: "gal-6",
    title: "Artisan Bakery Counter",
    category: "Bakery",
    image: "/assets/kanaf_cafe_interior.jpg",
    caption: "Oven-fresh croissants, artisanal cakes, brownies and traditional sweets."
  },
  {
    id: "gal-7",
    title: "Behind The Espresso Bar",
    category: "Behind the Scenes",
    image: "/assets/kanaf_coffee_poster.jpg",
    caption: "Precision espresso pulling and silky microfoam texturing."
  },
  {
    id: "gal-8",
    title: "Fresh Baking Every Dawn",
    category: "Bakery",
    image: "/assets/kanaf_panini_poster.jpg",
    caption: "Artisanal breads and brioche buns prepared fresh daily."
  }
];

export const initialSettings: CafeSettings = {
  cafeName: "Kanaf Cafe & Bakery",
  tagline: "Taste Crafted With Care",
  phone: "0543-692020",
  internationalPhone: "+92543692020",
  address: "Main Talagang Road, Chakwal, Pakistan",
  googleLocation: "WRJJ+PQP, Talagang Hwy, Chakwal, Pakistan",
  aryWhatsApp: "0333 6554090",
  aryWhatsAppIntl: "+923336554090",
  openingHours: "11:00 AM - 12:00 AM Daily",
  deliveryMinOrder: 0,
  deliveryFee: 0,
};

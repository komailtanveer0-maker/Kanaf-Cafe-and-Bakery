import React from "react";
import { MenuItem } from "../types";
import { formatPrice } from "../utils/whatsapp";
import { Plus, Check, Sparkles } from "lucide-react";

interface FeaturedFavouritesProps {
  onAddToCart: (item: MenuItem) => void;
  featuredItems: MenuItem[];
}

export const FeaturedFavourites: React.FC<FeaturedFavouritesProps> = ({
  onAddToCart,
  featuredItems,
}) => {
  // Editorial showcase cards matching the uploaded graphics
  const showcaseCards = [
    {
      title: "Signature Panini",
      tagline: "Craving Panini?",
      subtitle: "The One & Only in Town",
      description:
        "Golden-grilled to crisp perfection, loaded with rich melted mozzarella, seasoned chicken breast and juicy garden tomatoes.",
      price: 690,
      image: "/assets/kanaf_panini_poster.jpg",
      id: "item-panini-1",
      category: "paninis",
      badge: "Signature Classic",
    },
    {
      title: "Golden Crispy Chicken",
      tagline: "Golden Crunch. Pure Flavour.",
      subtitle: "Drizzled to Perfection",
      description:
        "Extra crispy coating, fresh and juicy chicken inside, seasoned with gourmet herbs and crowned with our creamy signature pepper sauce.",
      price: 790,
      image: "/assets/kanaf_crispy_chicken.jpg",
      id: "item-chk-1",
      category: "chicken",
      badge: "Chef's Special",
    },
    {
      title: "Freshly Brewed Coffee",
      tagline: "Rich Aroma & Comfort",
      subtitle: "100% Specialty Arabica",
      description:
        "Velvety espresso pulled fresh, paired with silky steamed milk and delicate artisan latte art. An incomparable comforting indulgence.",
      price: 520,
      image: "/assets/kanaf_coffee_poster.jpg",
      id: "item-coffee-1",
      category: "hot-coffee",
      badge: "Barista Pick",
    },
  ];

  return (
    <section id="favourites-section" className="py-24 bg-[#FAF7F2] text-[#2D2522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5C0D20]/10 text-[#5C0D20] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kanaf Favourites</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#4A0817] tracking-tight">
            Loved By Chakwal
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#615A56] leading-relaxed">
            Our most celebrated handcrafted recipes — prepared fresh to order with pure dedication and authentic premium ingredients.
          </p>
        </div>

        {/* Large Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {showcaseCards.map((card) => {
            // Find matched item in db if exists
            const matchedItem = featuredItems.find((i) => i.id === card.id) || {
              id: card.id,
              name: card.title,
              category: card.category,
              description: card.description,
              price: card.price,
              available: true,
              featured: true,
              image: card.image,
            };

            return (
              <div
                key={card.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#5C0D20]/10 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#5C0D20]/25"
              >
                {/* Poster Showcase Container: preserving full aspect ratio and uncropped poster art */}
                <div className="relative bg-[#3B0612] overflow-hidden flex items-center justify-center p-3 sm:p-4">
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#4A0817]">
                    <img
                      src={card.image}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur-md text-[#5C0D20] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {card.badge}
                    </div>
                  </div>
                </div>

                {/* Card Editorial Info */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs uppercase font-bold tracking-wider text-[#8F1F39]">
                        {card.subtitle}
                      </span>
                      <span className="text-lg sm:text-xl font-bold font-serif text-[#4A0817]">
                        {formatPrice(matchedItem.price)}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2D2522] group-hover:text-[#5C0D20] transition-colors">
                      {card.title}
                    </h3>

                    <p className="mt-2.5 text-sm text-[#615A56] leading-relaxed line-clamp-3">
                      {card.description}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-6 pt-5 border-t border-[#FAF7F2] flex items-center justify-between gap-4">
                    <div className="text-xs text-[#8A817C] font-medium">
                      Available for Dine-in & Delivery
                    </div>

                    <button
                      onClick={() => onAddToCart(matchedItem)}
                      disabled={!matchedItem.available}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95 ${
                        matchedItem.available
                          ? "bg-[#5C0D20] text-[#FAF7F2] hover:bg-[#460816] hover:shadow-md"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

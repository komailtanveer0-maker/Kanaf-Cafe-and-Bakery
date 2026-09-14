import React, { useState, useMemo } from "react";
import { MenuItem, Category } from "../types";
import { formatPrice } from "../utils/whatsapp";
import {
  Search,
  Plus,
  Check,
  Flame,
  Coffee,
  Sparkles,
  UtensilsCrossed,
  Pizza,
  Sandwich,
  Drumstick,
  Beef,
  Cake,
  Croissant,
  CupSoda,
  Wine,
} from "lucide-react";

interface MenuSectionProps {
  categories: Category[];
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

// Icon mapping helper
const getCategoryIcon = (iconName?: string) => {
  switch (iconName) {
    case "Croissant":
      return <Croissant className="w-4 h-4" />;
    case "Sandwich":
      return <Sandwich className="w-4 h-4" />;
    case "Beef":
      return <Beef className="w-4 h-4" />;
    case "Drumstick":
      return <Drumstick className="w-4 h-4" />;
    case "UtensilsCrossed":
      return <UtensilsCrossed className="w-4 h-4" />;
    case "Flame":
      return <Flame className="w-4 h-4" />;
    case "Pizza":
      return <Pizza className="w-4 h-4" />;
    case "Coffee":
      return <Coffee className="w-4 h-4" />;
    case "CupSoda":
      return <CupSoda className="w-4 h-4" />;
    case "Sparkles":
      return <Sparkles className="w-4 h-4" />;
    case "Wine":
      return <Wine className="w-4 h-4" />;
    case "Cake":
      return <Cake className="w-4 h-4" />;
    default:
      return <UtensilsCrossed className="w-4 h-4" />;
  }
};

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  items,
  onAddToCart,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Filter items based on active category and search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemNotice(item.id);
    setTimeout(() => {
      setAddedItemNotice((prev) => (prev === item.id ? null : prev));
    }, 1200);
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <section id="menu" className="py-24 bg-[#FAF7F2] text-[#2D2522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8F1F39] mb-2 block">
            Crafted With Care
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#4A0817] tracking-tight">
            Our Complete Menu
          </h2>
          <p className="mt-3 text-base text-[#615A56]">
            Select from our fresh bakery, sizzling paninis, crispy chicken, handcrafted coffees, and indulgent desserts.
          </p>
        </div>

        {/* Search and Category Filter Controls */}
        <div className="mb-10 flex flex-col gap-6">
          {/* Search Box */}
          <div className="max-w-md mx-auto w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A817C]" />
            <input
              type="text"
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, coffees, bakery..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#5C0D20]/15 text-sm text-[#2D2522] placeholder-[#8A817C] focus:outline-none focus:ring-2 focus:ring-[#5C0D20]/20 focus:border-[#5C0D20] transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Horizontal Scrolling Category Pills */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max">
              <button
                onClick={() => onSelectCategory("all")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                  selectedCategory === "all"
                    ? "bg-[#5C0D20] text-white shadow-md scale-105"
                    : "bg-white text-[#4A4540] hover:bg-[#F5EFE6] border border-[#5C0D20]/10"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>All Items ({items.length})</span>
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = items.filter((i) => i.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all shadow-sm ${
                      isSelected
                        ? "bg-[#5C0D20] text-white shadow-md scale-105"
                        : "bg-white text-[#4A4540] hover:bg-[#F5EFE6] border border-[#5C0D20]/10"
                    }`}
                  >
                    {getCategoryIcon(cat.icon)}
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#FAF7F2] text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Description Banner if single category chosen */}
        {selectedCategory !== "all" && activeCategoryObj?.description && (
          <div className="mb-8 p-4 bg-[#F5EFE6] rounded-2xl border border-[#5C0D20]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#5C0D20] text-white">
                {getCategoryIcon(activeCategoryObj.icon)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#4A0817]">
                  {activeCategoryObj.name}
                </h3>
                <p className="text-xs text-[#615A56]">
                  {activeCategoryObj.description}
                </p>
              </div>
            </div>
            <span className="text-xs text-[#8F1F39] font-bold">
              {filteredItems.length} items
            </span>
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#5C0D20]/20 p-8">
            <UtensilsCrossed className="w-12 h-12 text-[#5C0D20]/40 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#4A0817]">
              No menu items found
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Try searching with another keyword or pick a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                onSelectCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#5C0D20] text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const isAdded = addedItemNotice === item.id;

              return (
                <div
                  key={item.id}
                  id={`menu-card-${item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#5C0D20]/10 shadow-sm hover:shadow-xl hover:border-[#5C0D20]/25 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Item Image */}
                  <div className="relative aspect-[4/3] bg-[#FAF7F2] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        !item.available ? "grayscale opacity-60" : ""
                      }`}
                    />

                    {/* Available / Sold Out Status Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      {item.featured && item.available && (
                        <span className="bg-[#FAF7F2] text-[#5C0D20] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border border-[#5C0D20]/15">
                          Featured
                        </span>
                      )}
                      {!item.available && (
                        <span className="bg-[#73132B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="font-serif font-bold text-base sm:text-lg text-[#2D2522] group-hover:text-[#5C0D20] transition-colors leading-snug">
                          {item.name}
                        </h4>
                      </div>

                      <p className="text-xs text-[#615A56] leading-relaxed line-clamp-2 mb-4">
                        {item.description || "Prepared fresh with signature ingredients."}
                      </p>
                    </div>

                    {/* Price and Add Button */}
                    <div className="pt-3 border-t border-[#FAF7F2] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#8A817C] block font-medium">
                          Price
                        </span>
                        <span className="text-base sm:text-lg font-bold font-serif text-[#4A0817]">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAdd(item)}
                        disabled={!item.available}
                        aria-label={`Add ${item.name} to order`}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 ${
                          !item.available
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : isAdded
                            ? "bg-emerald-700 text-white"
                            : "bg-[#5C0D20] text-white hover:bg-[#460816] hover:shadow-md"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : !item.available ? (
                          <span>Unavailable</span>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

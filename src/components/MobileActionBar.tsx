import React from "react";
import { Utensils, Phone, ShoppingBag } from "lucide-react";

interface MobileActionBarProps {
  cartCount: number;
  onOpenCart: () => void;
  onViewMenu: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  cartCount,
  onOpenCart,
  onViewMenu,
}) => {
  return (
    <aside
      aria-label="Quick action bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#5C0D20]/15 py-2 px-4 shadow-[0_-8px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* 1. MENU */}
        <button
          onClick={onViewMenu}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#4A0817] hover:bg-[#5C0D20]/5 active:scale-95 transition-all"
        >
          <Utensils className="w-4 h-4 text-[#5C0D20] mb-1" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Menu
          </span>
        </button>

        {/* 2. CALL */}
        <a
          href="tel:0543692020"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[#4A0817] hover:bg-[#5C0D20]/5 active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 text-[#5C0D20] mb-1" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Call
          </span>
        </a>

        {/* 3. ORDER / CART */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#5C0D20] text-white shadow-md active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-1" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#5C0D20]">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {cartCount > 0 ? `Order (${cartCount})` : "Order"}
          </span>
        </button>
      </div>
    </aside>
  );
};

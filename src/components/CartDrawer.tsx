import React from "react";
import { CartItem } from "../types";
import { formatPrice } from "../utils/whatsapp";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateNotes: (itemId: string, notes: string) => void;
  onCheckout: () => void;
  onViewMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  onCheckout,
  onViewMenu,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const totalItemsCount = items.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#5C0D20]/15"
        >
          {/* Header */}
          <div className="bg-[#4A0817] text-[#FAF7F2] px-6 py-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D7E7F2]" />
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  Your Order
                </h3>
                <span className="text-[11px] text-[#D7E7F2] tracking-wide">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#5C0D20]/10 flex items-center justify-center text-[#5C0D20] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-[#4A0817]">
                  Your cart is empty
                </h4>
                <p className="text-xs text-[#615A56] mt-1 max-w-xs">
                  Treat yourself to our signature grilled paninis, freshly brewed coffees, or artisan bakery treats.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onViewMenu();
                  }}
                  className="mt-6 px-6 py-3 rounded-full bg-[#5C0D20] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#460816] transition-all shadow-md"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((cartItem) => {
                const { item, quantity, specialNotes } = cartItem;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-[#5C0D20]/10 shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-[#2D2522] truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs font-bold text-[#8F1F39] block mt-0.5">
                          {formatPrice(item.price)} each
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Selector & Item Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 bg-[#FAF7F2] rounded-full p-1 border border-gray-200">
                        <button
                          onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-[#5C0D20] hover:text-white transition-colors shadow-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2 text-[#2D2522]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-[#5C0D20] hover:text-white transition-colors shadow-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif font-bold text-sm text-[#4A0817]">
                        {formatPrice(item.price * quantity)}
                      </span>
                    </div>

                    {/* Optional Item Notes */}
                    <input
                      type="text"
                      placeholder="Note for kitchen (e.g. less spice)..."
                      value={specialNotes || ""}
                      onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                      className="text-[11px] px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-gray-200 text-gray-700 focus:outline-none focus:border-[#5C0D20]"
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Summary / Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#5C0D20]/15 shadow-lg space-y-4">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery in Chakwal</span>
                  <span className="font-semibold text-emerald-700">
                    {subtotal >= 1000 ? "FREE" : "Rs. 100"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#4A0817] pt-2 border-t">
                  <span>Estimated Total</span>
                  <span>{formatPrice(subtotal + (subtotal >= 1000 ? 0 : 100))}</span>
                </div>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#5C0D20] hover:bg-[#460816] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

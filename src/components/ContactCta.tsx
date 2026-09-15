import React from "react";
import { MessageCircle, Phone, Utensils, MapPin, Sparkles } from "lucide-react";
import { ARY_SERVICES_PHONE_INTL } from "../utils/whatsapp";
import { CafeSettings } from "../types";

interface ContactCtaProps {
  onViewMenu: () => void;
  settings?: CafeSettings;
}

export const ContactCta: React.FC<ContactCtaProps> = ({ onViewMenu, settings }) => {
  const targetWhatsApp = settings?.aryWhatsAppIntl?.replace(/[^0-9]/g, "") || ARY_SERVICES_PHONE_INTL;
  const displayPhone = settings?.phone || "0543-692020";
  const displayPhoneTel = settings?.internationalPhone || "+92543692020";
  const displayAddress = settings?.address || "Main Talagang Road, Chakwal";

  const directWhatsAppUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(
    "Hello Kanaf Cafe & Bakery! I would like to place an order or inquire about your menu."
  )}`;

  return (
    <section className="py-24 bg-[#3B0612] text-[#FAF7F2] relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5C0D20] rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8F1F39] rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-[#D7E7F2] text-xs font-bold uppercase tracking-[0.25em] mb-6 border border-white/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Taste Crafted With Care</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white mb-6 leading-tight">
          READY FOR SOMETHING <br className="hidden sm:inline" />
          <span className="italic text-[#D7E7F2]">DELICIOUS?</span>
        </h2>

        <p className="text-base sm:text-lg text-[#F5EFE6]/85 max-w-xl mx-auto leading-relaxed mb-10">
          Experience Chakwal’s signature paninis, golden crispy chicken, and artisan bakery delights today.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <button
            onClick={onViewMenu}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF7F2] text-[#3B0612] font-bold text-xs uppercase tracking-wider hover:bg-white hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Utensils className="w-4 h-4 text-[#3B0612]" />
            <span>VIEW MENU</span>
          </button>

          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>ORDER ON WHATSAPP</span>
          </a>
        </div>

        {/* Info badges */}
        <div className="pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#FAF7F2]/80 font-medium">
          <a
            href={`tel:${displayPhoneTel.replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4 text-[#D7E7F2]" />
            <span>Phone: {displayPhone}</span>
          </a>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D7E7F2]" />
            <span>{displayAddress}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

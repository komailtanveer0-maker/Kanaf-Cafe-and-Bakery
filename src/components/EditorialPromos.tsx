import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface EditorialPromosProps {
  onSelectCategory: (categoryId: string) => void;
}

export const EditorialPromos: React.FC<EditorialPromosProps> = ({
  onSelectCategory,
}) => {
  return (
    <section className="py-20 bg-[#F4EDE2]/70 text-[#2D2522] border-y border-[#5C0D20]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner 1: Craving Panini */}
        <div className="relative rounded-3xl bg-[#4A0817] text-[#FAF7F2] p-8 sm:p-12 lg:p-16 mb-12 overflow-hidden shadow-xl">
          {/* Subtle background decorative shapes */}
          <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#5C0D20] blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-[#8F1F39] blur-2xl opacity-30 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D7E7F2] text-xs font-bold uppercase tracking-[0.2em] mb-5 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#D7E7F2]" />
                <span>The Town’s Best Toast</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#FAF7F2] leading-none mb-4">
                CRAVING <br />
                <span className="italic font-normal font-serif text-[#D7E7F2]">PANINI?</span>
              </h2>

              <p className="text-base sm:text-lg text-[#F5EFE6]/90 max-w-xl font-normal leading-relaxed mb-8">
                The one and only panini in town. Sliced artisan focaccia, herb-marinated chicken, double layers of stretchy melted cheese, and our house secret sauce pressed to golden crisp perfection.
              </p>

              <button
                onClick={() => onSelectCategory("paninis")}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#FAF7F2] text-[#4A0817] font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-white hover:shadow-xl hover:translate-x-1"
              >
                <span>Explore Paninis & Sandwiches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-xs sm:max-w-sm rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FAF7F2]/20 group">
                <img
                  src="/assets/kanaf_panini_poster.jpg"
                  alt="Kanaf Panini Poster"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dual Split Promos: Coffee & Crispy Chicken */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Promo A: Freshly Made Coffee */}
          <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#5C0D20]/10 shadow-md flex flex-col justify-between group hover:border-[#5C0D20]/30 transition-all">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-1/2 aspect-[3/4] rounded-2xl overflow-hidden bg-[#3B0612] shadow-md flex-shrink-0">
                <img
                  src="/assets/kanaf_coffee_poster.jpg"
                  alt="Kanaf Fresh Coffee"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8F1F39] mb-2">
                  100% Arabica Roast
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A0817] mb-3 leading-snug">
                  Freshly Made <br />
                  <span className="italic font-normal">Coffee</span>
                </h3>
                <p className="text-sm text-[#615A56] leading-relaxed mb-6">
                  From robust double-shot espresso to velvety iced caramel lattes. Roasted to bring out subtle cocoa and toasted nut notes.
                </p>
                <button
                  onClick={() => onSelectCategory("hot-coffee")}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C0D20] hover:text-[#8F1F39] transition-colors"
                >
                  <span>View Coffee Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Promo B: Golden Crunch */}
          <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#5C0D20]/10 shadow-md flex flex-col justify-between group hover:border-[#5C0D20]/30 transition-all">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-1/2 aspect-[3/4] rounded-2xl overflow-hidden bg-[#3B0612] shadow-md flex-shrink-0">
                <img
                  src="/assets/kanaf_crispy_chicken.jpg"
                  alt="Kanaf Crispy Chicken"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8F1F39] mb-2">
                  Specialty Recipe
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A0817] mb-3 leading-snug">
                  Golden Crunch. <br />
                  <span className="italic font-normal">Pure Flavour.</span>
                </h3>
                <p className="text-sm text-[#615A56] leading-relaxed mb-6">
                  Extra crispy coating, succulent juicy chicken, perfectly seasoned and drenched in chef’s creamy signature white sauce.
                </p>
                <button
                  onClick={() => onSelectCategory("chicken")}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C0D20] hover:text-[#8F1F39] transition-colors"
                >
                  <span>Taste Crispy Chicken</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

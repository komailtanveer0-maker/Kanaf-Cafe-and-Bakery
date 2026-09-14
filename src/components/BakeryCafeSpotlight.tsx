import React from "react";
import { Sparkles, Croissant, Coffee, Users, Clock, Flame } from "lucide-react";

interface BakeryCafeSpotlightProps {
  onSelectCategory: (catId: string) => void;
}

export const BakeryCafeSpotlight: React.FC<BakeryCafeSpotlightProps> = ({
  onSelectCategory,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. BAKERY SECTION */}
      <section id="bakery-section" className="py-24 bg-[#F5EFE6] text-[#2D2522]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5C0D20]/10 text-[#5C0D20] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                <Croissant className="w-3.5 h-3.5" />
                <span>Oven-Fresh Daily</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#4A0817] tracking-tight mb-4">
                Artisan Bakery & Sweets
              </h2>
              <p className="text-base text-[#615A56] leading-relaxed mb-6">
                From golden flaky croissants and rich chocolate fudge brownies to customized celebration cakes and artisan pastries, our bakery items are mixed, proved, and baked fresh every dawn right here in Chakwal.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white rounded-2xl border border-[#5C0D20]/10">
                  <span className="font-serif font-bold text-lg text-[#4A0817] block mb-0.5">
                    Celebration Cakes
                  </span>
                  <p className="text-xs text-[#615A56]">
                    Birthday, anniversary & custom tiered cakes made to order.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#5C0D20]/10">
                  <span className="font-serif font-bold text-lg text-[#4A0817] block mb-0.5">
                    Morning Viennoiserie
                  </span>
                  <p className="text-xs text-[#615A56]">
                    Butter croissants, pain au chocolat, and Danish pastries.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectCategory("bakery")}
                className="px-6 py-3.5 rounded-full bg-[#5C0D20] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#460816] transition-all shadow-md active:scale-95"
              >
                Browse Bakery & Cakes
              </button>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-[#3B0612]">
                <img
                  src="/assets/kanaf_cafe_interior.jpg"
                  alt="Kanaf Bakery Showcase"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#D7E7F2] block mb-1">
                    Daily Freshness
                  </span>
                  <h3 className="font-serif font-bold text-xl">
                    Baked with French butter and pure cocoa
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAFE EXPERIENCE SECTION */}
      <section id="cafe-section" className="py-24 bg-[#3B0612] text-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FAF7F2]/10 aspect-[4/3] bg-[#2D040E]">
                <img
                  src="/assets/kanaf_hero_cinematic.jpg"
                  alt="Kanaf Cafe Ambiance"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#D7E7F2] block mb-1">
                    The Ambiance
                  </span>
                  <h3 className="font-serif font-bold text-xl">
                    Plush Crimson Lounges & Warm Ambient Lighting
                  </h3>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D7E7F2] text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-white/10">
                <Coffee className="w-3.5 h-3.5" />
                <span>The Cafe Lifestyle</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#FAF7F2] tracking-tight mb-4">
                Chakwal’s Premium Coffee & Lounge
              </h2>
              <p className="text-base text-[#F5EFE6]/85 leading-relaxed mb-6">
                Step into a serene retreat designed for memorable conversations, quiet work sessions, and lively family gatherings. Enjoy artisanal specialty coffees, mocktails, and fresh teas served with warm hospitality.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/10 text-[#D7E7F2]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white">
                      Family & Executive Dining
                    </h4>
                    <p className="text-xs text-[#FAF7F2]/75 mt-0.5">
                      Spacious seating zones designed for families, couples, and casual meetings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/10 text-[#D7E7F2]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white">
                      Open 11:00 AM – 12:00 Midnight
                    </h4>
                    <p className="text-xs text-[#FAF7F2]/75 mt-0.5">
                      From midday lunch dates to late-night coffee cravings, we’re ready to welcome you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onSelectCategory("hot-coffee")}
                  className="px-6 py-3.5 rounded-full bg-[#FAF7F2] text-[#3B0612] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-md active:scale-95"
                >
                  Explore Specialty Coffees
                </button>
                <a
                  href="tel:0543692020"
                  className="px-6 py-3.5 rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                >
                  Reserve a Table: 0543-692020
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

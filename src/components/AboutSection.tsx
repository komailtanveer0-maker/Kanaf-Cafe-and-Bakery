import React from "react";
import { Sparkles, Heart, Coffee, Utensils, ShieldCheck } from "lucide-react";

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: <Utensils className="w-6 h-6 text-[#8F1F39]" />,
      title: "Handcrafted Recipes",
      desc: "Every panini, crispy cutlet, and sauce is prepared fresh to order using select premium ingredients.",
    },
    {
      icon: <Coffee className="w-6 h-6 text-[#8F1F39]" />,
      title: "Artisan Coffee",
      desc: "Freshly ground Arabica coffee pulled with precision to deliver authentic velvety espresso and silky microfoam.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#8F1F39]" />,
      title: "Oven-Fresh Bakery",
      desc: "Golden croissants, specialty cakes, cookies, and traditional dessert classics baked daily.",
    },
    {
      icon: <Heart className="w-6 h-6 text-[#8F1F39]" />,
      title: "Chakwal's Gathering Spot",
      desc: "A warm, family-friendly crimson lounge on Main Talagang Road built for comforting conversations.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#FAF7F2] text-[#2D2522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase (2 layered photos) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-[#3B0612]">
              <img
                src="/assets/kanaf_cafe_interior.jpg"
                alt="Kanaf Cafe & Bakery Ambiance in Chakwal"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping Card */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 w-3/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[4/3]">
              <img
                src="/assets/kanaf_hero_cinematic.jpg"
                alt="Kanaf Fresh Dishes"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quality seal badge */}
            <div className="absolute -top-4 -left-4 bg-[#5C0D20] text-white p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#D7E7F2]" />
              <div>
                <span className="text-xs uppercase font-bold tracking-widest block text-[#D7E7F2]">
                  Excellence
                </span>
                <span className="text-sm font-serif font-bold">
                  Chakwal's Pride
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5C0D20]/10 text-[#5C0D20] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>More Than a Café</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#4A0817] tracking-tight leading-tight">
              A Gathering Place Built on Warmth & Taste
            </h2>

            <p className="mt-5 text-base text-[#615A56] leading-relaxed">
              Nestled along Main Talagang Road, <strong className="text-[#4A0817] font-semibold">Kanaf Cafe & Bakery</strong> was born from a simple belief: that Chakwal deserves a world-class cafe experience where rich aromas, artisanal baking, and genuine hospitality unite.
            </p>

            <p className="mt-3 text-base text-[#615A56] leading-relaxed">
              Whether you are meeting friends over our town-famous grilled paninis, dropping in for a morning double-shot cappuccino, or celebrating family milestones with custom artisan cakes, Kanaf is your sanctuary of comforting flavors.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 pt-8 border-t border-[#5C0D20]/10">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-[#5C0D20]/10 flex items-center justify-center mb-3">
                    {pillar.icon}
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#4A0817] mb-1">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[#615A56] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

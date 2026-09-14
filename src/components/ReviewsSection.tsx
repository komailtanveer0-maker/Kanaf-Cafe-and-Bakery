import React from "react";
import { Star, Quote, CheckCircle } from "lucide-react";

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: "Waleed Haider",
      rating: 5,
      relativeTime: "Google Verified Review",
      comment:
        "Their paninis and pizza are a must-try. Everything is prepared fresh, tastes great, and the atmosphere makes it even better. Highly recommended!",
      dishBadge: "Paninis & Pizza",
    },
    {
      name: "Hassan Raza",
      rating: 5,
      relativeTime: "Google Verified Review",
      comment:
        "A great spot for coffee and food. The food quality is top-notch, and the environment is pleasant and comfortable.",
      dishBadge: "Coffee & Food Quality",
    },
    {
      name: "Rafaqat Ali",
      rating: 5,
      relativeTime: "Google Verified Review",
      comment:
        "The taste of the food is incredible, especially the coffee and crispy chicken. The staff is polite, and the place has a warm vibe. Highly recommended!",
      dishBadge: "Crispy Chicken & Coffee",
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-[#FAF7F2] text-[#2D2522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Google Rating Badge */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C0D20]/10 text-[#5C0D20] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Star className="w-3.5 h-3.5 fill-[#5C0D20]" />
            <span>Loved In Chakwal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#4A0817] tracking-tight mb-4">
            What Our Guests Say
          </h2>

          {/* Google 4.8 / 5 Rating Badge */}
          <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-[#5C0D20]/15 shadow-sm mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-amber-500 fill-amber-500"
                />
              ))}
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-sm font-bold text-[#4A0817]">
              4.8 / 5.0
            </span>
            <span className="text-xs text-gray-500">
              (73 Google Reviews)
            </span>
          </div>
        </div>

        {/* 3 Real Customer Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-[#5C0D20]/10 shadow-sm hover:shadow-xl hover:border-[#5C0D20]/25 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#5C0D20]/20" />
                </div>

                {/* Review Text */}
                <p className="text-sm text-[#4A4540] italic leading-relaxed mb-6 font-serif">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#2D2522]">
                    {rev.name}
                  </h4>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {rev.relativeTime}
                  </span>
                </div>

                <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#8F1F39] border border-[#5C0D20]/10">
                  {rev.dishBadge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

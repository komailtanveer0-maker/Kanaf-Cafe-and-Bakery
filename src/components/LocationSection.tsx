import React from "react";
import { MapPin, Phone, Clock, Navigation, ExternalLink } from "lucide-react";
import { CafeSettings } from "../types";

interface LocationSectionProps {
  settings?: CafeSettings;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const displayAddress = settings?.address || "Main Talagang Road, Chakwal, Pakistan";
  const displayPhone = settings?.phone || "0543-692020";
  const displayPhoneTel = settings?.internationalPhone || "+92543692020";
  const displayHours = settings?.openingHours || "11:00 AM – 12:00 Midnight";

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=WRJJ%2BPQP%2C+Talagang+Hwy%2C+Chakwal%2C+Pakistan";

  return (
    <section id="contact" className="py-24 bg-[#FAF7F2] text-[#2D2522] border-t border-[#5C0D20]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Contact & Location Details */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5C0D20]/10 text-[#5C0D20] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span>Find Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#4A0817] tracking-tight mb-4">
              Visit Kanaf
            </h2>

            <p className="text-base text-[#615A56] leading-relaxed mb-8">
              Centrally located on {displayAddress}. Stop by for dining, takeaway, or call ahead to have your favorite food ready for pickup.
            </p>

            <div className="space-y-6">
              {/* Address card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#5C0D20]/10 shadow-xs">
                <div className="p-3 rounded-xl bg-[#5C0D20]/10 text-[#5C0D20] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8F1F39] block">
                    Address
                  </span>
                  <p className="text-sm font-semibold text-[#2D2522] mt-0.5">
                    {displayAddress}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Plus Code: WRJJ+PQP, Talagang Hwy
                  </p>
                </div>
              </div>

              {/* Phone card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#5C0D20]/10 shadow-xs">
                <div className="p-3 rounded-xl bg-[#5C0D20]/10 text-[#5C0D20] flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8F1F39] block">
                    Direct Cafe Phone
                  </span>
                  <a
                    href={`tel:${displayPhoneTel.replace(/[^0-9+]/g, "")}`}
                    className="text-base font-bold text-[#4A0817] hover:text-[#8F1F39] transition-colors mt-0.5 inline-block"
                  >
                    {displayPhone}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Call for reservations, takeaway & catering inquiries
                  </p>
                </div>
              </div>

              {/* Opening Hours card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#5C0D20]/10 shadow-xs">
                <div className="p-3 rounded-xl bg-[#5C0D20]/10 text-[#5C0D20] flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8F1F39] block">
                    Opening Hours
                  </span>
                  <p className="text-sm font-semibold text-[#2D2522] mt-0.5">
                    {displayHours}
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    Open 7 Days a Week
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Google Maps Action Button */}
            <div className="mt-8">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#5C0D20] hover:bg-[#460816] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>GET DIRECTIONS</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map Embed & Visual Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white aspect-[16/10] min-h-[360px]">
              <iframe
                title="Kanaf Cafe & Bakery Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13410.88767931326!2d72.8400!3d32.9328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f868285555555%3A0x8201292020!2sKanaf%20Cafe%20%26%20Bakery!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Float Map Location Banner */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#5C0D20]/15 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#4A0817]">
                    Kanaf Cafe & Bakery
                  </h4>
                  <p className="text-xs text-gray-600">
                    Main Talagang Road, Chakwal
                  </p>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-[#5C0D20] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#460816] transition-colors flex items-center gap-1"
                >
                  <span>Open Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

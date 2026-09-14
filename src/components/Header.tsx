import React, { useState, useEffect } from "react";
import { KanafLogo } from "./KanafLogo";
import { ShoppingBag, Menu as MenuIcon, X, Phone, Clock, Lock } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenStaff?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
  activeSection,
  onOpenStaff,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Menu", id: "menu" },
    { label: "Bakery", id: "bakery-section" },
    { label: "Cafe", id: "cafe-section" },
    { label: "About", id: "about" },
    { label: "Gallery", id: "gallery" },
    { label: "Contact", id: "contact" },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#5C0D20]/10"
          : "bg-gradient-to-b from-black/60 via-black/30 to-transparent py-4 text-white"
      }`}
    >
      {/* Top micro-announcement banner on non-scrolled state */}
      {!isScrolled && (
        <div className="hidden lg:flex justify-between items-center max-w-7xl mx-auto px-6 text-xs pb-2 border-b border-white/15 text-[#E1EDF5]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D7E7F2]" />
              Open Daily: 11:00 AM – 12:00 AM
            </span>
            <span>•</span>
            <span>Main Talagang Road, Chakwal</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:0543692020"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D7E7F2]" />
              0543-692020
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("hero")}
            className="text-left focus:outline-none"
            aria-label="Kanaf Cafe & Bakery Home"
          >
            <KanafLogo
              variant={isScrolled ? "maroon" : "light"}
              size="md"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-sm tracking-wide font-medium transition-colors relative py-1 focus:outline-none ${
                    isScrolled
                      ? isActive
                        ? "text-[#5C0D20] font-semibold"
                        : "text-[#4A4540] hover:text-[#5C0D20]"
                      : isActive
                      ? "text-white font-semibold"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isScrolled ? "bg-[#5C0D20]" : "bg-[#D7E7F2]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Phone quick call (desktop) */}
            <a
              href="tel:0543692020"
              className={`hidden sm:flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                isScrolled
                  ? "border-[#5C0D20]/20 text-[#5C0D20] hover:bg-[#5C0D20]/5"
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
              title="Call Kanaf Cafe: 0543-692020"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>0543-692020</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className={`relative p-2.5 rounded-full transition-all focus:outline-none ${
                isScrolled
                  ? "bg-[#F5EFE6] text-[#5C0D20] hover:bg-[#EBDDCB]"
                  : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm"
              }`}
              aria-label={`View Cart, ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#5C0D20] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* "Order Now" Highlighted Button */}
            <button
              id="header-order-now-btn"
              onClick={() => handleNavClick("menu")}
              className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                isScrolled
                  ? "bg-[#5C0D20] text-[#FAF7F2] hover:bg-[#460816] hover:shadow-lg"
                  : "bg-[#FAF7F2] text-[#5C0D20] hover:bg-white hover:shadow-lg"
              }`}
            >
              Order Now
            </button>

            {/* Staff Option in Top Right Corner */}
            {onOpenStaff && (
              <button
                id="header-staff-btn"
                onClick={onOpenStaff}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all border ${
                  isScrolled
                    ? "border-[#5C0D20]/25 text-[#5C0D20] hover:bg-[#5C0D20]/10 hover:border-[#5C0D20]/40"
                    : "border-white/35 text-white hover:bg-white/15 hover:border-white/60 backdrop-blur-xs"
                }`}
                title="Staff Portal (Restricted Access)"
                aria-label="Staff Access"
              >
                <Lock className="w-3.5 h-3.5 opacity-90" />
                <span className="hidden xs:inline sm:inline">Staff</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors focus:outline-none ${
                isScrolled
                  ? "text-[#4A0817] hover:bg-[#F5EFE6]"
                  : "text-white hover:bg-white/15"
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#FAF7F2] border-b border-[#5C0D20]/15 shadow-2xl px-6 pt-4 pb-6 mt-3 animate-in slide-in-from-top duration-200 text-[#2D2522]"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2.5 px-3 rounded-lg text-base font-medium transition-colors ${
                  activeSection === link.id
                    ? "bg-[#5C0D20]/10 text-[#5C0D20] font-bold"
                    : "text-[#4A4540] hover:bg-[#F5EFE6] hover:text-[#5C0D20]"
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-[#5C0D20]/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#5C0D20] text-white font-bold text-sm uppercase tracking-wider shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Online ({cartCount} items)</span>
              </button>

              <a
                href="tel:0543692020"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#5C0D20]/30 text-[#5C0D20] font-semibold text-sm hover:bg-[#5C0D20]/5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Kanaf: 0543-692020</span>
              </a>

              {onOpenStaff && (
                <button
                  id="mobile-nav-staff-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenStaff();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#5C0D20]/10 text-[#5C0D20] font-semibold text-sm hover:bg-[#5C0D20]/15 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Staff Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

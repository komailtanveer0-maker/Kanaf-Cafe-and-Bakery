import React, { useState, useEffect } from "react";
import { MenuItem, Category, CartItem, GalleryItem, CafeSettings } from "./types";
import { Header } from "./components/Header";
import { HeroVideo } from "./components/HeroVideo";
import { FeaturedFavourites } from "./components/FeaturedFavourites";
import { EditorialPromos } from "./components/EditorialPromos";
import { MenuSection } from "./components/MenuSection";
import { BakeryCafeSpotlight } from "./components/BakeryCafeSpotlight";
import { AboutSection } from "./components/AboutSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { GallerySection } from "./components/GallerySection";
import { LocationSection } from "./components/LocationSection";
import { ContactCta } from "./components/ContactCta";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { MobileActionBar } from "./components/MobileActionBar";
import { StaffModal } from "./components/StaffModal";
import { StaffDashboard } from "./components/StaffDashboard";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export function App() {
  // Application Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<CafeSettings>({
    cafeName: "Kanaf Cafe & Bakery",
    tagline: "Taste Crafted With Care",
    phone: "0543-692020",
    internationalPhone: "+92543692020",
    address: "Main Talagang Road, Chakwal, Pakistan",
    googleLocation: "WRJJ+PQP, Talagang Hwy, Chakwal, Pakistan",
    aryWhatsApp: "0333 6554090",
    aryWhatsAppIntl: "+923336554090",
    openingHours: "11:00 AM - 12:00 AM Daily",
    deliveryMinOrder: 500,
    deliveryFee: 100,
  });

  // Cart State (stored in localStorage for persistence)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("kanaf_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Flow States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Staff Mode States
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isStaffDashboardOpen, setIsStaffDashboardOpen] = useState(false);
  const [staffToken, setStaffToken] = useState<string | null>(() => {
    return sessionStorage.getItem("kanaf_staff_token");
  });

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kanaf_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart:", e);
    }
  }, [cart]);

  // Load Data from API
  const loadData = async () => {
    try {
      const [menuRes, galleryRes, settingsRes] = await Promise.all([
        fetch("/api/menu"),
        fetch("/api/gallery"),
        fetch("/api/settings"),
      ]);

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setCategories(menuData.categories || []);
        setMenuItems(menuData.items || []);
      }

      if (galleryRes.ok) {
        const galleryData = await galleryRes.json();
        setGalleryItems(galleryData || []);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings((prev) => ({ ...prev, ...settingsData }));
      }
    } catch (err) {
      console.error("Failed to fetch store data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Verify staff session on mount if token exists
  useEffect(() => {
    if (staffToken) {
      fetch("/api/staff/verify", {
        headers: { Authorization: `Bearer ${staffToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.valid) {
            setStaffToken(null);
            sessionStorage.removeItem("kanaf_staff_token");
          }
        })
        .catch(() => {
          setStaffToken(null);
        });
    }
  }, [staffToken]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Cart Handlers
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    showToast(`Added "${item.name}" to your order`);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: newQty } : ci))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleUpdateNotes = (itemId: string, notes: string) => {
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, specialNotes: notes } : ci))
    );
  };

  const handleOrderSuccess = () => {
    setIsCheckoutOpen(false);
    setCart([]);
    showToast("Order prepared! Opening WhatsApp with ARY Services...");
  };

  // Navigation Scroll Helper
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    scrollToSection("menu");
  };

  // Staff Login Handlers
  const handleStaffLoginSuccess = (token: string) => {
    setStaffToken(token);
    sessionStorage.setItem("kanaf_staff_token", token);
    setIsStaffModalOpen(false);
    setIsStaffDashboardOpen(true);
    showToast("Staff Mode Unlocked");
  };

  const handleStaffLogout = () => {
    if (staffToken) {
      fetch("/api/staff/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${staffToken}` },
      }).catch(() => {});
    }
    setStaffToken(null);
    sessionStorage.removeItem("kanaf_staff_token");
    setIsStaffDashboardOpen(false);
    showToast("Logged out of Staff Mode");
  };

  const cartTotalCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2522]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#4A0817] text-[#FAF7F2] px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#D7E7F2] flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Sticky Header with Staff Access in Top Right Corner */}
      <Header
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={scrollToSection}
        activeSection={activeSection}
        onOpenStaff={() => {
          if (staffToken) {
            setIsStaffDashboardOpen(true);
          } else {
            setIsStaffModalOpen(true);
          }
        }}
      />

      {/* 1. Cinematic Hero Video Section */}
      <HeroVideo
        onViewMenu={() => scrollToSection("menu")}
        onOrderNow={() => scrollToSection("menu")}
      />

      {/* 2. Featured Favourites (Panini, Crispy Chicken, Fresh Coffee) */}
      <FeaturedFavourites
        onAddToCart={handleAddToCart}
        featuredItems={menuItems.filter((i) => i.featured)}
      />

      {/* 3. Editorial Promotional Banners */}
      <EditorialPromos onSelectCategory={handleSelectCategory} />

      {/* 4. Complete Menu with Categories and Search */}
      <MenuSection
        categories={categories}
        items={menuItems}
        onAddToCart={handleAddToCart}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 5. Dedicated Bakery & Cafe Ambiance Showcases */}
      <BakeryCafeSpotlight onSelectCategory={handleSelectCategory} />

      {/* 6. About Brand Story */}
      <AboutSection />

      {/* 7. Genuine Google Customer Reviews (4.8/5) */}
      <ReviewsSection />

      {/* 8. Instagram-Style Visual Diary Gallery with Lightbox */}
      <GallerySection galleryItems={galleryItems} />

      {/* 9. Location, Opening Hours & Google Map */}
      <LocationSection />

      {/* 10. Call To Action Banner */}
      <ContactCta onViewMenu={() => scrollToSection("menu")} />

      {/* 11. Footer with Discreet Staff Access */}
      <Footer
        onNavigate={scrollToSection}
        onOpenStaffModal={() => {
          if (staffToken) {
            setIsStaffDashboardOpen(true);
          } else {
            setIsStaffModalOpen(true);
          }
        }}
      />

      {/* Mobile Sticky Action Bar */}
      <MobileActionBar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onViewMenu={() => scrollToSection("menu")}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onUpdateNotes={handleUpdateNotes}
        onCheckout={() => setIsCheckoutOpen(true)}
        onViewMenu={() => scrollToSection("menu")}
      />

      {/* Checkout Modal & WhatsApp Sender */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Staff PIN Authorization Modal */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onLoginSuccess={handleStaffLoginSuccess}
      />

      {/* Full-screen Staff Management Dashboard */}
      {isStaffDashboardOpen && staffToken && (
        <StaffDashboard
          token={staffToken}
          categories={categories}
          items={menuItems}
          gallery={galleryItems}
          settings={settings}
          onClose={() => setIsStaffDashboardOpen(false)}
          onRefreshMenu={loadData}
          onLogout={handleStaffLogout}
        />
      )}
    </div>
  );
}

export default App;

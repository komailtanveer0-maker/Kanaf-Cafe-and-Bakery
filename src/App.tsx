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
import { initialCategories, initialMenuItems, initialGallery, initialSettings } from "./data/fallbackData";
import { dataStore } from "./utils/dataStore";

export function App() {
  // Application Data States (pre-seeded so Vercel static deploys have all menu items immediately)
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGallery);
  const [settings, setSettings] = useState<CafeSettings>(initialSettings);

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

  // Load Data from dataStore (local + remote sync)
  const loadData = async () => {
    try {
      const [menuData, galleryData, settingsData] = await Promise.all([
        dataStore.getMenuData(),
        dataStore.getGallery(),
        dataStore.getSettings(),
      ]);

      if (menuData.categories?.length) setCategories(menuData.categories);
      if (menuData.items?.length) setMenuItems(menuData.items);
      if (galleryData?.length) setGalleryItems(galleryData);
      if (settingsData) setSettings(settingsData);
    } catch (err) {
      console.warn("Using local store data:", err);
    }
  };

  useEffect(() => {
    loadData();

    // 1. Instant event listener for in-page updates (menu price changes, new recipes, new numbers)
    const handleDataChanged = () => {
      loadData();
    };
    window.addEventListener("kanaf_data_changed", handleDataChanged);

    // 2. Storage event for cross-tab updates in the same browser
    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("kanaf_")) {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. BroadcastChannel for instant zero-latency cross-tab communication
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel("kanaf_data_sync_channel");
        bc.onmessage = () => {
          loadData();
        };
      } catch (e) {}
    }

    // 4. Polling timer every 8 seconds to guarantee fresh data when live on any platform
    const interval = setInterval(() => {
      loadData();
    }, 8000);

    // 5. Re-check when window regains visibility / tab is brought back to front
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("kanaf_data_changed", handleDataChanged);
      window.removeEventListener("storage", handleStorage);
      if (bc) bc.close();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Verify staff session on mount if token exists
  useEffect(() => {
    if (staffToken) {
      dataStore
        .verifyStaffToken(staffToken)
        .then((valid) => {
          if (!valid) {
            setStaffToken(null);
            sessionStorage.removeItem("kanaf_staff_token");
          }
        })
        .catch(() => {
          // Keep session active on client
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
    dataStore.logoutStaff(staffToken);
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
        settings={settings}
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
      <LocationSection settings={settings} />

      {/* 10. Call To Action Banner */}
      <ContactCta onViewMenu={() => scrollToSection("menu")} settings={settings} />

      {/* 11. Footer with Discreet Staff Access */}
      <Footer
        settings={settings}
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
        settings={settings}
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
        settings={settings}
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

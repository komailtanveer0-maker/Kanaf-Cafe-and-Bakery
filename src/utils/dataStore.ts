import { MenuItem, Category, GalleryItem, CafeSettings, Order } from "../types";
import { initialCategories, initialMenuItems, initialGallery, initialSettings } from "../data/fallbackData";

const STORAGE_KEYS = {
  MENU_ITEMS: "kanaf_menu_items_v2",
  CATEGORIES: "kanaf_categories_v2",
  GALLERY: "kanaf_gallery_v2",
  SETTINGS: "kanaf_settings_v2",
  ORDERS: "kanaf_orders_v2",
  STAFF_PIN: "kanaf_staff_pin_v2",
  STAFF_TOKEN: "kanaf_staff_token",
};

const DEFAULT_STAFF_PIN = "2580";

// Helper to safely parse JSON from localStorage
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (e) {
    return fallback;
  }
}

// Helper to safely write JSON to localStorage
function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[dataStore] Could not persist key "${key}"`, e);
  }
}

// Broadcast data modifications across tabs and window components instantly
function notifyChange(type: "menu" | "settings" | "gallery" | "orders"): void {
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("kanaf_data_changed", { detail: { type, timestamp: Date.now() } })
      );
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("kanaf_data_sync_channel");
        channel.postMessage({ type, timestamp: Date.now() });
        channel.close();
      }
    }
  } catch (e) {
    // Non-fatal
  }
}

// Helper to check if a response from fetch is actual JSON
async function parseJsonResponse(res: Response): Promise<{ isJson: boolean; data: any }> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return { isJson: false, data: null };
  }
  try {
    const data = await res.json();
    return { isJson: true, data };
  } catch (e) {
    return { isJson: false, data: null };
  }
}

class DataStoreService {
  // Initialize storage with fallback data if not already set
  constructor() {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      setLocal(STORAGE_KEYS.CATEGORIES, initialCategories);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
      setLocal(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      setLocal(STORAGE_KEYS.GALLERY, initialGallery);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      setLocal(STORAGE_KEYS.SETTINGS, initialSettings);
    } else {
      // Force free delivery on existing stored settings
      const existingSettings = getLocal<CafeSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
      if (existingSettings.deliveryFee !== 0 || existingSettings.deliveryMinOrder !== 0) {
        existingSettings.deliveryFee = 0;
        existingSettings.deliveryMinOrder = 0;
        setLocal(STORAGE_KEYS.SETTINGS, existingSettings);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.STAFF_PIN)) {
      localStorage.setItem(STORAGE_KEYS.STAFF_PIN, DEFAULT_STAFF_PIN);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      setLocal(STORAGE_KEYS.ORDERS, []);
    }
  }

  // --- STAFF AUTHENTICATION ---

  public getStaffPin(): string {
    return localStorage.getItem(STORAGE_KEYS.STAFF_PIN) || DEFAULT_STAFF_PIN;
  }

  public async loginStaff(pin: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const cleanPin = pin.trim();

    // 1. Try server login first (if full-stack server is running)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: cleanPin }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const { isJson, data } = await parseJsonResponse(res);
      if (isJson && data) {
        if (res.ok && data.success && data.token) {
          sessionStorage.setItem(STORAGE_KEYS.STAFF_TOKEN, data.token);
          return { success: true, token: data.token };
        } else if (data.error) {
          return { success: false, error: data.error };
        }
      }
    } catch (e) {
      // Server not reachable (e.g., static hosting on Vercel) - proceed to client verification
    }

    // 2. Client-side / Vercel validation fallback
    // Matches default '2580' or any PIN customized by the staff
    const currentPin = this.getStaffPin();
    if (cleanPin === currentPin || cleanPin === DEFAULT_STAFF_PIN) {
      const clientToken = `kanaf-staff-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(STORAGE_KEYS.STAFF_TOKEN, clientToken);
      return { success: true, token: clientToken };
    }

    return {
      success: false,
      error: "Incorrect Staff Access Code. Please try again.",
    };
  }

  public async verifyStaffToken(token: string): Promise<boolean> {
    if (!token) return false;

    // Check client token format
    if (token.startsWith("kanaf-staff-token-")) {
      return true;
    }

    // Try server verification if connected
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch("/api/staff/verify", {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const { isJson, data } = await parseJsonResponse(res);
      if (isJson && data) {
        return !!data.valid;
      }
    } catch (e) {
      // If server is unreachable, trust valid session token
    }

    return true;
  }

  public async logoutStaff(token?: string | null): Promise<void> {
    sessionStorage.removeItem(STORAGE_KEYS.STAFF_TOKEN);
    if (token) {
      try {
        await fetch("/api/staff/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {}
    }
  }

  public async changeStaffPin(
    currentPin: string,
    newPin: string,
    token?: string | null
  ): Promise<{ success: boolean; error?: string }> {
    const activePin = this.getStaffPin();
    if (currentPin.trim() !== activePin && currentPin.trim() !== DEFAULT_STAFF_PIN) {
      return { success: false, error: "Current PIN does not match" };
    }
    if (newPin.trim().length < 4) {
      return { success: false, error: "New PIN must be at least 4 digits" };
    }

    localStorage.setItem(STORAGE_KEYS.STAFF_PIN, newPin.trim());

    // Try sync with server if online
    if (token) {
      try {
        await fetch("/api/staff/change-pin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPin, newPin: newPin.trim() }),
        });
      } catch (e) {}
    }

    return { success: true };
  }

  // --- MENU & CATEGORIES ---

  public async getMenuData(): Promise<{ categories: Category[]; items: MenuItem[] }> {
    const localCategories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
    const localItems = getLocal<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch("/api/menu", { signal: controller.signal });
      clearTimeout(timeoutId);

      const { isJson, data } = await parseJsonResponse(res);
      if (isJson && data && Array.isArray(data.items) && data.items.length > 0) {
        setLocal(STORAGE_KEYS.CATEGORIES, data.categories || localCategories);
        setLocal(STORAGE_KEYS.MENU_ITEMS, data.items || localItems);
        return {
          categories: data.categories || localCategories,
          items: data.items || localItems,
        };
      }
    } catch (e) {
      // Use local storage
    }

    return {
      categories: localCategories,
      items: localItems,
    };
  }

  public async saveMenuItem(
    itemData: Omit<MenuItem, "id"> & { id?: string },
    token?: string | null
  ): Promise<{ success: boolean; item: MenuItem }> {
    const currentItems = getLocal<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);

    let savedItem: MenuItem;
    if (itemData.id) {
      // Edit existing
      savedItem = {
        ...itemData,
        id: itemData.id,
        updatedAt: new Date().toISOString(),
      } as MenuItem;
      const updatedList = currentItems.map((item) =>
        item.id === itemData.id ? { ...item, ...savedItem } : item
      );
      setLocal(STORAGE_KEYS.MENU_ITEMS, updatedList);

      // Background server update
      if (token) {
        fetch(`/api/menu/item/${itemData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }).catch(() => {});
      }
    } else {
      // Create new
      savedItem = {
        ...itemData,
        id: `item-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as MenuItem;
      const updatedList = [savedItem, ...currentItems];
      setLocal(STORAGE_KEYS.MENU_ITEMS, updatedList);

      // Background server create
      if (token) {
        fetch("/api/menu/item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        }).catch(() => {});
      }
    }

    notifyChange("menu");
    return { success: true, item: savedItem };
  }

  public async quickUpdatePrice(
    itemId: string,
    newPrice: number,
    token?: string | null
  ): Promise<boolean> {
    const currentItems = getLocal<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);
    const updated = currentItems.map((item) =>
      item.id === itemId ? { ...item, price: newPrice, updatedAt: new Date().toISOString() } : item
    );
    setLocal(STORAGE_KEYS.MENU_ITEMS, updated);
    notifyChange("menu");

    if (token) {
      fetch(`/api/menu/item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: newPrice }),
      }).catch(() => {});
    }

    return true;
  }

  public async toggleAvailability(
    itemId: string,
    available: boolean,
    token?: string | null
  ): Promise<boolean> {
    const currentItems = getLocal<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);
    const updated = currentItems.map((item) =>
      item.id === itemId ? { ...item, available, updatedAt: new Date().toISOString() } : item
    );
    setLocal(STORAGE_KEYS.MENU_ITEMS, updated);
    notifyChange("menu");

    if (token) {
      fetch(`/api/menu/item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available }),
      }).catch(() => {});
    }

    return true;
  }

  public async toggleFeatured(
    itemId: string,
    featured: boolean,
    token?: string | null
  ): Promise<boolean> {
    const currentItems = getLocal<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);
    const updated = currentItems.map((item) =>
      item.id === itemId ? { ...item, featured, updatedAt: new Date().toISOString() } : item
    );
    setLocal(STORAGE_KEYS.MENU_ITEMS, updated);
    notifyChange("menu");

    if (token) {
      fetch(`/api/menu/item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured }),
      }).catch(() => {});
    }

    return true;
  }

  public async deleteMenuItem(itemId: string, token?: string | null): Promise<boolean> {
    const currentItems = getLocal<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);
    const updated = currentItems.filter((item) => item.id !== itemId);
    setLocal(STORAGE_KEYS.MENU_ITEMS, updated);
    notifyChange("menu");

    if (token) {
      fetch(`/api/menu/item/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    return true;
  }

  public async saveCategory(
    categoryData: { name: string; icon?: string; description?: string },
    token?: string | null
  ): Promise<boolean> {
    const currentCategories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newCategory: Category = {
      id: slug || `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      icon: categoryData.icon || "UtensilsCrossed",
      description: categoryData.description?.trim(),
    };

    const existingIndex = currentCategories.findIndex((c) => c.id === newCategory.id);
    let updated: Category[];
    if (existingIndex >= 0) {
      updated = currentCategories.map((c) => (c.id === newCategory.id ? newCategory : c));
    } else {
      updated = [...currentCategories, newCategory];
    }
    setLocal(STORAGE_KEYS.CATEGORIES, updated);
    notifyChange("menu");

    if (token) {
      fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      }).catch(() => {});
    }

    return true;
  }

  public async deleteCategory(catId: string, token?: string | null): Promise<boolean> {
    const currentCategories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
    const updated = currentCategories.filter((c) => c.id !== catId);
    setLocal(STORAGE_KEYS.CATEGORIES, updated);
    notifyChange("menu");

    if (token) {
      fetch(`/api/categories/${catId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    return true;
  }

  // --- SETTINGS ---

  public async getSettings(): Promise<CafeSettings> {
    const local = getLocal<CafeSettings>(STORAGE_KEYS.SETTINGS, initialSettings);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch("/api/settings", { signal: controller.signal });
      clearTimeout(timeoutId);

      const { isJson, data } = await parseJsonResponse(res);
      if (isJson && data) {
        const merged = { ...local, ...data };
        setLocal(STORAGE_KEYS.SETTINGS, merged);
        return merged;
      }
    } catch (e) {}

    return local;
  }

  public async saveSettings(
    settingsData: Partial<CafeSettings>,
    token?: string | null
  ): Promise<CafeSettings> {
    const current = getLocal<CafeSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
    const updated = {
      ...current,
      ...settingsData,
      deliveryFee: 0,
      deliveryMinOrder: 0,
    };

    // Auto-calculate international phone versions for WhatsApp & calls if updated
    if (settingsData.phone) {
      const cleanPhone = settingsData.phone.replace(/[^0-9+]/g, "");
      updated.internationalPhone = cleanPhone.startsWith("+")
        ? cleanPhone
        : `+92${cleanPhone.replace(/^0/, "")}`;
    }
    if (settingsData.aryWhatsApp) {
      const cleanWa = settingsData.aryWhatsApp.replace(/[^0-9+]/g, "");
      updated.aryWhatsAppIntl = cleanWa.startsWith("+")
        ? cleanWa
        : `+92${cleanWa.replace(/^0/, "")}`;
    }

    setLocal(STORAGE_KEYS.SETTINGS, updated);
    notifyChange("settings");

    if (token) {
      fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      }).catch(() => {});
    }

    return updated;
  }

  // --- GALLERY ---

  public async getGallery(): Promise<GalleryItem[]> {
    const local = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch("/api/gallery", { signal: controller.signal });
      clearTimeout(timeoutId);

      const { isJson, data } = await parseJsonResponse(res);
      if (isJson && Array.isArray(data) && data.length > 0) {
        setLocal(STORAGE_KEYS.GALLERY, data);
        return data;
      }
    } catch (e) {}

    return local;
  }

  public async addGalleryPhoto(
    photo: Omit<GalleryItem, "id">,
    token?: string | null
  ): Promise<GalleryItem> {
    const current = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);
    const newPhoto: GalleryItem = {
      id: `gal-${Date.now()}`,
      ...photo,
    };
    const updated = [newPhoto, ...current];
    setLocal(STORAGE_KEYS.GALLERY, updated);
    notifyChange("gallery");

    if (token) {
      fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(photo),
      }).catch(() => {});
    }

    return newPhoto;
  }

  public async deleteGalleryPhoto(id: string, token?: string | null): Promise<boolean> {
    const current = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);
    const updated = current.filter((g) => g.id !== id);
    setLocal(STORAGE_KEYS.GALLERY, updated);
    notifyChange("gallery");

    if (token) {
      fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    return true;
  }

  // --- ORDERS ---

  public async getOrders(token?: string | null): Promise<Order[]> {
    const local = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);

    if (token) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const { isJson, data } = await parseJsonResponse(res);
        if (isJson && Array.isArray(data)) {
          setLocal(STORAGE_KEYS.ORDERS, data);
          return data;
        }
      } catch (e) {}
    }

    return local;
  }

  public async recordOrder(orderInput: {
    customerName: string;
    phone: string;
    deliveryAddress: string;
    landmark?: string;
    notes?: string;
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      specialNotes?: string;
    }[];
    total: number;
    orderRef?: string;
  }): Promise<Order> {
    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderInput.orderRef || `KNF-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderInput.customerName,
      phone: orderInput.phone,
      deliveryAddress: orderInput.deliveryAddress,
      landmark: orderInput.landmark,
      notes: orderInput.notes,
      items: orderInput.items,
      total: orderInput.total,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...orders];
    setLocal(STORAGE_KEYS.ORDERS, updated);
    notifyChange("orders");

    // Try posting to backend
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderInput),
    }).catch(() => {});

    return newOrder;
  }

  public async updateOrderStatus(
    orderId: string,
    status: Order["status"],
    token?: string | null
  ): Promise<boolean> {
    const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setLocal(STORAGE_KEYS.ORDERS, updated);
    notifyChange("orders");

    if (token) {
      fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }).catch(() => {});
    }

    return true;
  }

  // --- DATA BACKUP, EXPORT & SYNC FOR VERCEL & MULTI-DEVICE ---

  public exportAllData(): string {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      categories: getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories),
      menuItems: getLocal<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, initialMenuItems),
      gallery: getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery),
      settings: getLocal<CafeSettings>(STORAGE_KEYS.SETTINGS, initialSettings),
      orders: getLocal<Order[]>(STORAGE_KEYS.ORDERS, []),
    };
    return JSON.stringify(data, null, 2);
  }

  public importAllData(jsonStr: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== "object") {
        return { success: false, error: "Invalid backup data format." };
      }

      if (Array.isArray(parsed.categories)) {
        setLocal(STORAGE_KEYS.CATEGORIES, parsed.categories);
      }
      if (Array.isArray(parsed.menuItems)) {
        setLocal(STORAGE_KEYS.MENU_ITEMS, parsed.menuItems);
      }
      if (Array.isArray(parsed.gallery)) {
        setLocal(STORAGE_KEYS.GALLERY, parsed.gallery);
      }
      if (parsed.settings && typeof parsed.settings === "object") {
        parsed.settings.deliveryFee = 0;
        parsed.settings.deliveryMinOrder = 0;
        setLocal(STORAGE_KEYS.SETTINGS, parsed.settings);
      }
      if (Array.isArray(parsed.orders)) {
        setLocal(STORAGE_KEYS.ORDERS, parsed.orders);
      }

      notifyChange("menu");
      notifyChange("settings");
      notifyChange("gallery");
      notifyChange("orders");

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to parse data" };
    }
  }

  // --- IMAGE UPLOAD (Device photo upload fallback to base64 Data URL) ---

  public async uploadImage(
    base64: string,
    fileName: string,
    token?: string | null
  ): Promise<string> {
    // If running in full-stack mode with backend server
    if (token) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64, name: fileName }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const { isJson, data } = await parseJsonResponse(res);
        if (isJson && data?.url) {
          return data.url;
        }
      } catch (e) {}
    }

    // On Vercel / static hosting, base64 data URL works in <img> directly and saves to localStorage
    return base64;
  }
}

export const dataStore = new DataStoreService();

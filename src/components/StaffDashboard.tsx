import React, { useState, useRef } from "react";
import { MenuItem, Category, Order, GalleryItem, CafeSettings } from "../types";
import { formatPrice } from "../utils/whatsapp";
import {
  Plus,
  Edit2,
  Edit3,
  Trash2,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Star,
  Search,
  CheckCircle2,
  AlertCircle,
  Save,
  Key,
  Camera,
  Banknote,
} from "lucide-react";

interface StaffDashboardProps {
  token: string;
  categories: Category[];
  items: MenuItem[];
  gallery: GalleryItem[];
  settings: CafeSettings;
  onClose: () => void;
  onRefreshMenu: () => void;
  onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  token,
  categories,
  items,
  gallery,
  settings,
  onClose,
  onRefreshMenu,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    "menu" | "categories" | "orders" | "gallery" | "settings"
  >("menu");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Add / Edit Item Modal State
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    category: categories[0]?.id || "paninis",
    description: "",
    price: "",
    available: true,
    featured: false,
    image: "/assets/kanaf_panini_poster.jpg",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Quick Price Edit State
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<string>("");
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);
  const [priceEditMode, setPriceEditMode] = useState<boolean>(false);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "UtensilsCrossed",
    description: "",
  });

  // Gallery Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "Food" as "Food" | "Bakery" | "Coffee" | "Cafe" | "Behind the Scenes",
    image: "",
    caption: "",
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    phone: settings.phone,
    address: settings.address,
    aryWhatsApp: settings.aryWhatsApp,
    openingHours: settings.openingHours,
    currentPin: "",
    newPin: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Load orders when orders tab is clicked
  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleTabChange = (
    tab: "menu" | "categories" | "orders" | "gallery" | "settings"
  ) => {
    setActiveTab(tab);
    setStatusMessage(null);
    if (tab === "orders") {
      loadOrders();
    }
  };

  // Quick toggle availability
  const toggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/item/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available: !item.available }),
      });
      if (res.ok) {
        onRefreshMenu();
      }
    } catch (err) {
      console.error("Error toggling item availability:", err);
    }
  };

  // Quick toggle featured
  const toggleFeatured = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/item/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !item.featured }),
      });
      if (res.ok) {
        onRefreshMenu();
      }
    } catch (err) {
      console.error("Error toggling featured:", err);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/menu/item/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onRefreshMenu();
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // Quick Price Edit Save
  const handleQuickSavePrice = async (itemId: string, overridePrice?: string) => {
    const priceToUse = overridePrice !== undefined ? overridePrice : quickPriceValue;
    const priceNum = Number(priceToUse);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("Please enter a valid price number");
      return;
    }

    setSavingPriceId(itemId);
    try {
      const res = await fetch(`/api/menu/item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: priceNum }),
      });
      if (res.ok) {
        setEditingPriceId(null);
        onRefreshMenu();
      } else {
        alert("Failed to update price.");
      }
    } catch (err) {
      console.error("Error updating price:", err);
      alert("Error communicating with server.");
    } finally {
      setSavingPriceId(null);
    }
  };

  // Open Add Item Modal
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: "",
      category: categories[0]?.id || "paninis",
      description: "",
      price: "",
      available: true,
      featured: false,
      image: "/assets/kanaf_panini_poster.jpg",
    });
    setImagePreview(null);
    setItemModalOpen(true);
  };

  // Open Edit Item Modal
  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price.toString(),
      available: item.available,
      featured: item.featured,
      image: item.image,
    });
    setImagePreview(item.image);
    setItemModalOpen(true);
  };

  // Handle image upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64, name: file.name }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setItemForm((prev) => ({ ...prev, image: data.url }));
        } else {
          // Fallback to base64 preview
          setItemForm((prev) => ({ ...prev, image: base64 }));
        }
      } catch (err) {
        setItemForm((prev) => ({ ...prev, image: base64 }));
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.price) return;

    try {
      const payload = {
        name: itemForm.name.trim(),
        category: itemForm.category,
        description: itemForm.description.trim(),
        price: Number(itemForm.price) || 0,
        available: itemForm.available,
        featured: itemForm.featured,
        image: itemForm.image,
      };

      let res;
      if (editingItem) {
        res = await fetch(`/api/menu/item/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/menu/item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setItemModalOpen(false);
        onRefreshMenu();
      }
    } catch (err) {
      console.error("Error saving menu item:", err);
    }
  };

  // Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      });
      if (res.ok) {
        setCategoryModalOpen(false);
        setCategoryForm({ name: "", icon: "UtensilsCrossed", description: "" });
        onRefreshMenu();
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Items in this category will not be removed.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/categories/${catId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onRefreshMenu();
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        loadOrders();
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Save Settings & PIN
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    try {
      // 1. Update basic settings
      await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: settingsForm.phone,
          address: settingsForm.address,
          aryWhatsApp: settingsForm.aryWhatsApp,
          openingHours: settingsForm.openingHours,
        }),
      });

      // 2. If new PIN provided, change PIN
      if (settingsForm.newPin.trim()) {
        const pinRes = await fetch("/api/staff/change-pin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPin: settingsForm.currentPin,
            newPin: settingsForm.newPin,
          }),
        });
        const pinData = await pinRes.json();
        if (!pinRes.ok) {
          setStatusMessage(`Settings saved, but PIN change failed: ${pinData.error}`);
          return;
        }
      }

      setStatusMessage("Settings updated successfully!");
      setSettingsForm((prev) => ({ ...prev, currentPin: "", newPin: "" }));
    } catch (err: any) {
      setStatusMessage("Error saving settings: " + err.message);
    }
  };

  // Filter items in staff table
  const staffFilteredItems = items.filter((item) => {
    const matchCat = filterCategory === "all" || item.category === filterCategory;
    const matchSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] text-[#2D2522] flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <header className="bg-[#4A0817] text-white px-6 py-4 flex items-center justify-between shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white border border-white/20">
            K
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-white">
              Kanaf Management Panel
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-[#D7E7F2] block">
              Authorized Staff Mode
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            View Live Site
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            title="Logout of Staff Panel"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-[#5C0D20]/10 p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-1">
            <button
              onClick={() => handleTabChange("menu")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "menu"
                  ? "bg-[#5C0D20] text-white shadow-sm"
                  : "text-[#4A4540] hover:bg-[#FAF7F2] hover:text-[#5C0D20]"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Menu Items ({items.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("categories")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "categories"
                  ? "bg-[#5C0D20] text-white shadow-sm"
                  : "text-[#4A4540] hover:bg-[#FAF7F2] hover:text-[#5C0D20]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "orders"
                  ? "bg-[#5C0D20] text-white shadow-sm"
                  : "text-[#4A4540] hover:bg-[#FAF7F2] hover:text-[#5C0D20]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders Log</span>
            </button>

            <button
              onClick={() => handleTabChange("gallery")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "gallery"
                  ? "bg-[#5C0D20] text-white shadow-sm"
                  : "text-[#4A4540] hover:bg-[#FAF7F2] hover:text-[#5C0D20]"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery ({gallery.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "settings"
                  ? "bg-[#5C0D20] text-white shadow-sm"
                  : "text-[#4A4540] hover:bg-[#FAF7F2] hover:text-[#5C0D20]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & PIN</span>
            </button>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#5C0D20]/10 text-[11px] text-gray-500">
            <p className="font-bold text-[#5C0D20]">Staff PIN Protected</p>
            <p className="mt-0.5">Live changes sync instantly to all customers.</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF7F2]">
          {/* Mobile Tab Pills */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
            {[
              { id: "menu", label: "Menu" },
              { id: "categories", label: "Categories" },
              { id: "orders", label: "Orders" },
              { id: "gallery", label: "Gallery" },
              { id: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#5C0D20] text-white"
                    : "bg-white text-gray-700 border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: MENU ITEMS */}
          {activeTab === "menu" && (
            <div className="space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-black text-2xl text-[#4A0817]">
                    Menu & Recipe Management
                  </h3>
                  <p className="text-xs text-[#615A56] mt-0.5">
                    Add new recipes, upload photos from device, edit prices, or update availability.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Edit Prices Mode Toggle */}
                  <button
                    id="staff-toggle-price-mode-btn"
                    onClick={() => setPriceEditMode(!priceEditMode)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                      priceEditMode
                        ? "bg-amber-700 text-white border-amber-800 shadow-md"
                        : "bg-white text-[#5C0D20] border-[#5C0D20]/25 hover:bg-[#5C0D20]/5 shadow-2xs"
                    }`}
                    title="Toggle fast price editing for all items"
                  >
                    <Banknote className="w-4 h-4" />
                    <span>{priceEditMode ? "Exit Price Mode" : "Edit Prices"}</span>
                  </button>

                  {/* Add New Recipe Button */}
                  <button
                    id="staff-add-recipe-btn"
                    onClick={handleOpenAddItem}
                    className="px-5 py-2.5 rounded-full bg-[#5C0D20] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#460816] transition-all shadow-md flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Recipe</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu recipes and dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#5C0D20]/15 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5C0D20]/20"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#5C0D20]/15 text-xs text-gray-800 focus:outline-none"
                >
                  <option value="all">All Categories ({items.length})</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-2xl border border-[#5C0D20]/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#5C0D20]/10 text-[#4A0817] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Recipe / Dish</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Featured</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffFilteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0 border border-gray-200"
                              />
                              <div>
                                <h5 className="font-serif font-bold text-sm text-[#2D2522]">
                                  {item.name}
                                </h5>
                                <p className="text-[11px] text-gray-500 line-clamp-1 max-w-xs">
                                  {item.description || "No recipe description provided"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="capitalize px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#5C0D20] font-medium border border-[#5C0D20]/10 text-[11px]">
                              {categories.find((c) => c.id === item.category)?.name || item.category}
                            </span>
                          </td>

                          {/* Interactive Price Column */}
                          <td className="p-3.5">
                            {priceEditMode || editingPriceId === item.id ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-[#5C0D20]">Rs.</span>
                                <input
                                  type="number"
                                  defaultValue={item.price}
                                  id={`price-input-${item.id}`}
                                  onChange={(e) => setQuickPriceValue(e.target.value)}
                                  onFocus={() => {
                                    setEditingPriceId(item.id);
                                    setQuickPriceValue(item.price.toString());
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleQuickSavePrice(item.id, (e.target as HTMLInputElement).value);
                                    } else if (e.key === "Escape") {
                                      setEditingPriceId(null);
                                    }
                                  }}
                                  className="w-20 px-2 py-1 rounded-lg border-2 border-[#5C0D20]/30 font-bold text-xs text-[#4A0817] focus:outline-none focus:border-[#5C0D20] bg-[#FAF7F2]"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    const input = e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement;
                                    handleQuickSavePrice(item.id, input ? input.value : quickPriceValue);
                                  }}
                                  disabled={savingPriceId === item.id}
                                  title="Save Price"
                                  className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                {!priceEditMode && (
                                  <button
                                    type="button"
                                    onClick={() => setEditingPriceId(null)}
                                    title="Cancel"
                                    className="p-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 group">
                                <span className="font-bold font-serif text-sm text-[#4A0817]">
                                  {formatPrice(item.price)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPriceId(item.id);
                                    setQuickPriceValue(item.price.toString());
                                  }}
                                  className="p-1 rounded text-gray-400 hover:text-[#5C0D20] hover:bg-[#5C0D20]/10 transition-colors opacity-70 group-hover:opacity-100"
                                  title="Edit Price"
                                  aria-label={`Edit price for ${item.name}`}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={() => toggleAvailability(item)}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                                item.available
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                              }`}
                            >
                              {item.available ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Available</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3" />
                                  <span>Sold Out</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={() => toggleFeatured(item)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                item.featured
                                  ? "text-amber-500 hover:text-amber-600 bg-amber-50"
                                  : "text-gray-300 hover:text-gray-400"
                              }`}
                              title={item.featured ? "Featured Item" : "Mark as Featured"}
                            >
                              <Star className={`w-4 h-4 ${item.featured ? "fill-amber-500" : ""}`} />
                            </button>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditItem(item)}
                                className="p-2 rounded-lg text-gray-500 hover:text-[#5C0D20] hover:bg-[#FAF7F2] transition-colors"
                                title="Edit Item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-2xl text-[#4A0817]">
                    Menu Categories
                  </h3>
                  <p className="text-xs text-[#615A56] mt-0.5">
                    Organize menu groupings displayed in navigation pills.
                  </p>
                </div>

                <button
                  onClick={() => setCategoryModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-[#5C0D20] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#460816] transition-all shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const itemCount = items.filter((i) => i.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="bg-white p-5 rounded-2xl border border-[#5C0D20]/10 shadow-xs flex items-start justify-between"
                    >
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#8F1F39] block mb-1">
                          ID: {cat.id}
                        </span>
                        <h4 className="font-serif font-bold text-lg text-[#2D2522]">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {cat.description || "No description"}
                        </p>
                        <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#5C0D20] text-xs font-semibold">
                          {itemCount} items
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS LOG */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-2xl text-[#4A0817]">
                    Customer Orders Log
                  </h3>
                  <p className="text-xs text-[#615A56] mt-0.5">
                    Orders transmitted to ARY Services WhatsApp and logged on server.
                  </p>
                </div>

                <button
                  onClick={loadOrders}
                  className="px-4 py-2 rounded-full border border-[#5C0D20]/20 text-[#5C0D20] text-xs font-bold uppercase hover:bg-white transition-colors"
                >
                  Refresh Orders
                </button>
              </div>

              {ordersLoading ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-[#5C0D20]/20">
                  <ShoppingBag className="w-12 h-12 text-[#5C0D20]/40 mx-auto mb-3" />
                  <h4 className="font-serif font-bold text-lg text-[#4A0817]">
                    No Orders Recorded Yet
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    When customers place orders, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl p-6 border border-[#5C0D20]/15 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b">
                        <div>
                          <span className="font-mono font-bold text-xs text-[#5C0D20] bg-[#FAF7F2] px-2.5 py-1 rounded-full mr-2">
                            #{ord.orderNumber}
                          </span>
                          <span className="font-serif font-bold text-base text-[#2D2522]">
                            {ord.customerName}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            • Phone: {ord.phone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(ord.createdAt).toLocaleTimeString("en-PK")}
                          </span>
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.id, e.target.value)
                            }
                            className={`text-xs font-bold px-3 py-1 rounded-full border ${
                              ord.status === "New"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : ord.status === "Preparing"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : ord.status === "Dispatched"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : ord.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">
                            Delivery Details
                          </p>
                          <p className="text-gray-800">{ord.deliveryAddress}</p>
                          {ord.landmark && (
                            <p className="text-gray-500 mt-0.5">
                              Landmark: {ord.landmark}
                            </p>
                          )}
                          {ord.notes && (
                            <p className="text-[#5C0D20] font-medium mt-1">
                              Note: {ord.notes}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">
                            Items Ordered
                          </p>
                          <ul className="space-y-1">
                            {ord.items.map((i, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span>
                                  {i.quantity} × {i.name}
                                </span>
                                <span className="font-semibold">
                                  {formatPrice(i.price * i.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between font-bold text-[#4A0817] pt-2 mt-2 border-t text-sm font-serif">
                            <span>Total</span>
                            <span>{formatPrice(ord.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-2xl text-[#4A0817]">
                    Photo Gallery Manager
                  </h3>
                  <p className="text-xs text-[#615A56] mt-0.5">
                    Manage Instagram-style gallery photos visible to visitors.
                  </p>
                </div>

                <button
                  onClick={() => setGalleryModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-[#5C0D20] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#460816] transition-all shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#5C0D20]/10 shadow-xs relative group"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-3">
                      <span className="text-[10px] uppercase font-bold text-[#8F1F39] block">
                        {item.category}
                      </span>
                      <h5 className="font-serif font-bold text-xs text-[#2D2522] truncate">
                        {item.title}
                      </h5>
                    </div>
                    <button
                      onClick={async () => {
                        if (window.confirm("Delete photo?")) {
                          await fetch(`/api/gallery/${item.id}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          onRefreshMenu();
                        }
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & PIN */}
          {activeTab === "settings" && (
            <div className="max-w-2xl bg-white rounded-3xl p-8 border border-[#5C0D20]/15 shadow-sm">
              <h3 className="font-serif font-black text-2xl text-[#4A0817] mb-1">
                Store Settings & Security
              </h3>
              <p className="text-xs text-[#615A56] mb-6">
                Update business details, WhatsApp dispatch number, and staff security PIN.
              </p>

              {statusMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C0D20]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                    Store Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, address: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C0D20]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                    ARY Services WhatsApp
                  </label>
                  <input
                    type="text"
                    value={settingsForm.aryWhatsApp}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, aryWhatsApp: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C0D20]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={settingsForm.openingHours}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, openingHours: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5C0D20]"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-[#4A0817] uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#8F1F39]" />
                    <span>Change Staff Access PIN</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 mb-1">Current PIN</label>
                      <input
                        type="password"
                        placeholder="••••"
                        value={settingsForm.currentPin}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, currentPin: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">New PIN (min 4 digits)</label>
                      <input
                        type="password"
                        placeholder="••••"
                        value={settingsForm.newPin}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, newPin: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#5C0D20] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#460816] transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT MENU ITEM & RECIPE */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-6 border border-[#5C0D20]/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#5C0D20]/15">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#4A0817]">
                  {editingItem ? "Edit Recipe & Pricing" : "Add New Recipe / Dish"}
                </h3>
                <p className="text-[11px] text-[#615A56] mt-0.5">
                  {editingItem
                    ? "Update ingredients, price in PKR, or recipe photo from your device"
                    : "Add a new dish to Kanaf menu with description and device photo"}
                </p>
              </div>
              <button
                onClick={() => setItemModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                  Recipe / Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g. Artisanal Chicken Club Panini"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#5C0D20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm capitalize focus:outline-none focus:border-[#5C0D20]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    placeholder="e.g. 690"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#5C0D20]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                  Recipe Details & Description
                </label>
                <textarea
                  rows={3}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Description of recipe, key ingredients, preparation style, and serving notes..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#5C0D20]"
                />
              </div>

              {/* Photo Upload from Device */}
              <div className="p-4 rounded-2xl bg-white border border-[#5C0D20]/15 space-y-3">
                <label className="block font-bold text-[#4A0817] uppercase tracking-wider">
                  Recipe Picture (Upload from Device)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-[#5C0D20]/30 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                    {imagePreview || itemForm.image ? (
                      <img
                        src={imagePreview || itemForm.image}
                        alt="Recipe Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <Camera className="w-7 h-7 text-[#5C0D20]/40 mx-auto" />
                        <span className="text-[9px] text-gray-400 block mt-1">No picture</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-left w-full">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-4 py-2 rounded-xl bg-[#5C0D20] text-white text-xs font-bold hover:bg-[#460816] transition-all flex items-center gap-2 shadow-xs active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? "Uploading from device..." : "Choose Picture from Device"}</span>
                      </button>

                      {(imagePreview || itemForm.image) && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setItemForm((prev) => ({ ...prev, image: "/assets/kanaf_panini_poster.jpg" }));
                          }}
                          className="px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Reset Photo
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Upload from phone gallery, camera, or laptop files (JPG, PNG, WEBP).
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.available}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, available: e.target.checked })
                    }
                    className="w-4 h-4 text-[#5C0D20] rounded"
                  />
                  <span className="font-bold text-gray-800">Available to Order</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.featured}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, featured: e.target.checked })
                    }
                    className="w-4 h-4 text-[#5C0D20] rounded"
                  />
                  <span className="font-bold text-gray-800">Featured Recipe</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5C0D20] text-white font-bold uppercase tracking-wider hover:bg-[#460816] shadow-sm transition-all"
                >
                  {editingItem ? "Update Recipe" : "Publish Recipe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#5C0D20]/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-serif font-bold text-lg text-[#4A0817]">
                Add New Category
              </h3>
              <button onClick={() => setCategoryModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  placeholder="e.g. Gourmet Waffles"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, description: e.target.value })
                  }
                  placeholder="Crisp Belgian waffles topped with fresh cream..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#5C0D20] text-white font-bold uppercase tracking-wider hover:bg-[#460816]"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GALLERY PHOTO */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 border border-[#5C0D20]/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-serif font-bold text-lg text-[#4A0817]">
                Add Gallery Photo
              </h3>
              <button onClick={() => setGalleryModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!galleryForm.image) return;
                await fetch("/api/gallery", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(galleryForm),
                });
                setGalleryModalOpen(false);
                setGalleryForm({
                  title: "",
                  category: "Food",
                  image: "",
                  caption: "",
                });
                onRefreshMenu();
              }}
              className="space-y-4 pt-4 text-xs"
            >
              <div>
                <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, title: e.target.value })
                  }
                  placeholder="e.g. Afternoon Coffee Moments"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={galleryForm.category}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, category: e.target.value as any })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm"
                >
                  <option value="Food">Food</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Behind the Scenes">Behind the Scenes</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#4A0817] uppercase tracking-wider mb-1">
                  Upload Photo From Device
                </label>
                <input
                  type="file"
                  ref={galleryFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = (ev) => {
                      setGalleryForm((prev) => ({
                        ...prev,
                        image: ev.target?.result as string,
                      }));
                    };
                    r.readAsDataURL(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="w-full py-3 rounded-xl border border-dashed border-[#5C0D20]/30 bg-white hover:bg-[#FAF7F2] text-[#5C0D20] font-bold flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo from Device</span>
                </button>
                {galleryForm.image && (
                  <img
                    src={galleryForm.image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl mt-2 border"
                  />
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!galleryForm.image}
                  className="px-6 py-2 rounded-xl bg-[#5C0D20] text-white font-bold uppercase tracking-wider hover:bg-[#460816] disabled:opacity-50"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

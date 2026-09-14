import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Ensure upload & data directories exist
const uploadDir = path.join(process.cwd(), "public", "uploads");
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const menuFilePath = path.join(dataDir, "menu.json");
const storeFilePath = path.join(dataDir, "store.json");

function readMenu() {
  try {
    if (fs.existsSync(menuFilePath)) {
      const data = fs.readFileSync(menuFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading menu:", err);
  }
  return { categories: [], items: [] };
}

function writeMenu(data: any) {
  try {
    fs.writeFileSync(menuFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing menu:", err);
  }
}

function readStore() {
  try {
    if (fs.existsSync(storeFilePath)) {
      const data = fs.readFileSync(storeFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading store:", err);
  }
  return {
    settings: {
      cafeName: "Kanaf Cafe & Bakery",
      phone: "0543-692020",
      address: "Main Talagang Road, Chakwal, Pakistan",
      aryWhatsApp: "0333 6554090",
      pinHash: "ed946f65d2c785d90e827c5ffd879ce3b49c68d4c88013074176a7e73bc58bcf"
    },
    gallery: [],
    orders: []
  };
}

function writeStore(data: any) {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing store:", err);
  }
}

// Active staff tokens map: token -> expiry timestamp
const activeSessions = new Map<string, number>();

function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin.trim()).digest("hex");
}

function requireStaffAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Staff token required" });
  }
  const token = authHeader.substring(7).trim();
  const expiry = activeSessions.get(token);
  if (!expiry || Date.now() > expiry) {
    activeSessions.delete(token);
    return res.status(401).json({ error: "Session expired or invalid" });
  }
  // Refresh token expiry for active use (extends by 4 hours)
  activeSessions.set(token, Date.now() + 4 * 60 * 60 * 1000);
  next();
}

// ==================== API ROUTES ====================

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Kanaf Cafe & Bakery Backend", timestamp: new Date().toISOString() });
});

// Staff Authentication (Checking PIN server-side, never exposed to client)
app.post("/api/staff/login", (req, res) => {
  const { pin } = req.body;
  if (!pin || typeof pin !== "string") {
    return res.status(400).json({ success: false, error: "Please provide a valid code" });
  }

  const store = readStore();
  const inputHash = hashPin(pin);
  const envPin = process.env.STAFF_PIN;
  const envHash = envPin ? hashPin(envPin) : null;
  const correctHash = store.settings?.pinHash || "ed946f65d2c785d90e827c5ffd879ce3b49c68d4c88013074176a7e73bc58bcf";

  if (inputHash === correctHash || (envHash && inputHash === envHash)) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
    activeSessions.set(token, expiry);
    return res.json({ success: true, token, expiresAt: expiry, message: "Staff Access Granted" });
  }

  return res.status(401).json({ success: false, error: "Incorrect Staff Access Code. Please try again." });
});

// Verify staff token
app.get("/api/staff/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.substring(7).trim();
  const expiry = activeSessions.get(token);
  if (expiry && Date.now() < expiry) {
    return res.json({ valid: true });
  }
  return res.status(401).json({ valid: false });
});

// Change PIN
app.post("/api/staff/change-pin", requireStaffAuth, (req, res) => {
  const { currentPin, newPin } = req.body;
  if (!newPin || typeof newPin !== "string" || newPin.length < 4) {
    return res.status(400).json({ error: "New PIN must be at least 4 digits" });
  }

  const store = readStore();
  const currentHash = hashPin(currentPin || "");
  const expectedHash = store.settings?.pinHash;

  if (expectedHash && currentHash !== expectedHash) {
    return res.status(400).json({ error: "Current PIN is incorrect" });
  }

  store.settings.pinHash = hashPin(newPin);
  writeStore(store);
  return res.json({ success: true, message: "Staff code updated successfully" });
});

// Staff Logout
app.post("/api/staff/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Get Public Menu
app.get("/api/menu", (_req, res) => {
  const menu = readMenu();
  res.json(menu);
});

// Add Menu Item
app.post("/api/menu/item", requireStaffAuth, (req, res) => {
  const { name, category, description, price, available, featured, image } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: "Name, category, and price are required" });
  }

  const menu = readMenu();
  const newItem = {
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    category: category.trim(),
    description: description ? description.trim() : "",
    price: Number(price) || 0,
    available: available !== undefined ? Boolean(available) : true,
    featured: Boolean(featured),
    image: image || "/assets/kanaf_panini_poster.jpg",
    createdAt: new Date().toISOString()
  };

  menu.items.unshift(newItem);
  writeMenu(menu);
  res.status(201).json({ success: true, item: newItem });
});

// Update Menu Item
app.put("/api/menu/item/:id", requireStaffAuth, (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const menu = readMenu();

  const index = menu.items.findIndex((item: any) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  const existing = menu.items[index];
  menu.items[index] = {
    ...existing,
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : existing.price,
    available: updates.available !== undefined ? Boolean(updates.available) : existing.available,
    featured: updates.featured !== undefined ? Boolean(updates.featured) : existing.featured,
    updatedAt: new Date().toISOString()
  };

  writeMenu(menu);
  res.json({ success: true, item: menu.items[index] });
});

// Delete Menu Item
app.delete("/api/menu/item/:id", requireStaffAuth, (req, res) => {
  const { id } = req.params;
  const menu = readMenu();
  const initialLength = menu.items.length;
  menu.items = menu.items.filter((item: any) => item.id !== id);

  if (menu.items.length === initialLength) {
    return res.status(404).json({ error: "Item not found" });
  }

  writeMenu(menu);
  res.json({ success: true, message: "Item deleted successfully" });
});

// Get Categories
app.get("/api/categories", (_req, res) => {
  const menu = readMenu();
  res.json(menu.categories || []);
});

// Add Category
app.post("/api/categories", requireStaffAuth, (req, res) => {
  const { name, icon, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const menu = readMenu();
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const exists = menu.categories.some((c: any) => c.id === id || c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Category already exists" });
  }

  const newCat = {
    id,
    name: name.trim(),
    icon: icon || "UtensilsCrossed",
    description: description || ""
  };

  menu.categories.push(newCat);
  writeMenu(menu);
  res.status(201).json({ success: true, category: newCat });
});

// Update / Reorder Categories
app.put("/api/categories", requireStaffAuth, (req, res) => {
  const { categories } = req.body;
  if (!Array.isArray(categories)) {
    return res.status(400).json({ error: "Expected an array of categories" });
  }

  const menu = readMenu();
  menu.categories = categories;
  writeMenu(menu);
  res.json({ success: true, categories: menu.categories });
});

// Delete Category
app.delete("/api/categories/:id", requireStaffAuth, (req, res) => {
  const { id } = req.params;
  const menu = readMenu();
  menu.categories = menu.categories.filter((c: any) => c.id !== id);
  writeMenu(menu);
  res.json({ success: true, message: "Category deleted" });
});

// Upload Photo From Device (Stores to /public/uploads/)
app.post("/api/upload", requireStaffAuth, (req, res) => {
  try {
    const { image, name } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image payload provided" });
    }

    // Match base64 data url or raw base64
    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      // If it's already a URL, return it
      if (image.startsWith("http") || image.startsWith("/assets/")) {
        return res.json({ url: image });
      }
      return res.status(400).json({ error: "Invalid image format. Expected data:image/..." });
    }

    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const sanitizedName = (name || "upload").toLowerCase().replace(/[^a-z0-9]/g, "-").substring(0, 30);
    const fileName = `${Date.now()}-${sanitizedName}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${fileName}`;

    return res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to process image upload: " + err.message });
  }
});

// Record Customer Order
app.post("/api/orders", (req, res) => {
  const { customerName, phone, deliveryAddress, landmark, notes, items, total } = req.body;
  if (!customerName || !phone || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Customer name, phone, delivery address and ordered items are required" });
  }

  const store = readStore();
  const orderNumber = `KNF-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customerName: customerName.trim(),
    phone: phone.trim(),
    deliveryAddress: deliveryAddress.trim(),
    landmark: landmark ? landmark.trim() : "",
    notes: notes ? notes.trim() : "",
    items,
    total: Number(total) || 0,
    status: "New",
    createdAt: new Date().toISOString()
  };

  if (!store.orders) store.orders = [];
  store.orders.unshift(newOrder);
  // Keep last 200 orders
  if (store.orders.length > 200) {
    store.orders = store.orders.slice(0, 200);
  }
  writeStore(store);

  res.status(201).json({ success: true, order: newOrder });
});

// Get Orders (Staff Only)
app.get("/api/orders", requireStaffAuth, (_req, res) => {
  const store = readStore();
  res.json(store.orders || []);
});

// Update Order Status (Staff Only)
app.put("/api/orders/:id/status", requireStaffAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const store = readStore();
  const order = (store.orders || []).find((o: any) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  order.status = status;
  writeStore(store);
  res.json({ success: true, order });
});

// Get Gallery
app.get("/api/gallery", (_req, res) => {
  const store = readStore();
  res.json(store.gallery || []);
});

// Add Gallery Photo (Staff Only)
app.post("/api/gallery", requireStaffAuth, (req, res) => {
  const { title, category, image, caption } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Image URL or upload is required" });
  }

  const store = readStore();
  const newItem = {
    id: `gal-${Date.now()}`,
    title: title ? title.trim() : "Kanaf Experience",
    category: category || "Cafe",
    image,
    caption: caption || ""
  };

  if (!store.gallery) store.gallery = [];
  store.gallery.unshift(newItem);
  writeStore(store);
  res.status(201).json({ success: true, item: newItem });
});

// Delete Gallery Photo (Staff Only)
app.delete("/api/gallery/:id", requireStaffAuth, (req, res) => {
  const { id } = req.params;
  const store = readStore();
  store.gallery = (store.gallery || []).filter((g: any) => g.id !== id);
  writeStore(store);
  res.json({ success: true });
});

// Get Public Settings
app.get("/api/settings", (_req, res) => {
  const store = readStore();
  const { pinHash, ...publicSettings } = store.settings || {};
  res.json(publicSettings);
});

// Update Settings (Staff Only)
app.put("/api/settings", requireStaffAuth, (req, res) => {
  const updates = req.body;
  const store = readStore();
  // Prevent overriding pinHash directly here
  delete updates.pinHash;
  store.settings = {
    ...store.settings,
    ...updates
  };
  writeStore(store);
  const { pinHash, ...safeSettings } = store.settings;
  res.json({ success: true, settings: safeSettings });
});

// Serve uploaded static files
app.use("/uploads", express.static(uploadDir));
app.use("/assets", express.static(path.join(process.cwd(), "public", "assets")));

// Vite Middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kanaf Cafe & Bakery server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

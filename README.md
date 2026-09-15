# Kanaf Cafe & Bakery — Chakwal, Pakistan

*Taste Crafted With Care.* A modern, full-stack café and bakery web application featuring live menu browsing, dynamic cart, direct WhatsApp order routing to **ARY Services** (`0333 6554090`), and a password-protected **Staff Portal** (PIN `2580`) for menu management, recipe descriptions, device photo uploads, and real-time price updates.

---

## Features

- **Artisanal Café & Bakery Storefront**:
  - Filterable menu categories: Savory Paninis, Pizzas, Burgers & Wraps, Fresh Bakery Treats, Coffees & Coolers.
  - Interactive item modal with item descriptions and ingredient highlights.
  - Live cart drawer with add/remove/quantity adjustment and minimum order calculations.
- **Direct WhatsApp Ordering**:
  - Automatically formats the full order breakdown (itemized receipt, quantities, delivery address, phone, and total in PKR).
  - Routes directly to **ARY Services WhatsApp** (`+92 333 6554090`) with one-click dispatch.
- **Protected Staff Portal (PIN: `2580`)**:
  - Accessible via the **Staff** button in the header.
  - Add/edit recipes, menu items, and categories.
  - Upload recipe pictures directly from your mobile gallery, camera, or desktop files.
  - **Quick Price Editing**: Edit individual prices with one click or toggle **"Edit Prices" mode** across the whole menu.
  - Toggle item availability (Available vs. Sold Out) and Featured status.
  - Persistent JSON store in `/data/store.json`.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Backend / Server**: Node.js, Express, Vite middleware mode
- **Build / Bundle**: Vite + esbuild (`dist/server.cjs`)

---

## Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables (optional):**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - `STAFF_PIN`: Set custom staff portal code (defaults to `2580` if not set).
   - `GEMINI_API_KEY`: Optional, required if using Gemini AI endpoints.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

6. **Run Production Build:**
   ```bash
   npm start
   ```

---

## How to Export & Push to GitHub

### Method A: One-Click Export from AI Studio (Easiest)
1. In the **AI Studio** interface, click the **Settings / Menu** icon (three dots or gear icon in the top bar).
2. Select **"Export to GitHub"** (or **"Download as ZIP"**).
3. Connect your GitHub account and choose or create the repository name.

### Method B: Via Git Command Line
If you downloaded the ZIP or are pushing from your machine:
```bash
git init
git add .
git commit -m "Initial commit: Kanaf Cafe & Bakery web application"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

---

## Deploying on Vercel (vercel.com)

This repository is pre-configured for 1-click zero-config deployment on **Vercel**:

1. **Import the repository into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository (`kanaf-cafe-bakery`).
2. **Project Settings**:
   - **Framework Preset**: `Vite` (automatically detected via `vercel.json`)
   - **Build Command**: `vite build` (or `npm run build:client`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Click **Deploy**!
   - Your site will be live on your custom `.vercel.app` URL with full SSL and global CDN.
   - The WhatsApp order integration to **ARY Services** (`0333 6554090`) works seamlessly on Vercel out of the box.

---

## Free Cloud Deployment Options

- **Vercel (Recommended for frontend)**:
  - Framework: `Vite`
  - Output: `dist`
- **Render / Railway / Fly.io (For persistent server backend)**:
  - Build command: `npm run build`
  - Start command: `npm start`
  - Port: `3000`

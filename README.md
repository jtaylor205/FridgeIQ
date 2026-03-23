# FridgeIQ

FridgeIQ is a MERN stack web app that lets users track their fridge contents, monitor expiration dates, scan food labels, import items directly from grocery orders, and get meal suggestions based on what they have.

## Team Cool Cats — CIS4930

| Name | Role |
|------|------|
| Lucas Mach | Team Captain |
| Jaedon Taylor | Frontend / Skeleton |
| Eric Wang | |
| Taebok Joseph Kim | |
| Pablo Sabogal | |

---

## Stack

- **Frontend:** React (Vite), React Router, CSS Modules
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (Bearer token)

---

## Project Structure

```
FridgeIQ/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── common/       # Navbar, ProtectedRoute, LoadingSpinner
│       │   ├── fridge/       # FridgeShelf, FridgeItem, AddItemModal, ItemDetailModal
│       │   ├── scanner/      # ImageUploader, ScanResults
│       │   ├── expiration/   # ExpirationAlert
│       │   └── meals/        # MealCard
│       ├── context/          # AuthContext, FridgeContext
│       ├── pages/            # One file per route
│       ├── services/         # Axios wrappers for each API area
│       └── utils/            # dateHelpers
│
└── server/                   # Express backend
    ├── config/               # MongoDB connection
    ├── controllers/          # Business logic per feature
    ├── middleware/            # JWT auth, error handler
    ├── models/               # User, Fridge, FridgeItem (Mongoose)
    ├── routes/               # Express routers
    ├── services/             # grocerySimulator (swap for real API later)
    └── utils/                # sendEmail (Nodemailer)
```

---

## Pages / Routes

| Route | Page | Auth |
|-------|------|------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/fridge` | Fridge View | Protected |
| `/scan` | Food Scanner | Protected |
| `/expiration` | Expiration Alerts | Protected |
| `/meals` | Meal Planner | Protected |
| `/import` | Grocery Import | Protected |
| `/profile` | Profile | Protected |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/fridge` | Get fridge + all items |
| POST | `/api/fridge/items` | Add item |
| PUT | `/api/fridge/items/:id` | Update item |
| DELETE | `/api/fridge/items/:id` | Remove item |
| POST | `/api/scanner/scan` | Scan food label image |
| GET | `/api/expiration/alerts` | Get expiration alert groups |
| GET | `/api/meals/suggestions` | Get meal suggestions |
| GET | `/api/grocery/orders` | Get simulated grocery orders |
| POST | `/api/grocery/import` | Bulk-import items from order |
| POST | `/api/grocery/connect` | Connect grocery account |
| POST | `/api/grocery/disconnect` | Disconnect grocery account |

---

## Getting Started

### Viewing the skeleton (no setup required)

The frontend runs entirely on mock data — no backend, no `.env`, no database needed.

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 — any email/password will log you in.

---

### Full stack (when the backend is ready)

```bash
# 1. Configure environment
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, and any API keys

# 2. Install everything
npm install          # installs concurrently at root
npm run install:all  # installs server + client deps

# 3. Run both
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

---

### Switching from mock to real API

Each file in `client/src/services/` has the real API call commented out directly above the mock. When the backend is ready, swap them out one service at a time.

---

## Integration Points (for teammates to build out)

- **Food Scanner** (`server/controllers/scannerController.js`) — connect to a vision/nutrition API (Nutritionix, Open Food Facts, or Google Vision) and return real parsed data.
- **Meal Planner** (`server/controllers/mealController.js`) — call a recipe API (Spoonacular or Edamam) with the user's ingredient list.
- **Grocery Import** (`server/services/grocerySimulator.js`) — replace simulated orders with a real Instacart or store API once OAuth is set up.
- **Expiration Emails** (`server/utils/sendEmail.js`) — configure Nodemailer and add a scheduled job (e.g. node-cron) to send daily digests.
- **Shared Fridges** — model is ready (`Fridge.members`); needs UI + invite flow.

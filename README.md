# FridgeIQ

FridgeIQ is a MERN app for tracking fridge items, expiration dates, scanned labels, grocery imports, and meal suggestions.

Live site: [fridge-iq-seven.vercel.app](https://fridge-iq-seven.vercel.app)

## Team Cool Cats - CIS4930

| Name | Role |
|------|------|
| Lucas Mach | Team Captain |
| Jaedon Taylor | Full-Stack |
| Eric Wang | Full-Stack |
| Taebok Joseph Kim | Full-Stack |
| Pablo Sabogal | Full-Stack |

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
    ├── services/             # grocerySimulator
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

### Full stack with MongoDB Atlas

Create an Atlas cluster, create a database user, allow your IP in `Network Access`, then set `MONGO_URI` in `.env`:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.enjs5ra.mongodb.net/fridgeiq?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRE=7d
PORT=5000
```

Then run:

```powershell
npm install
npm run install:all
npm run dev
```

---

### Authentication flow

1. Register at `/register` or sign in at `/login`.
2. The backend returns a JWT and the current user.
3. The client stores the JWT in `localStorage` under `token`.
4. Axios sends `Authorization: Bearer <token>` automatically on API requests.
5. Refreshing the page restores the session through `/api/auth/me`.

---

### Current MongoDB-backed features

- User accounts
- Login sessions via JWT
- Fridge creation on registration
- Fridge item CRUD
- Expiration alerts
- Meal suggestions derived from fridge items
- Grocery connection state and imports
- Scanner upload metadata

---

## Environment Variables

Required:

```env
MONGO_URI=
JWT_SECRET=
JWT_EXPIRE=7d
PORT=5000
```

Optional integrations:

```env
NUTRITION_API_KEY=
NUTRITION_API_HOST=trackapi.nutritionix.com
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@fridgeiq.com
```

---

## Integration notes

- **Food Scanner** (`server/controllers/scannerController.js`) - uses Vision + UPC lookups.
- **Meal Planner** (`server/controllers/mealController.js`) - uses Spoonacular based on fridge ingredients.
- **Grocery Import** (`server/services/grocerySimulator.js`) - currently uses simulated order data.
- **Expiration Emails** (`server/utils/sendEmail.js`) - sent with Nodemailer from the backend scheduler.
- **Shared Fridges** - data model exists (`Fridge.members`), UI/invite flow still needed.

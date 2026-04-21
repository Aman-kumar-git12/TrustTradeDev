# 🚀 TrustTrade — Business Buying & Selling Platform


TrustTrade is a full-stack **B2B & B2C marketplace** where sellers list businesses or digital assets, and buyers can discover, negotiate, pay, and close deals through a **secure, structured, and transparent system**.

The platform is designed to solve the problem of **unstructured, unsafe, and untracked business transactions** commonly found on traditional listing websites.


## 🌍 Live Demo

A short walkthrough showing how TrustTrade works end-to-end.

▶ Watch Demo: https://youtu.be/1Q_1-1Q_1Q1
- **Frontend (Vercel):** https://trust-trade-dev.vercel.app/home  
- **Backend (Render):** https://trusttrade-6d81.onrender.com



## 🔑 Demo Accounts

To explore the platform without signing up, use the demo credentials below.

### Buyer Account
- Email: user@gmail.com
- Password: password123

### Seller Account
- Email: sarah@techsell.com
- Password: password123

### Admin Account
- Email: aman@gmail.com
- Password: password123

> ⚠️ Demo accounts are for evaluation only.  
> Some actions (real payments, destructive updates) may be restricted.



# Follow this steps to run this project 

> ⚠️ **Note:** The backend is hosted on Render (free tier), so the first request may take **30–40 seconds** due to cold start.
>
> If the page does not load:
> 1. Refresh the page once.
> 2. If it still doesn’t load, **close the tab and reopen the link**.
> 3. Repeat this 2–3 times if needed.
>
> This happens because the server wakes up on the first request. Please be patient.


## 📌 Table of Contents

- Overview
- Problem Statement
- Solution
- Core Features
- Buyer Features
- Seller Features
- Payments & Billing
- Analytics
- Tech Stack
- System Architecture
- Authentication Flow
- Getting Started
- Folder Structure
- What I Learned
- Future Enhancements


## 🧩 Problem Statement

Most existing marketplaces (such as OLX or Facebook groups) only support:
- Posting listings
- Random buyer messages
- No negotiation tracking
- No trust or credibility system
- No analytics or deal closure visibility

### This results in:
- Fake or low-intent buyers
- No structured deal tracking
- No seller performance metrics
- Poor user experience
- No platform built for **real business transactions**

---


## 💡 Solution

TrustTrade provides a **complete transaction ecosystem** for buying and selling businesses:

- Sellers can create and manage businesses
- Buyers can browse, filter, and negotiate
- Real-time chat with negotiation history
- Secure payments and verified deal closure
- Downloadable bills for buyers and sellers
- Seller performance dashboards and analytics

**Conceptually:**



## ⭐ Buyer Credibility & Rewards

TrustTrade uses a **credibility-based buyer profile system** that improves through real platform activity.

A buyer’s credibility increases when they:
- Actively participate in negotiations
- Respond quickly to sellers
- Successfully complete deals

As credibility increases, the buyer’s **Elite Score** improves.

### Elite Score Benefits
- Unlocks platform-funded discounts
- Grants access to premium features
- Improves buyer visibility to sellers

> Seller earnings are **never affected** — all discounts are covered internally by TrustTrade.

### Trust Badges
Buyers earn visible trust badges such as:
- Verified Buyer
- High Completion
- Elite Trader

These badges help sellers instantly identify **serious, high-intent buyers** and avoid time-wasters.

---

## 🏢 Seller Insights & Performance Dashboard

TrustTrade provides sellers with a **powerful, interactive analytics dashboard** that offers complete visibility into their business performance.

Sellers can analyze:
- Overall business performance
- Individual product or asset performance
- Buyer engagement and behavior
- Negotiation activity and lead quality

### Actionable Insights
The dashboard highlights:
- Buyer interest trends
- Negotiation success rates
- Listing health and visibility
- Pricing effectiveness

These insights help sellers **price more accurately, focus on high-quality buyers, and close deals faster**.



## 🧠 Core Features

- JWT-based authentication with HttpOnly cookies
- Role-based protected routes (Buyer / Seller)
- Secure session handling
- Business and digital asset creation & management
- Real-time buyer–seller chat system
- Structured negotiation flow with full history tracking
- Message delivery and read status tracking
- Secure payment integration with backend verification
- Auto-generated downloadable bills for buyers and sellers
- Transaction history and deal completion tracking
- Interactive analytics and performance dashboards



## 🛒 Buyer Features

- Discover businesses
- Filter and search listings
- Negotiate with sellers
- View deal history
- Message delivery status


# 🎨 Theme and Interface

TrustTrade supports three UI themes:
- Light
- Dark
- Bluish (custom)

The default theme is optimized for long sessions and low-light use. For best clarity, increasing screen brightness is recommended.


## 🧱 Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Routing:** React Router
- **State Management:** Context API (Auth, Theme, UI state)
- **HTTP Client:** Axios (with interceptors)
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (stored in HttpOnly cookies)
- **File Storage:** Cloudinary
- **Middleware:** Custom auth & role-based access control

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas


# ⚛️ Frontend Architecture — TrustTrade

The frontend is built with **React (Vite)** using a modular, component-based architecture.

## Architecture Flow

## State Management

- **Context API** for global state:
  - Authentication
  - Theme (Light / Dark / Bluish)
  - Shared UI state (modals, loaders)

- Local state handled using React hooks.

## Key Hooks Used
- `useState` — component state
- `useEffect` — lifecycle & data fetching
- `useContext` — global state access
- `useRef` — DOM interactions
- `useMemo` / `useCallback` — performance optimization

## UI & Styling
- Tailwind CSS for styling
- Framer Motion for animations


# 🧠 Backend Architecture — TrustTrade

The backend is built with **Node.js and Express.js** using a layered architecture.

## Architecture Flow


## Core Responsibilities
- JWT authentication (HttpOnly cookies)
- Role-based access control (Buyer / Seller)
- Business, asset, and negotiation management
- Secure payment verification
- Invoice generation (Buyer & Seller)
- Transaction & sales record management

## Data Layer
- MongoDB with Mongoose schemas
- Structured models for users, assets, deals, and sales



## 📈 What I Learned

- Designing a complete full-stack marketplace architecture
- Implementing secure JWT authentication with HttpOnly cookies
- Managing multi-role access (Buyer, Seller, Admin)
- Building real-time chat and negotiation systems
- Designing scalable REST APIs
- Modeling transactions, invoices, and analytics in MongoDB
- Handling production deployment and environment constraints
- Building role-based dashboards (Buyer, Seller, Admin)

---

## 🔮 Future Enhancements

- Escrow and milestone-based payments
- Advanced admin controls and moderation tools
- AI-driven pricing and deal recommendations
- Fraud detection and risk scoring
- Dispute resolution and refund handling



## 🏁 Getting Started

### Requirements
- Node.js (v14+)
- npm or yarn

### Setup

Clone the repository and install dependencies:

git clone <repository-url>
cd vite-project
npm install


# Frontend
VITE_BACKEND_URL=http://localhost:5001

# Backend
DATABASE_URL=
JWT_SECRET_KEY=
FRONTEND_URL=
CLOUD_NAME=
CLOUD_KEY=
CLOUD_SECRET=



## 📁 Folder Structure

### Frontend

Frontend/
├── src/
│   ├── assets/             # Images, animations, and static illustrations
│   ├── components/         # Reusable UI components
│   │   ├── shimmers/       # Loading skeletons for different UI parts
│   │   ├── Navbar.jsx      # Main Navigation (includes the new Mobile Hamburger)
│   │   ├── ProtectedRoute.jsx # Role-based access handler
│   │   ├── Filter.jsx      # Generic filter logic
│   │   └── ...             # Modals, SNACKBARS, etc.
│   ├── context/            # Global State Management (Context API)
│   │   ├── AuthContext.jsx # User session and authentication logic
│   │   ├── ThemeContext.jsx# Dark/Bluish/Light theme orchestration
│   │   └── UIContext.jsx   # Shared UI states (Modals, Confirmations)
│   ├── pages/              # 27+ Page-level components (Routes)
│   │   ├── Home.jsx        # Authenticated home feed
│   │   ├── Landing.jsx     # Public landing page
│   │   ├── Marketplace.jsx # Business listing discovery
│   │   ├── SellerLeads.jsx # Negotiation and chat management
│   │   ├── BuyerInsights.jsx # Buyer-specific analytics
│   │   └── ...             # Analytics, Profile, and Detail views
│   ├── utils/              # Helper functions
│   │   └── api.js          # Centralized Axios configuration (Interceptors)
│   ├── App.jsx             # Main Router and Theme Layout
│   ├── index.css           # Global Base CSS & Tailwind Layers
│   └── main.jsx            # Entry point
├── tailwind.config.js      # Custom theme & plugin configuration
├── vite.config.js          # Vite build configuration
├── package.json            # Dependencies and Project Scripts
└── .env                    # Environment Variables (API URLs)
    
### Backend

Backend/
├── src/
│   ├── config/             # Configuration files (Database connection, etc.)
│   │   └── db.js           # MongoDB connection logic using Mongoose
│   ├── controllers/        # Business logic for each route
│   │   ├── authController.js # Signup, Login, Profile logic
│   │   ├── assetController.js# Business & Asset CRUD operations
│   │   ├── seller/         # Seller-specific logic (Leads, Listings)
│   │   └── buyer/          # Buyer-specific logic (Insights, Deals)
│   ├── routes/             # API Endpoint definitions
│   │   ├── authRoutes.js   # /auth path routes
│   │   ├── assetRoutes.js  # /assets path routes
│   │   ├── seller/         # /seller path nested routes
│   │   └── buyer/          # /buyer path nested routes
│   ├── models/             # Mongoose Schemas (Database Models)
│   │   ├── User.js         # User profiles & credentials
│   │   ├── Asset.js        # Listings/Products
│   │   ├── Business.js     # Seller businesses
│   │   ├── Interest.js     # Buyer leads/negotiations
│   │   └── Sales.js        # Transaction records
│   ├── middleware/         # Custom request handlers
│   │   ├── authMiddleware.js # JWT verification
│   │   └── roleMiddleware.js # Seller/Buyer access control
│   ├── cloudinary/         # Image upload & storage integration
│   │   ├── multer.js       # File upload middleware
│   │   └── controller.js   # Cloudinary upload helpers
│   ├── services/           # External services & complex logic (Analytics)
│   ├── utils/              # Helper functions & constants
│   ├── app.js              # Express app initialization (Middleware, Routes)
│   └── server.js           # Server entry point (Port listening)
├── package.json            # Node.js dependencies & scripts
└── .env                    # Secret keys (DB URL, JWT Secret, Cloudinary API)

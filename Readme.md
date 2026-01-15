# 🚀 TrustTrade — Business Buying & Selling Platform

A full-stack B2B & B2C marketplace where sellers list their businesses and digital assets, and buyers can discover, negotiate, and close deals in real time through a secure and transparent system.

This platform is built to solve the problem of unstructured, unsafe, and untracked business transactions that exist on traditional listing websites.


# 🌍 Live Demo
Frontend (Vercel): https://trust-trade-dev.vercel.app/home
Backend (Render): https://trusttrade-6d81.onrender.com


# Follow this steps to run this project 

1. When you open the website for the first time and it doesn’t load, refresh the page once.
2. If it still doesn’t load, close the tab and reopen the link. Repeat this 2–3 times if needed.
3. Make sure you have a stable and active internet connection.
4. The first request may take some time because the server is waking up — please be patient while the page loads.
5. Since images are loaded from the server, they may take a short time to appear, especially on slower connections.


# 🧩 Problem Statement

Most existing marketplaces like OLX or Facebook groups only allow:
- Posting listings
- Random buyer messages
- No negotiation tracking
- No business analytics
- No trust system

This causes:
- Fake buyers
- No deal closure tracking
- No seller performance metrics
- Poor user experience
- No platform built for real business transactions


# 💡 Solution

TrustTrade provides a complete transaction ecosystem for business selling:
- Sellers can create and manage businesses
- Buyers can browse, filter, and contact sellers
- Real-time negotiation chat
- Seller performance dashboards
- Secure authentication
- Structured deal flow

It works like:
Shopify + OLX + WhatsApp for business trading


# ⭐ Extras for Buyers

TrustTrade allows buyers to build a credibility-based profile that improves with real activity. As buyers participate in negotiations, respond quickly, and complete deals, their profile upgrades and their Elite Score increases.

A higher Elite Score unlocks discounts and premium access. These discounts never reduce seller earnings — TrustTrade covers them internally so sellers always receive full value.

Buyers also earn trust badges such as Verified Buyer, High Completion, and Elite Trader, allowing sellers to instantly identify serious buyers and avoid time-wasters.


# 🏢 Extras for Sellers

TrustTrade provides sellers with a powerful, interactive dashboard that gives full visibility into their business.

Sellers can analyze:
- Overall business performance
- Individual products or assets
- Customer and buyer behavior

These insights show buyer interest, negotiation activity, product performance, and listing health, helping sellers price better and close deals faster with high-confidence buyers.


# 🧠 Core Features

- JWT-based authentication
- Secure HttpOnly cookies
- Protected routes
- Business creation and management
- Real-time buyer-seller chat
- Negotiation history
- Message status tracking
- Interactive visual dashboards


#  🛒 Buyer Features

- Discover businesses
- Filter and search listings
- Negotiate with sellers
- View deal history
- Message delivery status


# 📊 Analytics

- Total listings
- Conversion rate
- Average listing lifecycle
- Revenue tracking
- Business and product-level performance


# 🎨 Theme and Interface

TrustTrade supports three UI themes:
- Light
- Dark
- Bluish (custom)

The default theme is optimized for long sessions and low-light use. For best clarity, increasing screen brightness is recommended.


# 🧱 Tech Stack

Frontend:
React (Vite), Tailwind CSS, Framer Motion, Axios, React Router, Context API

Backend:
Node.js, Express, MongoDB, Mongoose, JWT

Deployment:
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas


# 🏗️ System Architecture

React Client
→ Axios and WebSockets
→ Express API
→ Authentication and Business Logic
→ MongoDB


🔐 Authentication Flow

User logs in
→ Server creates JWT
→ Token stored in HttpOnly cookies
→ Each request is verified
→ Unauthorized access is blocked


# 📈 What I Learned

- Full-stack architecture
- Secure authentication
- Real-time systems
- API design
- Database modeling
- Production deployment
- Business analytics dashboards


# 🔮 Future Enhancements

- Stripe payments
- Escrow system
- Admin panel
- AI-based pricing suggestions
- Fraud detection
- Dispute resolution


# 🏁 Getting Started

Follow the steps below to run the project on your machine.

✅ Requirements
Node.js (v14+)
npm or yarn

📥 Installation

Clone the repository -> git clone <repository-url> -> cd vite-project

Install dependencies -> npm install


🔑 Environment Variables

Create a .env file in the project root:

# Frontend

- VITE_BACKEND_URL="http://localhost:2001"
▶ Run Development Server -> npm run dev
🏗 Create Production Build -> npm run build

# Backend

- DATABASE_URL
- JWT_SECRET_KEY
- FRONTEND_URL
- CLOUD_NAME
- CLOUD_KEY
- CLOUD_SECRET


# 📁 Folder Structure 

# Frontend

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
    
# Backend

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
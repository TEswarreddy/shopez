# ShopEz - E-Commerce Platform

A comprehensive full-stack e-commerce platform built with Node.js/Express backend and React frontend, featuring role-based access control for customers, vendors, and admins.

## 🎯 Project Overview

ShopEz is a modern e-commerce solution that provides:
- **Customer Portal**: Browse products, manage cart, place orders, track deliveries
- **Vendor Dashboard**: Manage products, view orders, analytics, and sales metrics
- **Admin Panel**: Manage users, vendors, products, and monitor platform activity

## 🏗️ Project Structure

```
shopez/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middlewares/  # Auth & error handling
│   │   ├── utils/        # Helper functions
│   │   └── config/       # Database config
│   ├── server.js         # Entry point
│   └── package.json
│
├── frontend/             # React Vite application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin management pages
│   │   │   ├── vendor/   # Vendor dashboard & actions
│   │   │   ├── user/     # Customer pages
│   │   │   ├── auth/     # Login/Register pages
│   │   │   ├── help/     # Help pages
│   │   ├── components/   # Reusable components
│   │   ├── api/          # API services
│   │   ├── context/      # React Context
│   │   └── App.jsx       # Main app component
│   ├── package.json
│   └── vite.config.js
│
└── Documentation files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account with connection string
- npm or yarn package manager

### Backend Setup

```bash
cd backend
npm install

# Configure environment variables
# Create .env file with:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

npm start
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Configure API endpoint in src/api/axios.js if needed
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔐 Authentication & Authorization

### User Roles
- **Customer**: Browse products, place orders, manage profile
- **Vendor**: Manage products and orders, view analytics
- **Admin**: Full platform management and monitoring

### Login URLs
- Admin: `/admin-access/login`
- Vendor: `/vendor/login`
- Customer: `/login`

### Test Credentials
```
Admin:
Email: superadmin@shopez.com
Password: admin123
Level: super_admin
```

## 📋 Key Features

### Customer Features
- ✅ Product browsing and search
- ✅ Shopping cart management
- ✅ Order placement with Razorpay payment
- ✅ Order tracking
- ✅ Wishlist management
- ✅ Product reviews and ratings
- ✅ User profile management

### Vendor Features
- ✅ Product management (add, edit, delete)
- ✅ Order management with status updates
- ✅ Sales analytics and reporting
- ✅ Performance metrics dashboard
- ✅ Inventory management
- ✅ Revenue tracking

### Admin Features
- ✅ Admin user management
- ✅ Vendor management and verification
- ✅ Customer management
- ✅ Product management
- ✅ Order management
- ✅ Platform analytics and reporting
- ✅ Permission-based access control (22 granular permissions)

## 🛣️ API Routes

### Public Routes
```
GET  /                          # Home page
GET  /product/:id               # Product details
GET  /search                    # Product search
```

### Authentication Routes
```
POST /api/auth/customer/signup  # Customer registration
POST /api/auth/login            # Customer login
POST /api/auth/vendor/signup    # Vendor registration
POST /api/auth/vendor/login     # Vendor login
POST /api/auth/admin/login      # Admin login
```

### Customer Routes (Protected)
```
GET  /api/products              # All products
GET  /api/cart                  # View cart
POST /api/cart                  # Add to cart
PUT  /api/cart/items/:id        # Update cart item
DELETE /api/cart/items/:id      # Remove from cart
POST /api/orders                # Place order
GET  /api/orders                # View orders
GET  /api/wishlist              # View wishlist
```

### Vendor Routes (Protected)
```
GET  /api/vendor/dashboard/stats     # Dashboard metrics
GET  /api/vendor/products            # Vendor's products
POST /api/vendor/products            # Create product
PUT  /api/vendor/products/:id        # Update product
DELETE /api/vendor/products/:id      # Delete product
GET  /api/vendor/orders              # Vendor's orders
PUT  /api/vendor/orders/:id/status   # Update order status
GET  /api/vendor/analytics           # Analytics data
```

### Admin Routes (Protected)
```
GET  /api/admin/dashboard/stats      # Admin dashboard
GET  /api/admin/users                # Manage users
GET  /api/admin/vendors              # Manage vendors
GET  /api/admin/customers            # Manage customers
GET  /api/admin/products             # Manage products
GET  /api/admin/orders               # Manage orders
PUT  /api/admin/users/:id/status     # Update user status
```

## 🗄️ Database Schema

### Collections
- **Users**: Core user data with role-based access
- **Admin**: Admin profiles with permission flags
- **Vendors**: Vendor business information
- **Customers**: Customer profile extension
- **Products**: Product inventory with vendor reference
- **Orders**: Order records with items and status
- **Cart**: Shopping cart with items
- **Wishlist**: Saved products
- **Reviews**: Product reviews and ratings

## 🎨 Frontend Routes

### Public Routes
```
/                    # Home
/product/:id         # Product details
/search              # Search page
/about               # About us
/careers             # Career opportunites
/help/*              # Help pages (payments, shipping, etc.)
/policies/*          # Policy pages (terms, privacy)
```

### Customer Routes
```
/login               # Customer login
/register            # Customer registration
/cart                # Shopping cart
/checkout            # Checkout page
/orders              # Order history
/profile             # User profile
/wishlist            # Wishlist
```

### Vendor Routes
```
/vendor/login        # Vendor login
/vendor/register     # Vendor registration
/vendor/dashboard    # Dashboard with metrics
/vendor/products     # Product management
/vendor/orders       # Order management
/vendor/analytics    # Sales analytics
```

### Admin Routes
```
/admin-access/login  # Admin login
/admin/dashboard     # Admin dashboard
/admin/admins        # Manage admins
/admin/vendors       # Manage vendors
/admin/customers     # Manage customers
/admin/products      # Manage products
/admin/orders        # Manage orders
```

## 🔧 Configuration

### Environment Variables (Backend)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend Configuration

Configuration is handled in `src/api/axios.js`:
```javascript
const BASE_URL = "http://localhost:5000"
```

## 📊 Admin Dashboard Features

- Permission-based statistics
- Vendor verification status
- Customer metrics
- Product inventory overview
- Order management system
- User activity tracking

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Protected API endpoints
- CORS configuration
- Input validation and sanitization
- Error handling middleware

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for styling
- Responsive breakpoints (mobile, tablet, desktop)
- Optimized for all screen sizes

## ⚙️ Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Razorpay payment gateway

### Frontend
- React 18+
- Vite build tool
- Tailwind CSS
- React Router v6
- Axios for API calls
- Context API for state management

## 🧪 Testing

### Manual Testing
- Use Postman collection: `ShopEz_API_Collection.postman_collection.json`
- Test user signup and login
- Create test products
- Place test orders
- Update order status

### API Health Check
```bash
# Backend status
curl http://localhost:5000

# Frontend status
curl http://localhost:5173
```

## 📝 Documentation Files

- `API_DOCUMENTATION.md` - Complete API reference
- `FRONTEND_SETUP_GUIDE.md` - Frontend setup instructions
- `RAZORPAY_INTEGRATION_GUIDE.md` - Payment integration guide
- `QUICK_REFERENCE.md` - Quick command reference
- `PROJECT_COMPLETE.md` - Project completion checklist

## 🐛 Troubleshooting

### Backend Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check MongoDB connection
# Verify MONGODB_URI in .env file

# Kill existing processes
taskkill /F /IM node.exe
```

### Frontend Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Check CORS configuration
```

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review API responses and error messages
3. Check browser console for client-side errors
4. Check server logs for backend errors

## 📄 License

This project is proprietary and for internal use only.

## 👥 Team

Developed as a comprehensive e-commerce platform showcasing full-stack development capabilities.

---

**Project Status**: ✅ Complete and Production Ready

**Last Updated**: February 12, 2026

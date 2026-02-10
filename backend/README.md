# ShopEz - Multi-Vendor Ecommerce Platform

A comprehensive multi-vendor ecommerce platform built with Node.js, Express, and MongoDB.

## Features Implemented

### ✅ Authentication
- User Registration & Login
- JWT-based authentication
- Role-based access (Customer, Vendor, Admin)
- Password hashing with bcryptjs
- Profile management

### ✅ Products
- Product creation & management
- Search & filtering (by category, price range, vendor)
- Stock management
- Product images support
- Tag-based organization

### ✅ Shopping Experience
- Shopping cart (add, remove, update quantity, clear)
- Wishlist (add, remove items)
- Product reviews & ratings (with verified purchase badge)

### ✅ Orders
- Order placement
- Multi-vendor cart (items grouped by vendor)
- Order status tracking (pending → processing → shipped → delivered)
- Payment status tracking
- Order history

### ✅ Admin Dashboard
- Dashboard statistics (users, vendors, products, orders, revenue)
- User management
- Vendor verification
- Order management
- Product moderation

### ✅ Vendor Tools
- Vendor shop management
- Product listing and management
- Order management and tracking
- Vendor statistics

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema (customer, vendor, admin)
│   │   ├── Product.js           # Product schema
│   │   ├── Order.js             # Order schema
│   │   ├── Review.js            # Product review schema
│   │   ├── Cart.js              # Shopping cart schema
│   │   └── Wishlist.js          # Wishlist schema
│   ├── controllers/
│   │   ├── authController.js    # Auth logic (signup, login, profile)
│   │   ├── productController.js # Product CRUD
│   │   ├── orderController.js   # Order management
│   │   ├── cartController.js    # Cart operations
│   │   ├── wishlistController.js# Wishlist operations
│   │   ├── reviewController.js  # Review management
│   │   └── adminController.js   # Admin operations
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   ├── orderRoutes.js       # Order endpoints
│   │   ├── cartRoutes.js        # Cart endpoints
│   │   ├── wishlistRoutes.js    # Wishlist endpoints
│   │   ├── reviewRoutes.js      # Review endpoints
│   │   └── adminRoutes.js       # Admin endpoints
│   ├── middlewares/
│   │   ├── auth.js              # JWT validation & role check
│   │   └── errorHandler.js      # Error handling
│   └── app.js                   # Express app setup
├── server.js                    # Server entry point
├── package.json
└── .env                         # Environment variables
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables** (`.env`)
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/shopez
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   STRIPE_API_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret
   NODE_ENV=development
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product (vendor only)
- `DELETE /api/products/:id` - Delete product (vendor only)

### Cart
- `GET /api/cart` - Get cart (protected)
- `POST /api/cart/add` - Add to cart (protected)
- `POST /api/cart/remove` - Remove from cart (protected)
- `PUT /api/cart/update` - Update item quantity (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Wishlist
- `GET /api/wishlist` - Get wishlist (protected)
- `POST /api/wishlist/add` - Add to wishlist (protected)
- `POST /api/wishlist/remove` - Remove from wishlist (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id` - Update order status (vendor/admin only)

### Reviews
- `POST /api/reviews/:productId` - Create review (protected)
- `GET /api/reviews/:productId` - Get product reviews
- `PUT /api/reviews/:reviewId` - Update review (protected)
- `DELETE /api/reviews/:reviewId` - Delete review (protected)

### Admin
- `GET /api/admin/stats` - Dashboard stats (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/verify-vendor/:vendorId` - Verify vendor (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/deactivate-product/:productId` - Deactivate product (admin only)

## Authentication Flow

All protected routes require JWT token in the header:
```
Authorization: Bearer <token>
```

User roles:
- **customer**: Standard user account
- **vendor**: Can create/manage products and orders
- **admin**: Full platform access

## Database Models

### User
- firstName, lastName, email (unique)
- password (hashed)
- phone, role (customer/vendor/admin)
- shop details (for vendors)
- address, profileImage
- isActive, timestamps

### Product
- name, description, category
- price, originalPrice, discount
- stock, images
- vendor (reference to User)
- ratings (average, count)
- reviews (array of Review IDs)
- tags, isActive

### Order
- orderNumber (unique)
- customer (reference to User)
- items (array with product, vendor, quantity, price, status)
- totalAmount, shippingAddress
- paymentMethod, paymentStatus
- transactionId, status
- timestamps

### Review
- product, customer (references)
- rating (1-5), title, comment
- verified (True if customer purchased)
- helpful count, timestamps

### Cart
- customer (unique reference)
- items (product, quantity)
- totalPrice

### Wishlist
- customer (unique reference)
- products (array of product references)

## Next Steps

### Phase 2 - Payment Integration
- [ ] Stripe integration
- [ ] PayPal integration
- [ ] Order confirmation emails
- [ ] Payment webhook handlers

### Phase 3 - Frontend (React)
- [ ] User authentication UI
- [ ] Product catalog & search
- [ ] Shopping cart UI
- [ ] Checkout & payment
- [ ] Order tracking
- [ ] Vendor dashboard
- [ ] Admin dashboard

### Phase 4 - Additional Features
- [ ] Product categories management
- [ ] Advanced filtering & recommendations
- [ ] Seller ratings & reviews
- [ ] Dispute resolution system
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Analytics & reporting

## Testing with Postman/Insomnia

1. **Register User**
   ```
   POST http://localhost:5000/api/auth/signup
   Body: {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login & Get Token**
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "john@example.com",
     "password": "password123"
   }
   Response includes: token (copy this)
   ```

3. **Create Product (with vendor token)**
   ```
   POST http://localhost:5000/api/products
   Headers: Authorization: Bearer <token>
   Body: {
     "name": "Sample Product",
     "description": "This is a sample product",
     "category": "Electronics",
     "price": 99.99,
     "stock": 50
   }
   ```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/shopez |
| JWT_SECRET | JWT signing secret | mysecretkey123 |
| JWT_EXPIRE | JWT expiration time | 7d |
| STRIPE_API_KEY | Stripe publishable key | pk_test_... |
| STRIPE_SECRET_KEY | Stripe secret key | sk_test_... |
| NODE_ENV | Environment | development/production |

## Error Handling

All errors return JSON with:
```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Time to Build

- Backend API: ✅ Complete
- 10 Days Timeline:
  - Days 1-2: Backend (Done)
  - Days 3-5: Frontend (Next)
  - Days 6-8: Payment Integration
  - Days 9-10: Testing & Deployment

## Contributing

Follow these guidelines:
1. Create feature branches
2. Write clear commit messages
3. Test thoroughly before pushing
4. Update documentation

## License

ISC

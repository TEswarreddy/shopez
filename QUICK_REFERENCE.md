# ShopEz Quick Reference Guide

## 🚀 QUICK START

### Start Backend
```bash
cd backend
npm install
npm run dev
```
Server: `http://localhost:5000`

---

## 📝 DATABASE

### MongoDB Compass Connection
```
mongodb+srv://shopez_db_user:cjw4MUTlmMrVfrto@shopez.dqmntg9.mongodb.net/?retryWrites=true&w=majority&appName=shopez
```

### Reset Database (Delete all data)
```bash
# Connect to MongoDB and run:
db.dropDatabase()
```

---

## 🔑 AUTHENTICATION

### Get Auth Token
1. Sign up or login
2. Copy the `token` from response
3. Use as: `Authorization: Bearer <token>`

### User Roles
- **customer**: Can shop and review
- **vendor**: Can create/sell products
- **admin**: Full access

### JWT Secret (⚠️ Change in Production)
Current: `supersecretkey`
Change to random string: `openssl rand -hex 32`

---

## 📦 API QUICK REFERENCE

### Base URL
```
http://localhost:5000/api
```

### Popular Endpoints

**Auth**
```
POST   /auth/signup
POST   /auth/login
GET    /auth/profile
PUT    /auth/profile
```

**Products**
```
GET    /products?search=laptop&category=Electronics
GET    /products/:id
POST   /products
PUT    /products/:id
DELETE /products/:id
```

**Cart**
```
GET    /cart
POST   /cart/add
PUT    /cart/update
POST   /cart/remove
DELETE /cart/clear
```

**Orders**
```
POST   /orders
GET    /orders/my-orders
GET    /orders/:id
```

**Admin**
```
GET    /admin/stats
GET    /admin/users
GET    /admin/orders
```

---

## 🧪 TESTING CHECKLIST

### Test 1: Authentication
```
POST /auth/signup
Body: {"firstName":"Test","lastName":"User","email":"test@test.com","password":"test123"}
✓ Gets token
✓ User created in DB
```

### Test 2: Product Creation (Vendor)
```
POST /products
Headers: Authorization: Bearer <token>
Body: {"name":"Test","description":"Test","category":"Electronics","price":99.99,"stock":10}
✓ Product created
✓ Associated with vendor
```

### Test 3: Shopping Flow
```
GET    /products              ✓ Get products
POST   /cart/add              ✓ Add to cart
GET    /cart                  ✓ Verify in cart
POST   /orders                ✓ Create order
GET    /orders/my-orders      ✓ See order
```

### Test 4: Admin Function
```
GET    /admin/stats           ✓ Get dashboard stats (admin only)
```

---

## 📁 FILE STRUCTURE

### Controllers (Business Logic)
- `authController.js` - Login/signup
- `productController.js` - Product CRUD
- `orderController.js` - Order management
- `cartController.js` - Shopping cart
- `wishlistController.js` - Wishlists
- `reviewController.js` - Reviews
- `adminController.js` - Admin operations

### Models (Database)
- `User.js` - User accounts
- `Product.js` - Items for sale
- `Order.js` - Customer orders
- `Review.js` - Product reviews
- `Cart.js` - Shopping carts
- `Wishlist.js` - Saved items

### Routes (Endpoints)
- `authRoutes.js` - Auth endpoints
- `productRoutes.js` - Product endpoints
- `orderRoutes.js` - Order endpoints
- `cartRoutes.js` - Cart endpoints
- `wishlistRoutes.js` - Wishlist endpoints
- `reviewRoutes.js` - Review endpoints
- `adminRoutes.js` - Admin endpoints

---

## 🔧 ENVIRONMENT VARIABLES

All in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=supersecretkey
JWT_EXPIRE=7d
NODE_ENV=development
STRIPE_API_KEY=     # Optional
STRIPE_SECRET_KEY=  # Optional
```

### Change SECRET for Production
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add to .env
```

---

## 🐛 TROUBLESHOOTING

### "Cannot find module 'express'"
**Solution:** Run `npm install`

### "MongoDB connection failed"
**Solution:** 
1. Check MongoDB is running
2. Check MONGODB_URI is correct
3. Check network access in MongoDB Atlas

### "JWT token invalid"
**Solution:**
- Ensure token is in header as: `Authorization: Bearer <token>`
- Token might be expired

### "CORS error from frontend"
**Solution:** CORS is already enabled. Check:
- Frontend is on different port (3000 vs 5000)
- Authorization header format

### "Can't create product"
**Solution:**
- Must be vendor role
- All fields required: name, description, category, price, stock

### "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

---

## 📊 SAMPLE TEST DATA

### Create Vendor Account
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "vendor@test.com",
  "password": "test123",
  "role": "vendor"
}
```

### Create Product
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance laptop for gaming",
  "category": "Electronics",
  "price": 999.99,
  "stock": 20,
  "images": ["https://example.com/image.jpg"],
  "tags": ["laptop", "gaming"]
}
```

### Create Order
```json
{
  "items": [
    {"product": "<product_id>", "quantity": 1}
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

---

## 📈 SCALING OPERATIONS

### Add More Products
1. Create vendor account
2. Get vendor token
3. POST /products with product data

### Get All Orders (Admin)
```
GET /admin/orders?page=1&limit=10
Headers: Authorization: Bearer <admin_token>
```

### Get User Stats (Admin)
```
GET /admin/stats
Headers: Authorization: Bearer <admin_token>
```

---

## 🔐 SECURITY CHECKLIST

- [x] JWT authentication
- [x] Password hashing (bcryptjs)
- [x] Role-based access
- [x] CORS enabled
- [x] Error handling
- [ ] Rate limiting (add if needed)
- [ ] HTTPS (add in production)
- [ ] Input sanitization (add if needed)
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection (add helmet if needed)

### Add Helmet for Security
```bash
npm install helmet
# In app.js
const helmet = require('helmet');
app.use(helmet());
```

---

## 📚 USEFUL COMMANDS

```bash
# Start development
npm run dev

# Install new package
npm install <package-name>

# Install dev package
npm install --save-dev <package-name>

# Update packages
npm update

# Check outdated packages
npm outdated

# Clean install
rm -rf node_modules package-lock.json
npm install

# View logs
node --inspect server.js

# Run specific file
node src/config/database.js
```

---

## 🌐 CURL EXAMPLES

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products?search=laptop
```

### Create Product (with token)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","description":"Desc","category":"Category","price":99.99,"stock":10}'
```

### Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

---

## 📋 DAILY CHECKLIST

### Day 1-2 (Backend - ✅ DONE)
- [x] Setup Node.js project
- [x] Configure MongoDB
- [x] Create database models
- [x] Build authentication
- [x] Create API routes
- [x] Test endpoints
- [x] Write documentation

### Day 3-5 (Frontend - TODO)
- [ ] Create React app
- [ ] Build UI components
- [ ] Integrate API
- [ ] Test all flows
- [ ] Optimize performance

### Day 6-8 (Payments - TODO)
- [ ] Integrate Stripe
- [ ] Setup webhooks
- [ ] Test payments
- [ ] Email notifications

### Day 9-10 (Deploy - TODO)
- [ ] Production build
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Post-launch testing

---

## 🚀 NEXT COMMAND

Ready for React? Run this:
```bash
npm create vite@latest shopez-frontend -- --template react
```

Then follow FRONTEND_SETUP_GUIDE.md!

---

Good luck! 🎉

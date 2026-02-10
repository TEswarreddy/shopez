# ShopEz API - Postman Test Cases

## 🚀 Quick Setup

**Base URL:** `http://localhost:5000/api`

### Variables to Save (use Postman Environment)
- `base_url` = `http://localhost:5000/api`
- `customer_token` = (save after customer login)
- `vendor_token` = (save after vendor login)
- `admin_token` = (save after admin login)
- `product_id` = (save after creating product)
- `order_id` = (save after creating order)

---

## 📋 TEST SEQUENCE

### ✅ TEST 1: Customer Signup
**Method:** `POST`  
**Endpoint:** `{{base_url}}/auth/signup`

**Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "customer@test.com",
  "password": "test123",
  "role": "customer"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "customer@test.com",
    "role": "customer"
  }
}
```

**Action:** Copy the `token` and save as `customer_token` in environment

---

### ✅ TEST 2: Vendor Signup
**Method:** `POST`  
**Endpoint:** `{{base_url}}/auth/signup`

**Body (JSON):**
```json
{
  "firstName": "Mike",
  "lastName": "Vendor",
  "email": "vendor@test.com",
  "password": "test123",
  "role": "vendor"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "firstName": "Mike",
    "lastName": "Vendor",
    "email": "vendor@test.com",
    "role": "vendor"
  }
}
```

**Action:** Copy the `token` and save as `vendor_token`

---

### ✅ TEST 3: Admin Signup
**Method:** `POST`  
**Endpoint:** `{{base_url}}/auth/signup`

**Body (JSON):**
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@test.com",
  "password": "test123",
  "role": "admin"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

**Action:** Copy the `token` and save as `admin_token`

---

### ✅ TEST 4: Customer Login
**Method:** `POST`  
**Endpoint:** `{{base_url}}/auth/login`

**Body (JSON):**
```json
{
  "email": "customer@test.com",
  "password": "test123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "customer@test.com",
    "role": "customer"
  }
}
```

---

### ✅ TEST 5: Get User Profile
**Method:** `GET`  
**Endpoint:** `{{base_url}}/auth/profile`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "customer@test.com",
    "role": "customer",
    "createdAt": "..."
  }
}
```

---

### ✅ TEST 6: Update Profile
**Method:** `PUT`  
**Endpoint:** `{{base_url}}/auth/profile`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "phone": "+919876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  }
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "phone": "+919876543210",
    "address": {...}
  }
}
```

---

### ✅ TEST 7: Create Product (Vendor)
**Method:** `POST`  
**Endpoint:** `{{base_url}}/products`

**Headers:**
```
Authorization: Bearer {{vendor_token}}
```

**Body (JSON):**
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with A17 Pro chip",
  "category": "Electronics",
  "price": 129999,
  "stock": 50,
  "images": [
    "https://example.com/iphone1.jpg",
    "https://example.com/iphone2.jpg"
  ],
  "tags": ["iphone", "smartphone", "apple"]
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "...",
    "name": "iPhone 15 Pro",
    "price": 129999,
    "vendor": "..."
  }
}
```

**Action:** Copy the product `id` and save as `product_id`

---

### ✅ TEST 8: Create Another Product
**Method:** `POST`  
**Endpoint:** `{{base_url}}/products`

**Headers:**
```
Authorization: Bearer {{vendor_token}}
```

**Body (JSON):**
```json
{
  "name": "Samsung Galaxy S24",
  "description": "Flagship Samsung smartphone",
  "category": "Electronics",
  "price": 99999,
  "stock": 30,
  "images": ["https://example.com/galaxy.jpg"],
  "tags": ["samsung", "smartphone", "android"]
}
```

**Expected Response (201)**

---

### ✅ TEST 9: Get All Products (No Auth)
**Method:** `GET`  
**Endpoint:** `{{base_url}}/products`

**Query Params (optional):**
- `search=iphone`
- `category=Electronics`
- `minPrice=50000`
- `maxPrice=150000`
- `page=1`
- `limit=12`

**Expected Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": "...",
      "name": "iPhone 15 Pro",
      "price": 129999,
      "stock": 50,
      "vendor": {...},
      "ratings": {...}
    }
  ],
  "pagination": {
    "total": 2,
    "pages": 1,
    "currentPage": 1
  }
}
```

---

### ✅ TEST 10: Search Products
**Method:** `GET`  
**Endpoint:** `{{base_url}}/products?search=iphone&category=Electronics`

**Expected Response (200):**
Products matching search criteria

---

### ✅ TEST 11: Get Product Details
**Method:** `GET`  
**Endpoint:** `{{base_url}}/products/{{product_id}}`

**Expected Response (200):**
```json
{
  "success": true,
  "product": {
    "id": "...",
    "name": "iPhone 15 Pro",
    "description": "...",
    "price": 129999,
    "vendor": {...},
    "ratings": {...},
    "reviews": [...]
  }
}
```

---

### ✅ TEST 12: Update Product (Vendor)
**Method:** `PUT`  
**Endpoint:** `{{base_url}}/products/{{product_id}}`

**Headers:**
```
Authorization: Bearer {{vendor_token}}
```

**Body (JSON):**
```json
{
  "price": 119999,
  "stock": 45,
  "discount": 10
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "price": 119999,
    "stock": 45
  }
}
```

---

### ✅ TEST 13: Add to Cart (Customer)
**Method:** `POST`  
**Endpoint:** `{{base_url}}/cart/add`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "productId": "{{product_id}}",
  "quantity": 2
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "cart": {
    "items": [
      {
        "product": {...},
        "quantity": 2
      }
    ],
    "totalPrice": 239998
  }
}
```

---

### ✅ TEST 14: Get Cart
**Method:** `GET`  
**Endpoint:** `{{base_url}}/cart`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "cart": {
    "items": [...],
    "totalPrice": 239998
  }
}
```

---

### ✅ TEST 15: Update Cart Item Quantity
**Method:** `PUT`  
**Endpoint:** `{{base_url}}/cart/update`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "productId": "{{product_id}}",
  "quantity": 1
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Cart updated",
  "cart": {...}
}
```

---

### ✅ TEST 16: Add to Wishlist
**Method:** `POST`  
**Endpoint:** `{{base_url}}/wishlist/add`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "productId": "{{product_id}}"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "wishlist": {...}
}
```

---

### ✅ TEST 17: Get Wishlist
**Method:** `GET`  
**Endpoint:** `{{base_url}}/wishlist`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "wishlist": {
    "products": [...]
  }
}
```

---

### ✅ TEST 18: Create Order
**Method:** `POST`  
**Endpoint:** `{{base_url}}/orders`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "items": [
    {
      "product": "{{product_id}}",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "...",
    "orderNumber": "ORD-...",
    "totalAmount": 119999,
    "status": "pending",
    "paymentStatus": "pending"
  }
}
```

**Action:** Copy `order.id` and save as `order_id`

---

### ✅ TEST 19: Get My Orders
**Method:** `GET`  
**Endpoint:** `{{base_url}}/orders/my-orders`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": "...",
      "orderNumber": "ORD-...",
      "totalAmount": 119999,
      "status": "pending"
    }
  ]
}
```

---

### ✅ TEST 20: Get Order Details
**Method:** `GET`  
**Endpoint:** `{{base_url}}/orders/{{order_id}}`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "order": {
    "id": "...",
    "orderNumber": "ORD-...",
    "customer": {...},
    "items": [...],
    "totalAmount": 119999,
    "shippingAddress": {...},
    "status": "pending"
  }
}
```

---

### ✅ TEST 21: Create Razorpay Order
**Method:** `POST`  
**Endpoint:** `{{base_url}}/payment/create-order`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "amount": 119999,
  "currency": "INR",
  "receipt": "receipt_order_123"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "order": {
    "id": "order_xxxxxxxxxxxxx",
    "amount": 11999900,
    "currency": "INR",
    "receipt": "receipt_order_123",
    "status": "created"
  },
  "key_id": "rzp_test_xxxxxxxxxxxxx"
}
```

---

### ✅ TEST 22: Verify Payment (Simulate)
**Method:** `POST`  
**Endpoint:** `{{base_url}}/payment/verify`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "generated_signature_string",
  "orderId": "{{order_id}}"
}
```

**Note:** In real scenario, signature is generated by Razorpay frontend SDK

---

### ✅ TEST 23: Create Review
**Method:** `POST`  
**Endpoint:** `{{base_url}}/reviews/{{product_id}}`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "rating": 5,
  "title": "Excellent Product!",
  "comment": "Very satisfied with the purchase. Great quality and fast delivery."
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "id": "...",
    "rating": 5,
    "title": "Excellent Product!",
    "verified": true
  }
}
```

---

### ✅ TEST 24: Get Product Reviews
**Method:** `GET`  
**Endpoint:** `{{base_url}}/reviews/{{product_id}}`

**Expected Response (200):**
```json
{
  "success": true,
  "reviews": [
    {
      "id": "...",
      "rating": 5,
      "title": "Excellent Product!",
      "comment": "...",
      "customer": {...},
      "verified": true
    }
  ]
}
```

---

### ✅ TEST 25: Update Order Status (Vendor)
**Method:** `PUT`  
**Endpoint:** `{{base_url}}/orders/{{order_id}}`

**Headers:**
```
Authorization: Bearer {{vendor_token}}
```

**Body (JSON):**
```json
{
  "itemIndex": 0,
  "status": "processing"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Order updated",
  "order": {...}
}
```

---

### ✅ TEST 26: Admin - Get Dashboard Stats
**Method:** `GET`  
**Endpoint:** `{{base_url}}/admin/stats`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 3,
    "totalVendors": 1,
    "totalProducts": 2,
    "totalOrders": 1,
    "totalRevenue": 0
  }
}
```

---

### ✅ TEST 27: Admin - Get All Users
**Method:** `GET`  
**Endpoint:** `{{base_url}}/admin/users?role=customer&page=1&limit=10`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "users": [...],
  "pagination": {...}
}
```

---

### ✅ TEST 28: Admin - Get All Orders
**Method:** `GET`  
**Endpoint:** `{{base_url}}/admin/orders?status=pending`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "orders": [...],
  "pagination": {...}
}
```

---

### ✅ TEST 29: Admin - Verify Vendor
**Method:** `PUT`  
**Endpoint:** `{{base_url}}/admin/verify-vendor/{{vendor_user_id}}`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Vendor verified",
  "vendor": {...}
}
```

---

### ✅ TEST 30: Remove from Wishlist
**Method:** `POST`  
**Endpoint:** `{{base_url}}/wishlist/remove`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "productId": "{{product_id}}"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

---

### ✅ TEST 31: Remove from Cart
**Method:** `POST`  
**Endpoint:** `{{base_url}}/cart/remove`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body (JSON):**
```json
{
  "productId": "{{product_id}}"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product removed from cart"
}
```

---

### ✅ TEST 32: Clear Cart
**Method:** `DELETE`  
**Endpoint:** `{{base_url}}/cart/clear`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### ✅ TEST 33: Delete Product (Vendor)
**Method:** `DELETE`  
**Endpoint:** `{{base_url}}/products/{{product_id}}`

**Headers:**
```
Authorization: Bearer {{vendor_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### ✅ TEST 34: Admin - Deactivate Product
**Method:** `PUT`  
**Endpoint:** `{{base_url}}/admin/deactivate-product/{{product_id}}`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Product deactivated"
}
```

---

## 🧪 ERROR TEST CASES

### ❌ TEST 35: Login with Wrong Password
**Method:** `POST`  
**Endpoint:** `{{base_url}}/auth/login`

**Body:**
```json
{
  "email": "customer@test.com",
  "password": "wrongpassword"
}
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### ❌ TEST 36: Access Protected Route Without Token
**Method:** `GET`  
**Endpoint:** `{{base_url}}/auth/profile`

**No Authorization Header**

**Expected Response (401):**
```json
{
  "message": "No token, authorization denied"
}
```

---

### ❌ TEST 37: Customer Try to Create Product
**Method:** `POST`  
**Endpoint:** `{{base_url}}/products`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body:**
```json
{
  "name": "Test",
  "description": "Test",
  "category": "Test",
  "price": 100,
  "stock": 10
}
```

**Expected Response (403):**
```json
{
  "message": "Vendor access required"
}
```

---

### ❌ TEST 38: Customer Try to Access Admin Route
**Method:** `GET`  
**Endpoint:** `{{base_url}}/admin/stats`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Expected Response (403):**
```json
{
  "message": "Admin access required"
}
```

---

### ❌ TEST 39: Get Non-existent Product
**Method:** `GET`  
**Endpoint:** `{{base_url}}/products/000000000000000000000000`

**Expected Response (404):**
```json
{
  "message": "Product not found"
}
```

---

### ❌ TEST 40: Create Order with Insufficient Stock
**Method:** `POST`  
**Endpoint:** `{{base_url}}/orders`

**Headers:**
```
Authorization: Bearer {{customer_token}}
```

**Body:**
```json
{
  "items": [
    {
      "product": "{{product_id}}",
      "quantity": 1000
    }
  ],
  "shippingAddress": {...},
  "paymentMethod": "razorpay"
}
```

**Expected Response (400):**
```json
{
  "message": "Insufficient stock for [Product Name]"
}
```

---

## 📊 POSTMAN COLLECTION IMPORT

Save this as JSON and import to Postman:

```json
{
  "info": {
    "name": "ShopEz API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

---

## 🎯 TESTING CHECKLIST

- [ ] All auth endpoints work
- [ ] Token-based authentication works
- [ ] Role-based access control works
- [ ] Products CRUD works
- [ ] Cart operations work
- [ ] Wishlist works
- [ ] Orders can be created
- [ ] Reviews can be added
- [ ] Payment integration works
- [ ] Admin endpoints protected
- [ ] Error handling works
- [ ] Search and filters work

---

## 💡 TIPS

1. **Save tokens** in environment variables for easy access
2. **Test in sequence** - some tests depend on previous ones
3. **Note IDs** - Save product_id, order_id for later tests
4. **Check responses** - Verify status codes and response structure
5. **Test errors** - Try invalid data to test error handling
6. **Use Collections** - Organize tests in Postman collections

---

Ready to test! 🚀

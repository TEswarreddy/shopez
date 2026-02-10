# ShopEz API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in the header:
```
Authorization: Bearer <token>
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Sign Up
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"  // "customer", "vendor", or "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 1.2 Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 1.3 Get Profile
**Endpoint:** `GET /auth/profile`
**Auth Required:** ✅ Yes

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "customer",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "profileImage": "url_to_image",
    "createdAt": "2024-02-10T00:00:00.000Z"
  }
}
```

---

### 1.4 Update Profile
**Endpoint:** `PUT /auth/profile`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "firstName": "Jane",
  "phone": "+9876543210",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "USA"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

---

## 2. PRODUCT ENDPOINTS

### 2.1 Get All Products
**Endpoint:** `GET /products`
**Auth Required:** ❌ No

**Query Parameters:**
- `search` (optional): Search by name/description
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `vendor` (optional): Vendor ID
- `page` (default: 1): Page number
- `limit` (default: 12): Items per page

**Example:**
```
GET /products?search=laptop&category=Electronics&minPrice=500&maxPrice=1500&page=1
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "product_id",
      "name": "Gaming Laptop",
      "description": "High-performance laptop",
      "category": "Electronics",
      "price": 999.99,
      "originalPrice": 1299.99,
      "discount": 23,
      "stock": 15,
      "images": ["url1", "url2"],
      "vendor": {
        "id": "vendor_id",
        "firstName": "John",
        "lastName": "Smith",
        "shop": {
          "shopName": "Tech Store",
          "verified": true
        }
      },
      "ratings": {
        "average": 4.5,
        "count": 127
      },
      "tags": ["laptop", "gaming", "hp"],
      "createdAt": "2024-02-10T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 234,
    "pages": 20,
    "currentPage": 1
  }
}
```

---

### 2.2 Get Product Details
**Endpoint:** `GET /products/:id`
**Auth Required:** ❌ No

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "product_id",
    "name": "Gaming Laptop",
    "description": "High-performance laptop for gaming",
    "category": "Electronics",
    "price": 999.99,
    "stock": 15,
    "images": ["url1", "url2"],
    "vendor": {
      "id": "vendor_id",
      "firstName": "John",
      "lastName": "Smith",
      "shop": {
        "shopName": "Tech Store",
        "shopDescription": "Best electronics",
        "verified": true
      },
      "ratings": {
        "average": 4.7,
        "count": 500
      }
    },
    "ratings": {
      "average": 4.5,
      "count": 127
    },
    "reviews": [
      {
        "id": "review_id",
        "customer": { "firstName": "Jane", "lastName": "Doe" },
        "rating": 5,
        "title": "Excellent product!",
        "comment": "Very satisfied with purchase",
        "verified": true,
        "helpful": 25,
        "createdAt": "2024-02-05T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 2.3 Create Product (Vendor Only)
**Endpoint:** `POST /products`
**Auth Required:** ✅ Yes (Vendor/Admin)

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance laptop for gaming",
  "category": "Electronics",
  "price": 999.99,
  "stock": 20,
  "images": ["url1", "url2", "url3"],
  "tags": ["laptop", "gaming", "hp"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": { /* created product object */ }
}
```

---

### 2.4 Update Product (Vendor Only)
**Endpoint:** `PUT /products/:id`
**Auth Required:** ✅ Yes (Vendor/Admin)

**Request Body:**
```json
{
  "price": 899.99,
  "stock": 25,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": { /* updated product object */ }
}
```

---

### 2.5 Delete Product (Vendor Only)
**Endpoint:** `DELETE /products/:id`
**Auth Required:** ✅ Yes (Vendor/Admin)

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 3. CART ENDPOINTS

### 3.1 Get Cart
**Endpoint:** `GET /cart`
**Auth Required:** ✅ Yes

**Response:**
```json
{
  "success": true,
  "cart": {
    "id": "cart_id",
    "customer": "customer_id",
    "items": [
      {
        "product": {
          "id": "product_id",
          "name": "Gaming Laptop",
          "price": 999.99,
          "images": ["url1"]
        },
        "quantity": 1,
        "addedAt": "2024-02-10T00:00:00.000Z"
      }
    ],
    "totalPrice": 999.99
  }
}
```

---

### 3.2 Add to Cart
**Endpoint:** `POST /cart/add`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "cart": { /* updated cart */ }
}
```

---

### 3.3 Update Cart Item
**Endpoint:** `PUT /cart/update`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated",
  "cart": { /* updated cart */ }
}
```

---

### 3.4 Remove from Cart
**Endpoint:** `POST /cart/remove`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "productId": "product_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "cart": { /* updated cart */ }
}
```

---

### 3.5 Clear Cart
**Endpoint:** `DELETE /cart/clear`
**Auth Required:** ✅ Yes

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared",
  "cart": { /* empty cart */ }
}
```

---

## 4. WISHLIST ENDPOINTS

### 4.1 Get Wishlist
**Endpoint:** `GET /wishlist`
**Auth Required:** ✅ Yes

**Response:**
```json
{
  "success": true,
  "wishlist": {
    "id": "wishlist_id",
    "customer": "customer_id",
    "products": [
      {
        "product": {
          "id": "product_id",
          "name": "Gaming Laptop",
          "price": 999.99,
          "images": ["url1"]
        },
        "addedAt": "2024-02-10T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 4.2 Add to Wishlist
**Endpoint:** `POST /wishlist/add`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "productId": "product_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "wishlist": { /* updated wishlist */ }
}
```

---

### 4.3 Remove from Wishlist
**Endpoint:** `POST /wishlist/remove`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "productId": "product_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product removed from wishlist",
  "wishlist": { /* updated wishlist */ }
}
```

---

## 5. REVIEW ENDPOINTS

### 5.1 Create Review
**Endpoint:** `POST /reviews/:productId`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Very satisfied with the purchase and delivery"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "id": "review_id",
    "product": "product_id",
    "customer": "customer_id",
    "rating": 5,
    "title": "Excellent product!",
    "comment": "Very satisfied with the purchase and delivery",
    "verified": true,
    "helpful": 0,
    "createdAt": "2024-02-10T00:00:00.000Z"
  }
}
```

---

### 5.2 Get Product Reviews
**Endpoint:** `GET /reviews/:productId`
**Auth Required:** ❌ No

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": "review_id",
      "rating": 5,
      "title": "Great!",
      "comment": "Very happy",
      "customer": { "firstName": "Jane", "lastName": "Doe" },
      "verified": true,
      "helpful": 15,
      "createdAt": "2024-02-10T00:00:00.000Z"
    }
  ]
}
```

---

### 5.3 Update Review
**Endpoint:** `PUT /reviews/:reviewId`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "rating": 4,
  "title": "Good product",
  "comment": "Slightly disappointed with delivery time"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review updated",
  "review": { /* updated review */ }
}
```

---

### 5.4 Delete Review
**Endpoint:** `DELETE /reviews/:reviewId`
**Auth Required:** ✅ Yes

**Response:**
```json
{
  "success": true,
  "message": "Review deleted"
}
```

---

## 6. ORDER ENDPOINTS

### 6.1 Create Order
**Endpoint:** `POST /orders`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"  // "card", "paypal", or "cod"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "order_id",
    "orderNumber": "ORD-1707547200000-abc123",
    "customer": "customer_id",
    "items": [
      {
        "product": "product_id",
        "vendor": "vendor_id",
        "quantity": 1,
        "price": 999.99,
        "status": "pending"
      }
    ],
    "totalAmount": 999.99,
    "shippingAddress": { /* address */ },
    "paymentMethod": "card",
    "paymentStatus": "pending",
    "status": "pending",
    "createdAt": "2024-02-10T00:00:00.000Z"
  }
}
```

---

### 6.2 Get My Orders
**Endpoint:** `GET /orders/my-orders`
**Auth Required:** ✅ Yes

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "orderNumber": "ORD-...",
      "totalAmount": 999.99,
      "status": "processing",
      "paymentStatus": "completed",
      "createdAt": "2024-02-10T00:00:00.000Z",
      "items": [ /* items */ ]
    }
  ]
}
```

---

### 6.3 Get Order Details
**Endpoint:** `GET /orders/:id`
**Auth Required:** ✅ Yes

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "orderNumber": "ORD-...",
    "customer": { /* customer data */ },
    "items": [
      {
        "product": { /* product data */ },
        "vendor": { /* vendor data */ },
        "quantity": 1,
        "price": 999.99,
        "status": "shipped"
      }
    ],
    "totalAmount": 999.99,
    "shippingAddress": { /* address */ },
    "paymentMethod": "card",
    "paymentStatus": "completed",
    "status": "shipped",
    "createdAt": "2024-02-10T00:00:00.000Z"
  }
}
```

---

### 6.4 Update Order Status (Vendor/Admin Only)
**Endpoint:** `PUT /orders/:id`
**Auth Required:** ✅ Yes (Vendor/Admin)

**Request Body:**
```json
{
  "itemIndex": 0,
  "status": "shipped"  // "pending", "processing", "shipped", "delivered", "cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order updated",
  "order": { /* updated order */ }
}
```

---

## 7. ADMIN ENDPOINTS

All admin endpoints require admin role.

### 7.1 Get Dashboard Stats
**Endpoint:** `GET /admin/stats`
**Auth Required:** ✅ Yes (Admin)

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "totalVendors": 85,
    "totalProducts": 5420,
    "totalOrders": 3200,
    "totalRevenue": 450000.50
  }
}
```

---

### 7.2 Get All Users
**Endpoint:** `GET /admin/users`
**Auth Required:** ✅ Yes (Admin)

**Query Parameters:**
- `role` (optional): "customer", "vendor", or "admin"
- `page` (default: 1)
- `limit` (default: 10)

**Response:**
```json
{
  "success": true,
  "users": [ /* user list */ ],
  "pagination": {
    "total": 1250,
    "pages": 125,
    "currentPage": 1
  }
}
```

---

### 7.3 Verify Vendor
**Endpoint:** `PUT /admin/verify-vendor/:vendorId`
**Auth Required:** ✅ Yes (Admin)

**Response:**
```json
{
  "success": true,
  "message": "Vendor verified",
  "vendor": { /* vendor data with verified: true */ }
}
```

---

### 7.4 Get All Orders
**Endpoint:** `GET /admin/orders`
**Auth Required:** ✅ Yes (Admin)

**Query Parameters:**
- `status` (optional): Filter by order status
- `paymentStatus` (optional): Filter by payment status
- `page` (default: 1)
- `limit` (default: 10)

**Response:**
```json
{
  "success": true,
  "orders": [ /* orders list */ ],
  "pagination": { /* pagination info */ }
}
```

---

### 7.5 Deactivate Product
**Endpoint:** `PUT /admin/deactivate-product/:productId`
**Auth Required:** ✅ Yes (Admin)

**Response:**
```json
{
  "success": true,
  "message": "Product deactivated",
  "product": { /* product with isActive: false */ }
}
```

---

## Error Responses

All errors follow this format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Please provide all required fields",
  "errors": ["field1 is required"]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products?search=laptop&page=1
```

### Create Product (with token)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","description":"Desc","category":"Electronics","price":99.99,"stock":10}'
```

---

End of API Documentation

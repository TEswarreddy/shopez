# Payment Model & Revenue Tracking System

## Overview

The Payment model provides comprehensive tracking of all payments and revenue within the ShopEz platform. It's designed to serve both admin dashboard (platform revenue) and vendor dashboard (vendor earnings).

## Payment Model Structure

### Key Fields

#### Transaction Details
- `transactionId` - Unique identifier for each transaction
- `razorpayPaymentId` - Razorpay payment ID for reference
- `orderRef` - Reference to the Order document
- `paymentMethod` - Payment method (card, razorpay, cod, upi, wallet, net_banking)

#### Parties Involved
- `customer` - Reference to the Customer making the payment
- `vendor` - Reference to the Vendor (if applicable)

#### Amount Breakdown
- `orderAmount` - Original order amount
- `discount` - Discount applied
- `tax` - Tax amount
- `shippingCharges` - Shipping cost
- `totalAmount` - Final amount paid (calculated)

#### Revenue Splits
- `vendorAmount` - Amount earned by vendor (totalAmount - platformCommission)
- `platformCommission` - Amount earned by platform
- `commissionPercentage` - Commission percentage used (default: 10%)

#### Payment Status
- `status` - Payment status (pending, completed, failed, refunded, partially_refunded)
- `refundAmount` - Amount refunded
- `refundReason` - Reason for refund
- `refundedAt` - Refund timestamp

#### Reconciliation
- `reconciled` - Whether payment has been reconciled
- `reconciledBy` - Admin who reconciled the payment
- `reconciledAt` - Reconciliation timestamp

---

## API Endpoints

### Admin Endpoints

#### 1. Get Admin Revenue Dashboard
```
GET /api/analytics/admin/revenue-dashboard
Query Parameters:
  - startDate (optional): YYYY-MM-DD
  - endDate (optional): YYYY-MM-DD
```

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "totalRevenue": 50000,
      "totalGrossRevenue": 500000,
      "totalTransactions": 100,
      "totalRefunded": 5000,
      "avgTransactionValue": 5000
    },
    "topVendors": [
      {
        "_id": "vendor_id",
        "vendorRevenue": 100000,
        "transactions": 20,
        "vendorInfo": [...]
      }
    ],
    "paymentMethods": [
      {
        "_id": "razorpay",
        "count": 80,
        "totalAmount": 400000
      }
    ]
  }
}
```

#### 2. Get Revenue Trends
```
GET /api/analytics/admin/revenue-trend
Query Parameters:
  - startDate (optional): YYYY-MM-DD
  - endDate (optional): YYYY-MM-DD
  - groupBy (optional): "day" or "month" (default: "day")
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "2026-02-13",
      "platformRevenue": 10000,
      "vendorRevenue": 90000,
      "totalAmount": 100000,
      "transactions": 20
    }
  ]
}
```

#### 3. Get Payment Reconciliation
```
GET /api/analytics/admin/reconciliation
Query Parameters:
  - status: "pending" or "completed"
  - limit: number of records per page (default: 20)
  - page: page number (default: 1)
```

#### 4. Mark Payments as Reconciled
```
POST /api/analytics/admin/reconciliation/mark
Body:
{
  "paymentIds": ["payment_id_1", "payment_id_2"]
}
```

#### 5. Process Refund
```
POST /api/analytics/admin/refund
Body:
{
  "paymentId": "payment_id",
  "refundAmount": 1000,
  "reason": "Customer requested refund"
}
```

---

### Vendor Endpoints

#### 1. Get Vendor Revenue Dashboard
```
GET /api/analytics/vendor/revenue-dashboard
Query Parameters:
  - startDate (optional): YYYY-MM-DD
  - endDate (optional): YYYY-MM-DD
```

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "totalEarnings": 90000,
      "totalTransactions": 20,
      "totalRefunded": 1000,
      "avgOrderValue": 4500
    }
  }
}
```

#### 2. Get Vendor Revenue Breakdown
```
GET /api/analytics/vendor/revenue-breakdown
Query Parameters:
  - startDate (optional): YYYY-MM-DD
  - endDate (optional): YYYY-MM-DD
  - groupBy (optional): "day" or "month" (default: "day")
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "2026-02-13",
      "earnings": 45000,
      "commission": 5000,
      "totalAmount": 50000,
      "transactions": 10
    }
  ]
}
```

#### 3. Get Vendor Transaction History
```
GET /api/analytics/vendor/transactions
Query Parameters:
  - limit: number of records per page (default: 20)
  - page: page number (default: 1)
  - status (optional): payment status filter
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "payment_id",
        "transactionId": "TXN-1234567890-abc123",
        "totalAmount": 5000,
        "vendorAmount": 4500,
        "platformCommission": 500,
        "status": "completed",
        "createdAt": "2026-02-13T10:30:00Z",
        "customer": {...},
        "orderRef": {...}
      }
    ],
    "pagination": {
      "total": 100,
      "pages": 5,
      "currentPage": 1
    }
  }
}
```

---

### Common Endpoints

#### 1. Get Payment Details
```
GET /api/analytics/payment/:transactionId
Response: Single payment document with all details
```

#### 2. Record Payment
```
POST /api/analytics/record
Body:
{
  "orderRef": "order_id",
  "customer": "customer_id",
  "vendor": "vendor_id",
  "paymentMethod": "razorpay",
  "orderAmount": 5000,
  "discount": 500,
  "tax": 100,
  "shippingCharges": 50,
  "commissionPercentage": 10,
  "razorpayPaymentId": "pay_xxxxx",
  "razorpayOrderId": "order_xxxxx",
  "razorpaySignature": "sig_xxxxx"
}
```

---

## Integration with Payment Controller

The Payment model is automatically integrated when Razorpay payments are verified. When `verifyPayment` is called:

1. Order is updated with payment confirmation
2. Payment record is created automatically
3. Revenue is split between vendor and platform
4. All payment details are recorded for audit trail

---

## Database Indexes

The Payment model has optimized indexes for fast queries:
- `transactionId` - For unique transaction lookup
- `status` and `createdAt` - For revenue filtering
- `vendor`, `status`, `createdAt` - For vendor revenue queries
- `customer` and `createdAt` - For customer transaction history

---

## Example Usage in Frontend

### Admin Dashboard

```javascript
// Get platform revenue
const getAdminDashboard = async () => {
  const response = await fetch('/api/analytics/admin/revenue-dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log('Total Revenue:', data.data.revenue.totalRevenue);
  console.log('Top Vendors:', data.data.topVendors);
};

// Get revenue trends
const getRevenueTrends = async (startDate, endDate) => {
  const response = await fetch(
    `/api/analytics/admin/revenue-trend?startDate=${startDate}&endDate=${endDate}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const data = await response.json();
  // Use data for chart visualization
};
```

### Vendor Dashboard

```javascript
// Get vendor earnings
const getVendorDashboard = async () => {
  const response = await fetch('/api/analytics/vendor/revenue-dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  console.log('Total Earnings:', data.data.revenue.totalEarnings);
  console.log('Total Transactions:', data.data.revenue.totalTransactions);
};

// Get transaction history
const getTransactions = async (page = 1) => {
  const response = await fetch(
    `/api/analytics/vendor/transactions?page=${page}&limit=20`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const data = await response.json();
  // Display transactions in table
};
```

---

## Commission Calculation

The platform commission is calculated automatically:

```
platformCommission = totalAmount × (commissionPercentage / 100)
vendorAmount = totalAmount - platformCommission
```

**Example:**
- Order Amount: ₹1000
- Commission %: 10%
- Platform Commission: ₹100
- Vendor Amount: ₹900

---

## Refund Handling

When a refund is processed:
1. Refund amount is recorded
2. Payment status is updated to "partially_refunded" or "refunded"
3. Refund reason and timestamp are stored
4. Order status is updated accordingly
5. Admin can track refunded amounts in reconciliation

---

## Revenue Reporting Features

### For Admins
- Total platform revenue and commission
- Vendor-wise revenue breakdown
- Payment method analysis
- Refund tracking
- Reconciliation status
- Daily/Monthly trends

### For Vendors
- Total earnings and transactions
- earnings after platform commission
- Income trends over time
- Transaction history with details
- Refund impact on earnings

---

## Best Practices

1. **Always verify Razorpay signatures** before recording payments
2. **Use commission percentage flexibility** for different vendor tiers
3. **Regularly reconcile payments** for audit purposes
4. **Track refunds carefully** for accurate revenue reporting
5. **Use date filters** for efficient report generation

---

## Notes

- Payments are automatically created via the payment verification endpoint
- All calculations use JavaScript's toFixed(2) for currency precision
- Timestamps are stored in UTC timezone
- Vendor amount calculation happens in pre-save hook
- Revenue queries are optimized with proper indexing


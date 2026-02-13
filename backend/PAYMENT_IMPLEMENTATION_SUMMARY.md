# Payment Model & Revenue Tracking System - Implementation Summary

## What Has Been Implemented

### 1. **Payment Model** (`src/models/Payment.js`)
A comprehensive MongoDB schema for tracking all payments with:

#### Core Features:
- ✅ **Unique Transaction Tracking** - Each payment gets a unique transaction ID
- ✅ **Revenue Splitting** - Automatic calculation of vendor earnings vs platform commission
- ✅ **Payment Status Management** - Track payments through: pending → completed → refunded
- ✅ **Commission Management** - Configurable commission percentage per payment
- ✅ **Refund Handling** - Support for full and partial refunds with reasons
- ✅ **Reconciliation** - Admin mark payments as reconciled for audit trails
- ✅ **Payment Gateway Integration** - Razorpay signature and transaction details

#### Data Structure:
```
Payment
├─ transactionId (unique)
├─ customer (ref)
├─ vendor (ref)
├─ orderRef (ref)
├─ Payment Details
│  ├─ orderAmount
│  ├─ discount
│  ├─ tax
│  ├─ shippingCharges
│  └─ totalAmount
├─ Revenue Split
│  ├─ vendorAmount
│  ├─ platformCommission
│  └─ commissionPercentage
├─ Status Tracking
│  ├─ status
│  ├─ refundAmount
│  └─ refundReason
└─ Reconciliation
   ├─ reconciled
   ├─ reconciledBy
   └─ reconciledAt
```

---

### 2. **Analytics Controller** (`src/controllers/analyticsController.js`)
Comprehensive analytics logic with 10+ functions:

#### Admin Functions:
| Function | Purpose |
|----------|---------|
| `getAdminRevenueDashboard` | Platform revenue overview with top vendors |
| `getRevenueTrend` | Daily/Monthly revenue trends |
| `getPaymentReconciliation` | View reconciliation status |
| `markPaymentReconciled` | Batch mark payments as reconciled |
| `processRefund` | Process refunds through admin panel |

#### Vendor Functions:
| Function | Purpose |
|----------|---------|
| `getVendorRevenueDashboard` | Vendor earnings overview |
| `getVendorRevenueBreakdown` | Daily/Monthly earnings breakdown |
| `getVendorTransactionHistory` | Filter and view all transactions |

#### Common Functions:
| Function | Purpose |
|----------|---------|
| `getPaymentDetails` | Get specific payment by transaction ID |
| `recordPayment` | Manual payment recording |

---

### 3. **Analytics Routes** (`src/routes/analyticsRoutes.js`)
RESTful API endpoints organized by role:

#### Admin Routes:
```
GET  /api/analytics/admin/revenue-dashboard
GET  /api/analytics/admin/revenue-trend
GET  /api/analytics/admin/reconciliation
POST /api/analytics/admin/reconciliation/mark
POST /api/analytics/admin/refund
```

#### Vendor Routes:
```
GET /api/analytics/vendor/revenue-dashboard
GET /api/analytics/vendor/revenue-breakdown
GET /api/analytics/vendor/transactions
```

#### Public Routes (Auth Required):
```
GET /api/analytics/payment/:transactionId
POST /api/analytics/record
```

---

### 4. **Payment Controller Integration** (`src/controllers/paymentController.js`)
Updated to automatically record payments:

#### Changes Made:
- ✅ Import Payment model
- ✅ Auto-create Payment record when Razorpay payment verified
- ✅ Record payment details including:
  - Transaction ID
  - Customer & Vendor references
  - Commission splits
  - Payment gateway response
- ✅ Update refund function to mark payments as refunded
- ✅ Track all payment status changes

---

### 5. **App Integration** (`src/app.js`)
Registered analytics routes in the main Express app:
```javascript
app.use("/api/analytics", require("./routes/analyticsRoutes"));
```

---

## Revenue Tracking Features

### For Admin Dashboard:

1. **Overall Revenue Metrics**
   - Total platform commission earned
   - Gross revenue from all transactions
   - Total transaction count
   - Refund amounts tracked
   - Average transaction value

2. **Vendor Performance**
   - Top 5 vendors by revenue
   - Vendor-wise commission breakdown
   - Vendor transaction counts

3. **Payment Method Analytics**
   - Distribution of payment methods (Razorpay, COD, etc.)
   - Volume and transaction value per method

4. **Trend Analysis**
   - Daily/Monthly revenue trends
   - Platform commission trends
   - Transaction volume trends
   - Refund trends

5. **Reconciliation Management**
   - View pending/completed reconciliations
   - Bulk mark payments as reconciled
   - Admin audit trail

### For Vendor Dashboard:

1. **Earnings Overview**
   - Total earnings (after commission)
   - Total transactions received
   - Average order value
   - Refund impact on earnings

2. **Revenue Breakdown**
   - Daily/Monthly earnings trends
   - Commission charged per period
   - Transaction trend

3. **Transaction History**
   - Detailed transaction list
   - Customer information
   - Order references
   - Payment status filtering

---

## Database Optimization

### Indexes Created:
```javascript
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ vendor: 1, status: 1, createdAt: -1 });
paymentSchema.index({ customer: 1, createdAt: -1 });
paymentSchema.index({ createdAt: -1 });
```

### Benefits:
- ✅ Fast revenue queries
- ✅ Quick vendor earnings lookups
- ✅ Efficient customer transaction history
- ✅ Optimized status filtering

---

## Automatic Revenue Calculation

### Commission Splitting:
```
When payment is completed:

1. Total Amount = Order Amount - Discount + Tax + Shipping
2. Platform Commission = Total Amount × (Commission % / 100)
3. Vendor Amount = Total Amount - Platform Commission

Example:
- Order: ₹1000
- Discount: ₹100
- Tax: ₹50
- Shipping: ₹50
- Total: ₹1000

With 10% commission:
- Platform: ₹100
- Vendor: ₹900
```

---

## API Usage Examples

### Admin - Get Revenue Dashboard
```bash
curl -X GET \
  "http://localhost:5000/api/analytics/admin/revenue-dashboard?startDate=2026-02-01&endDate=2026-02-13" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
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
        "vendorRevenue": 100000,
        "transactions": 20
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

### Vendor - Get Earnings Dashboard
```bash
curl -X GET \
  "http://localhost:5000/api/analytics/vendor/revenue-dashboard" \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN"
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

---

## Files Created/Modified

### New Files:
- ✅ `src/models/Payment.js` - Payment schema with aggregation helpers
- ✅ `src/controllers/analyticsController.js` - Analytics logic
- ✅ `src/routes/analyticsRoutes.js` - Analytics endpoints
- ✅ `PAYMENT_MODEL_GUIDE.md` - Comprehensive documentation

### Modified Files:
- ✅ `src/controllers/paymentController.js` - Integrated Payment model
- ✅ `src/app.js` - Registered analytics routes

---

## Key Metrics Tracked

### Admin Level:
- Platform commission
- Vendor earnings distribution
- Payment method preferences
- Refund rate
- Average transaction value
- Transaction volume trends
- Top performing vendors

### Vendor Level:
- Total earnings
- Commission deducted
- Transaction count
- Customer information
- Order-wise breakdown
- Performance trends
- Refund impacts

---

## Security Considerations

1. **Role-Based Access**
   - Admin endpoints only accessible by admins
   - Vendor endpoints only accessible to their own vendor
   - Customer data properly referenced

2. **Data Validation**
   - Commission percentage validation
   - Refund amount cannot exceed payment
   - Status transitions validated

3. **Audit Trail**
   - Reconciliation tracks admin who approved
   - All timestamps recorded
   - Payment gateway responses preserved

---

## Next Steps / Recommendations

1. **Frontend Integration**
   - Create admin revenue dashboard component
   - Create vendor earnings dashboard component
   - Integrate Chart.js for trend visualization

2. **Advanced Features**
   - Vendor payout scheduling based on earnings
   - Tiered commission rates by vendor
   - Payment batch exports (CSV/PDF)
   - Automated reconciliation reports

3. **Monitoring**
   - Set up alerts for failed payments
   - Track reconciliation delays
   - Monitor commission disputes

4. **Reporting**
   - Monthly revenue reports
   - Vendor performance reports
   - Payment method analysis reports

---

## Testing the Implementation

### 1. Create a test payment:
```javascript
// After successful Razorpay payment verification,
// Payment record is automatically created
```

### 2. Check admin dashboard:
```
GET /api/analytics/admin/revenue-dashboard
```

### 3. Check vendor dashboard:
```
GET /api/analytics/vendor/revenue-dashboard
```

### 4. View specific payment:
```
GET /api/analytics/payment/TXN-xxxx-xxx
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Payments not recording | Ensure Razorpay signature verification passes |
| Revenue not calculating | Check commissionPercentage is set in Payment record |
| Vendor earnings showing 0 | Verify vendor is associated with order items |
| Reconciliation not working | Ensure admin is authenticated as super_admin or admin |

---

## Support

For detailed API documentation, see `PAYMENT_MODEL_GUIDE.md`


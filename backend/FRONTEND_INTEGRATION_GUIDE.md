# Payment & Revenue Tracking - Frontend Integration Guide

## Quick API Reference

### Admin Dashboard APIs

#### 1. Get Revenue Overview
```javascript
// Fetch platform revenue summary
async function getAdminDashboard(startDate, endDate) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await fetch(
    `/api/analytics/admin/revenue-dashboard?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
  );
  
  const data = await response.json();
  return data.data; // { revenue, topVendors, paymentMethods }
}
```

#### 2. Get Revenue Trends for Charts
```javascript
// Fetch daily/monthly revenue trends
async function getRevenueTrend(startDate, endDate, groupBy = 'day') {
  const params = new URLSearchParams({
    groupBy,
    startDate,
    endDate
  });
  
  const response = await fetch(
    `/api/analytics/admin/revenue-trend?${params}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const data = await response.json();
  // data.data = [{ _id: "2026-02-13", platformRevenue: 10000, vendorRevenue: 90000, ... }]
  return data.data;
}
```

#### 3. Get Pending Reconciliations
```javascript
async function getPendingReconciliations(page = 1, limit = 20) {
  const response = await fetch(
    `/api/analytics/admin/reconciliation?status=pending&page=${page}&limit=${limit}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const data = await response.json();
  return data.data; // { payments: [], pagination: {} }
}
```

#### 4. Mark Payments as Reconciled
```javascript
async function markAsReconciled(paymentIds) {
  const response = await fetch(
    '/api/analytics/admin/reconciliation/mark',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ paymentIds })
    }
  );
  
  return response.json();
}
```

#### 5. Process Refund
```javascript
async function processRefund(paymentId, refundAmount, reason) {
  const response = await fetch(
    '/api/analytics/admin/refund',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentId,
        refundAmount,
        reason
      })
    }
  );
  
  return response.json();
}
```

---

### Vendor Dashboard APIs

#### 1. Get Vendor Earnings Overview
```javascript
async function getVendorDashboard(startDate, endDate) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await fetch(
    `/api/analytics/vendor/revenue-dashboard?${params}`,
    {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    }
  );
  
  const data = await response.json();
  return data.data.revenue; // { totalEarnings, totalTransactions, ... }
}
```

#### 2. Get Earnings Breakdown
```javascript
async function getEarningsBreakdown(startDate, endDate, groupBy = 'day') {
  const params = new URLSearchParams({
    groupBy,
    startDate,
    endDate
  });
  
  const response = await fetch(
    `/api/analytics/vendor/revenue-breakdown?${params}`,
    {
      headers: { 'Authorization': `Bearer ${vendorToken}` }
    }
  );
  
  const data = await response.json();
  // data.data = [{ _id: "2026-02-13", earnings: 45000, commission: 5000, ... }]
  return data.data;
}
```

#### 3. Get Transaction History
```javascript
async function getTransactions(page = 1, limit = 20, status = null) {
  let url = `/api/analytics/vendor/transactions?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${vendorToken}` }
  });
  
  const data = await response.json();
  return data.data; // { transactions: [], pagination: {} }
}
```

---

## React/Vue Component Examples

### Admin Revenue Dashboard Component
```javascript
import React, { useState, useEffect } from 'react';
import { LineChart, BarChart } from 'recharts'; // or Chart.js

function AdminDashboard() {
  const [revenue, setRevenue] = useState(null);
  const [trend, setTrend] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    const token = localStorage.getItem('adminToken');
    
    // Get dashboard summary
    const dashResponse = await fetch(
      `/api/analytics/admin/revenue-dashboard?startDate=${dateRange.startDate.toISOString().split('T')[0]}&endDate=${dateRange.endDate.toISOString().split('T')[0]}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const dashData = await dashResponse.json();
    setRevenue(dashData.data.revenue);

    // Get trend data
    const trendResponse = await fetch(
      `/api/analytics/admin/revenue-trend?startDate=${dateRange.startDate.toISOString().split('T')[0]}&endDate=${dateRange.endDate.toISOString().split('T')[0]}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const trendData = await trendResponse.json();
    setTrend(trendData.data);
  };

  return (
    <div className="admin-dashboard">
      <h1>Platform Revenue Dashboard</h1>
      
      {/* Date Range Picker */}
      <div className="date-range">
        <input 
          type="date" 
          value={dateRange.startDate.toISOString().split('T')[0]}
          onChange={(e) => setDateRange({...dateRange, startDate: new Date(e.target.value)})}
        />
        <input 
          type="date" 
          value={dateRange.endDate.toISOString().split('T')[0]}
          onChange={(e) => setDateRange({...dateRange, endDate: new Date(e.target.value)})}
        />
      </div>

      {/* Summary Cards */}
      {revenue && (
        <div className="summary-cards">
          <Card title="Total Revenue" value={`₹${revenue.totalRevenue}`} />
          <Card title="Transactions" value={revenue.totalTransactions} />
          <Card title="Avg Order Value" value={`₹${revenue.avgTransactionValue}`} />
          <Card title="Refunded" value={`₹${revenue.totalRefunded}`} />
        </div>
      )}

      {/* Revenue Trend Chart */}
      <LineChart data={trend}>
        <XAxis dataKey="_id" />
        <YAxis />
        <Line type="monotone" dataKey="platformRevenue" stroke="#8884d8" />
        <Line type="monotone" dataKey="vendorRevenue" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
}

export default AdminDashboard;
```

### Vendor Earnings Dashboard Component
```javascript
import React, { useState, useEffect } from 'react';

function VendorDashboard() {
  const [earnings, setEarnings] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    const token = localStorage.getItem('vendorToken');
    
    // Get earnings
    const dashResponse = await fetch(
      '/api/analytics/vendor/revenue-dashboard',
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const dashData = await dashResponse.json();
    setEarnings(dashData.data.revenue);

    // Get transactions
    const txnResponse = await fetch(
      `/api/analytics/vendor/transactions?page=${currentPage}&limit=20`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const txnData = await txnResponse.json();
    setTransactions(txnData.data.transactions);
  };

  return (
    <div className="vendor-dashboard">
      <h1>My Earnings</h1>
      
      {/* Earnings Summary */}
      {earnings && (
        <div className="earnings-summary">
          <div className="stat">
            <h3>Total Earnings</h3>
            <p className="amount">₹{earnings.totalEarnings}</p>
          </div>
          <div className="stat">
            <h3>Transactions</h3>
            <p className="amount">{earnings.totalTransactions}</p>
          </div>
          <div className="stat">
            <h3>Avg Order Value</h3>
            <p className="amount">₹{earnings.avgOrderValue}</p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Commission</th>
            <th>Your Earnings</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id}>
              <td>{txn.transactionId}</td>
              <td>₹{txn.totalAmount}</td>
              <td>₹{txn.platformCommission}</td>
              <td className="earnings">₹{txn.vendorAmount}</td>
              <td><span className={`status-${txn.status}`}>{txn.status}</span></td>
              <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {/* Add pagination controls */}
      </div>
    </div>
  );
}

export default VendorDashboard;
```

---

## Data Formats

### Revenue Object Format
```javascript
{
  totalRevenue: 50000,           // Platform commission
  totalGrossRevenue: 500000,     // Total transaction amount
  totalTransactions: 100,
  totalRefunded: 5000,
  avgTransactionValue: 5000
}
```

### Transaction Object Format
```javascript
{
  _id: "5f7a8c9d0e1f2g3h4i5j6k7l",
  transactionId: "TXN-1234567890-abc123",
  razorpayPaymentId: "pay_xxxxx",
  orderRef: "order_id",
  customer: { _id, firstName, lastName, email },
  vendor: { _id, storeName, email },
  paymentMethod: "razorpay",
  totalAmount: 5000,
  vendorAmount: 4500,
  platformCommission: 500,
  status: "completed",
  createdAt: "2026-02-13T10:30:00Z",
  updatedAt: "2026-02-13T10:30:00Z"
}
```

### Trend Object Format
```javascript
{
  _id: "2026-02-13",              // Date
  platformRevenue: 10000,
  vendorRevenue: 90000,
  totalAmount: 100000,
  transactions: 20,
  refunded: 1000
}
```

---

## Common Use Cases

### 1. Display Admin Dashboard Stats
```javascript
const stats = [
  { label: 'Total Revenue', value: revenue.totalRevenue, icon: '💰' },
  { label: 'Transactions', value: revenue.totalTransactions, icon: '📊' },
  { label: 'Avg Order', value: revenue.avgTransactionValue, icon: '📈' },
  { label: 'Refunded', value: revenue.totalRefunded, icon: '↩️' }
];
```

### 2. Create Revenue Chart
```javascript
// For Chart.js or Recharts
const chartData = trend.map(item => ({
  date: item._id,
  platform: item.platformRevenue,
  vendor: item.vendorRevenue,
  total: item.totalAmount
}));
```

### 3. Display Top Vendors
```javascript
topVendors.map(vendor => ({
  name: vendor.vendorInfo[0]?.storeName,
  revenue: vendor.vendorRevenue,
  transactions: vendor.transactions
}));
```

### 4. Handle Reconciliation
```javascript
// Step 1: Get pending payments
const pending = await getPendingReconciliations(1, 20);

// Step 2: Review and select
const selectedIds = pending.payments
  .filter(p => shouldReconcile(p))
  .map(p => p._id);

// Step 3: Mark as reconciled
await markAsReconciled(selectedIds);
```

---

## Error Handling

```javascript
async function safeApiFetch(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('Fetch error:', error);
    showErrorNotification(error.message);
    throw error;
  }
}

// Usage
try {
  const data = await safeApiFetch('/api/analytics/admin/revenue-dashboard');
  setRevenue(data);
} catch (error) {
  // Error already handled
}
```

---

## Performance Tips

1. **Cache API Responses**
   ```javascript
   const [cache, setCache] = useState({});
   
   async function getCachedData(key, fetcher) {
     if (cache[key]) return cache[key];
     const data = await fetcher();
     setCache({...cache, [key]: data});
     return data;
   }
   ```

2. **Pagination for Large Lists**
   - Always use limit/page parameters
   - Default limit: 20 records
   - Load more on scroll or pagination click

3. **Memoize Components**
   ```javascript
   const RevenueDashboard = React.memo(({ revenue }) => {
     return <div>{revenue.totalRevenue}</div>;
   });
   ```

4. **Debounce Date Filters**
   ```javascript
   function useDebouncedDateChange(callback, delay = 500) {
     const [timeout, setTimeout] = useState(null);
     
     return (newDate) => {
       clearTimeout(timeout);
       setTimeout(setTimeout(
         () => callback(newDate), 
         delay
       ));
     };
   }
   ```

---

## Testing Checklist

- [ ] Admin can view revenue dashboard
- [ ] Admin can see revenue trends
- [ ] Admin can reconcile payments
- [ ] Admin can process refunds
- [ ] Vendor can view earnings
- [ ] Vendor can view transactions
- [ ] Vendor can download reports
- [ ] Date filters work correctly
- [ ] Pagination works correctly
- [ ] Export to CSV/PDF works


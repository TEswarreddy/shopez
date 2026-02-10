# ShopEz Frontend Setup Guide

## Project Overview
Building a React-based frontend for the ShopEz multi-vendor ecommerce platform.

## Tech Stack
- **Framework**: React 18+
- **State Management**: Redux Toolkit or Context API
- **Styling**: Tailwind CSS or Material-UI
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Management**: React Hook Form or Formik

## Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation Steps

1. **Create React App**
```bash
npx create-react-app shopez-frontend
cd shopez-frontend
```

or with Vite (recommended for better performance):
```bash
npm create vite@latest shopez-frontend -- --template react
cd shopez-frontend
npm install
```

2. **Install Dependencies**
```bash
npm install axios react-router-dom redux @reduxjs/toolkit react-redux
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react  # For icons
```

3. **Setup Tailwind CSS (if using)**
```bash
npx tailwindcss init -p
```

### Project Structure (Recommended)

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Cart/
│   │   ├── Admin/
│   │   └── (other reusable components)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── AuthPages (signup/login)
│   │   ├── AdminDashboard/
│   │   └── VendorDashboard/
│   ├── store/
│   │   ├── authSlice.js
│   │   ├── productSlice.js
│   │   ├── cartSlice.js
│   │   └── store.js
│   ├── services/
│   │   ├── api.js          # API configuration
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   └── (other services)
│   ├── context/
│   │   └── AuthContext.jsx (if using Context API)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProducts.js
│   │   └── useCart.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js (if using Vite)
```

## Key Features to Implement (in order)

### Phase 1: Core Pages
- [ ] Landing page with featured products
- [ ] Product listing page with search/filters
- [ ] Product detail page with reviews
- [ ] Shopping cart
- [ ] Checkout page
- [ ] Order confirmation

### Phase 2: User Features
- [ ] User authentication (signup/login)
- [ ] User profile management
- [ ] Order history & tracking
- [ ] Wishlist
- [ ] Product reviews submission

### Phase 3: Vendor Features
- [ ] Vendor dashboard
- [ ] Product management (CRUD)
- [ ] Order management
- [ ] Sales analytics
- [ ] Shop settings

### Phase 4: Admin Features
- [ ] Admin dashboard
- [ ] User management
- [ ] Vendor verification
- [ ] Order management
- [ ] Product moderation
- [ ] Analytics & reports

## API Integration Example

### Create API Service
```js
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Authentication Service
```js
// src/services/authService.js
import api from './api';

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};
```

## Redux Store Setup Example

```js
// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
```

## Routing Setup Example

```js
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}
```

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ShopEz
```

## Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Styling Tips

### Using Tailwind CSS
```jsx
<div className="grid grid-cols-4 gap-4 p-6">
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
    {/* Product card */}
  </div>
</div>
```

### Common UI Components Needed
1. **Navbar**: Logo, Search, Cart, User Menu
2. **ProductCard**: Image, Name, Price, Rating, Add to Cart
3. **ReviewCard**: Rating, Author, Comment, Date
4. **OrderStatus**: Timeline of order states
5. **Modal**: Reusable modal component
6. **Table**: For admin/vendor dashboards

## Performance Optimization
- [ ] Code splitting with React.lazy()
- [ ] Image optimization (use Next.js Image or similar)
- [ ] State management optimization
- [ ] Memoization of expensive components
- [ ] Pagination for large lists

## Testing
```bash
npm install --save-dev vitest @testing-library/react
```

## Deployment
- Frontend: Vercel, Netlify, or AWS S3 + CloudFront
- Backend: Heroku, Railway, or AWS EC2

## Common Libraries

| Purpose | Library | Alternative |
|---------|---------|-------------|
| Icons | lucide-react | react-icons |
| UI Components | Headless UI | shadcn/ui |
| Forms | React Hook Form | Formik |
| Date/Time | date-fns | Day.js |
| Toast Notifications | React Hot Toast | Sonner |
| Charts | Chart.js | Recharts |

## Security Tips
- [ ] Never expose API keys in frontend code
- [ ] Use environment variables for sensitive data
- [ ] Validate user input on frontend
- [ ] Sanitize HTML output
- [ ] Use HTTPS for all API calls
- [ ] Store tokens securely (httpOnly cookies preferred)

## Next Steps
1. Start with basic homepage and product listing
2. Build authentication UI
3. Implement shopping cart and checkout
4. Add admin and vendor dashboards
5. Integrate payment processing
6. Deploy to production

Good luck building! 🚀

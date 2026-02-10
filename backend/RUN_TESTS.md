# Run Test Cases with test-all-apis.ps1

This guide explains how to run the automated API test suite using the PowerShell script test-all-apis.ps1.

## Prerequisites

1. Node.js and npm installed.
2. MongoDB connection string set in .env (MONGODB_URI or MONGO_URI).
3. Backend dependencies installed:

```powershell
cd D:\shopez\backend
npm install
```

## Start the Backend Server

Open a terminal in D:\shopez\backend and run:

```powershell
npm run dev
```

Keep this terminal running while you execute the test script.

## Run the Test Script

In a new PowerShell terminal, run:

```powershell
cd D:\shopez\backend
.\test-all-apis.ps1
```

The script will:
- Create or log in customer, vendor, and admin users
- Create products and test product search
- Test wishlist and cart flows
- Create Razorpay orders
- Test admin endpoints
- Run error-handling checks

## Output and Results

The script prints PASS/FAIL for each API call and ends with a summary:

- Total tests
- Passed tests
- Failed tests
- Success rate

## Common Issues

1. "User already exists" (400)
   - This is expected on repeated runs. The script logs in when signup fails.

2. 401 Unauthorized
   - Ensure the server is running and the script obtained tokens.

3. 500 Internal Server Error
   - Check server logs for stack trace details.

## Optional Cleanup

If you want a clean test run each time:

- Clear your database collections (users, products, carts, wishlists, orders, reviews)
- Re-run the script

## Files Used

- test-all-apis.ps1 (test script)
- .env (environment variables)

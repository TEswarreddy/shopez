# ShopEz API Testing Script
# Tests all 40+ API endpoints systematically

$baseUrl = "http://localhost:5000/api"
$testResults = @()

# Helper function to test API
function Test-API {
    param (
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Body,
        [hashtable]$Headers
    )
    
    try {
        Write-Host "`n========================================" -ForegroundColor Cyan
        Write-Host "Testing: $Name" -ForegroundColor Yellow
        Write-Host "========================================" -ForegroundColor Cyan
        
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params['Body'] = ($Body | ConvertTo-Json)
        }
        
        if ($Headers) {
            $params['Headers'] = $Headers
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ PASS: $Name" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Gray
        $response | ConvertTo-Json -Depth 3 | Write-Host
        
        $script:testResults += @{Name=$Name; Status="PASS"; Response=$response}
        return $response
        
    } catch {
        Write-Host "❌ FAIL: $Name" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testResults += @{Name=$Name; Status="FAIL"; Error=$_.Exception.Message}
        return $null
    }
}

# Store tokens and IDs
$customerToken = ""
$vendorToken = ""
$adminToken = ""
$productId = ""
$orderId = ""

Write-Host "================================" -ForegroundColor Magenta
Write-Host "  ShopEz API Testing Suite" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

# ========== AUTHENTICATION TESTS ==========
Write-Host "`n===== 1. AUTHENTICATION TESTS =====" -ForegroundColor Cyan

# Test 1: Customer Signup
$result = Test-API -Name "Customer Signup" -Method POST -Url "$baseUrl/auth/signup" -Body @{
    firstName = "John"
    lastName = "Doe"
    email = "customer@test.com"
    password = "test123"
    role = "customer"
}
if ($result -and $result.token) { 
    $customerToken = $result.token
} else {
    # If signup fails (user exists), login instead
    Write-Host "Customer exists, logging in..." -ForegroundColor Yellow
    $loginResult = Test-API -Name "Customer Login (Retry)" -Method POST -Url "$baseUrl/auth/login" -Body @{
        email = "customer@test.com"
        password = "test123"
    }
    if ($loginResult) { $customerToken = $loginResult.token }
}

# Test 2: Vendor Signup
$result = Test-API -Name "Vendor Signup" -Method POST -Url "$baseUrl/auth/signup" -Body @{
    firstName = "Mike"
    lastName = "Vendor"
    email = "vendor@test.com"
    password = "test123"
    role = "vendor"
}
if ($result -and $result.token) { 
    $vendorToken = $result.token
} else {
    Write-Host "Vendor exists, logging in..." -ForegroundColor Yellow
    $loginResult = Test-API -Name "Vendor Login (Retry)" -Method POST -Url "$baseUrl/auth/login" -Body @{
        email = "vendor@test.com"
        password = "test123"
    }
    if ($loginResult) { $vendorToken = $loginResult.token }
}

# Test 3: Admin Signup
$result = Test-API -Name "Admin Signup" -Method POST -Url "$baseUrl/auth/signup" -Body @{
    firstName = "Admin"
    lastName = "User"
    email = "admin@test.com"
    password = "test123"
    role = "admin"
}
if ($result -and $result.token) { 
    $adminToken = $result.token
} else {
    Write-Host "Admin exists, logging in..." -ForegroundColor Yellow
    $loginResult = Test-API -Name "Admin Login (Retry)" -Method POST -Url "$baseUrl/auth/login" -Body @{
        email = "admin@test.com"
        password = "test123"
    }
    if ($loginResult) { $adminToken = $loginResult.token }
}

# Test 4: Customer Login
Test-API -Name "Customer Login" -Method POST -Url "$baseUrl/auth/login" -Body @{
    email = "customer@test.com"
    password = "test123"
}

# Test 5: Get Customer Profile
Test-API -Name "Get Customer Profile" -Method GET -Url "$baseUrl/auth/profile" -Headers @{
    Authorization = "Bearer $customerToken"
}

# Test 6: Update Customer Profile  
Test-API -Name "Update Customer Profile" -Method PUT -Url "$baseUrl/auth/profile" -Headers @{
    Authorization = "Bearer $customerToken"
} -Body @{
    phone = "+919876543210"
    address = @{
        street = "123 Main St"
        city = "Mumbai"
        state = "Maharashtra"
        postalCode = "400001"
        country = "India"
    }
}

# ========== PRODUCT TESTS ==========
Write-Host "`n===== 2. PRODUCT TESTS =====" -ForegroundColor Cyan

# Test 7: Create Product (Vendor)
$result = Test-API -Name "Create Product" -Method POST -Url "$baseUrl/products" -Headers @{
    Authorization = "Bearer $vendorToken"
} -Body @{
    name = "iPhone 15 Pro"
    description = "Latest iPhone with A17 Pro chip"
    category = "Electronics"
    price = 129999
    stock = 50
    images = @("https://example.com/iphone1.jpg", "https://example.com/iphone2.jpg")
    tags = @("iphone", "smartphone", "apple")
}
if ($result) { $productId = $result.product._id }

# Test 8: Get All Products
Test-API -Name "Get All Products" -Method GET -Url "$baseUrl/products"

# Test 9: Search Products
Test-API -Name "Search Products" -Method GET -Url "$baseUrl/products?search=iphone&category=Electronics"

# Test 10: Get Product Details
if ($productId) {
    Test-API -Name "Get Product Details" -Method GET -Url "$baseUrl/products/$productId"
}

# Test 11: Update Product (Vendor)
if ($productId) {
    Test-API -Name "Update Product" -Method PUT -Url "$baseUrl/products/$productId" -Headers @{
        Authorization = "Bearer $vendorToken"
    } -Body @{
        price = 119999
        stock = 45
    }
}

# ========== WISHLIST TESTS ==========
Write-Host "`n===== 3. WISHLIST TESTS =====" -ForegroundColor Cyan

# Test 12: Add to Wishlist
if ($productId) {
    Test-API -Name "Add to Wishlist" -Method POST -Url "$baseUrl/wishlist/add" -Headers @{
        Authorization = "Bearer $customerToken"
    } -Body @{
        productId = $productId
    }
}

# Test 13: Get Wishlist
Test-API -Name "Get Wishlist" -Method GET -Url "$baseUrl/wishlist" -Headers @{
    Authorization = "Bearer $customerToken"
}

# ========== CART TESTS ==========
Write-Host "`n===== 4. CART TESTS =====" -ForegroundColor Cyan

# Test 14: Add to Cart
if ($productId) {
    Test-API -Name "Add to Cart" -Method POST -Url "$baseUrl/cart/add" -Headers @{
        Authorization = "Bearer $customerToken"
    } -Body @{
        productId = $productId
        quantity = 2
    }
}

# Test 15: Get Cart
Test-API -Name "Get Cart" -Method GET -Url "$baseUrl/cart" -Headers @{
    Authorization = "Bearer $customerToken"
}

# Test 16: Update Cart Item
if ($productId) {
    Test-API -Name "Update Cart Item" -Method PUT -Url "$baseUrl/cart/update" -Headers @{
        Authorization = "Bearer $customerToken"
    } -Body @{
        productId = $productId
        quantity = 1
    }
}

# ========== ORDER TESTS ==========
Write-Host "`n===== 5. ORDER TESTS =====" -ForegroundColor Cyan

# Test 17: Create Order
if ($productId) {
    $result = Test-API -Name "Create Order" -Method POST -Url "$baseUrl/orders" -Headers @{
        Authorization = "Bearer $customerToken"
    } -Body @{
        items = @(
            @{
                product = $productId
                quantity = 1
            }
        )
        shippingAddress = @{
            street = "123 Main St"
            city = "Mumbai"
            state = "Maharashtra"
            postalCode = "400001"
            country = "India"
        }
        paymentMethod = "razorpay"
    }
    if ($result) { $orderId = $result.order._id }
}

# Test 18: Get My Orders
Test-API -Name "Get My Orders" -Method GET -Url "$baseUrl/orders/my-orders" -Headers @{
    Authorization = "Bearer $customerToken"
}

# Test 19: Get Order Details
if ($orderId) {
    Test-API -Name "Get Order Details" -Method GET -Url "$baseUrl/orders/$orderId" -Headers @{
        Authorization = "Bearer $customerToken"
    }
}

# ========== REVIEW TESTS ==========
Write-Host "`n===== 6. REVIEW TESTS =====" -ForegroundColor Cyan

# Test 20: Create Review
if ($productId) {
    Test-API -Name "Create Review" -Method POST -Url "$baseUrl/reviews/$productId" -Headers @{
        Authorization = "Bearer $customerToken"
    } -Body @{
        rating = 5
        title = "Excellent Product!"
        comment = "Very satisfied with the purchase. Great quality and fast delivery."
    }
}

# Test 21: Get Product Reviews
if ($productId) {
    Test-API -Name "Get Product Reviews" -Method GET -Url "$baseUrl/reviews/$productId"
}

# ========== PAYMENT TESTS ==========
Write-Host "`n===== 7. PAYMENT TESTS =====" -ForegroundColor Cyan

# Test 22: Create Razorpay Order
Test-API -Name "Create Razorpay Order" -Method POST -Url "$baseUrl/payment/create-order" -Headers @{
    Authorization = "Bearer $customerToken"
} -Body @{
    amount = 119999
    currency = "INR"
    receipt = "receipt_order_123"
}

# ========== ADMIN TESTS ==========
Write-Host "`n===== 8. ADMIN TESTS =====" -ForegroundColor Cyan

# Test 23: Get Dashboard Stats
Test-API -Name "Get Dashboard Stats" -Method GET -Url "$baseUrl/admin/stats" -Headers @{
    Authorization = "Bearer $adminToken"
}

# Test 24: Get All Users
Test-API -Name "Get All Users" -Method GET -Url "$baseUrl/admin/users" -Headers @{
    Authorization = "Bearer $adminToken"
}

# Test 25: Get All Orders (Admin)
Test-API -Name "Get All Orders (Admin)" -Method GET -Url "$baseUrl/admin/orders" -Headers @{
    Authorization = "Bearer $adminToken"
}

# ========== CLEANUP TESTS ==========
Write-Host "`n===== 9. CLEANUP TESTS =====" -ForegroundColor Cyan

# Test 26: Remove from Wishlist
if ($productId) {
    Test-API -Name "Remove from Wishlist" -Method POST -Url "$baseUrl/wishlist/remove" -Headers @{
        Authorization = "Bearer $customerToken"
    } -Body @{
        productId = $productId
    }
}

# Test 27: Remove from Cart
if ($productId) {
    Test-API -Name "Remove from Cart" -Method POST -Url "$baseUrl/cart/remove" -Headers @{
        Authorization = "Bearer $customerToken"
    } -Body @{
        productId = $productId
    }
}

# ========== ERROR TEST CASES ==========
Write-Host "`n===== 10. ERROR HANDLING TESTS =====" -ForegroundColor Cyan

# Test 28: Login with wrong password
Test-API -Name "Login with Wrong Password" -Method POST -Url "$baseUrl/auth/login" -Body @{
    email = "customer@test.com"
    password = "wrongpassword"
}

# Test 29: Access protected route without token
Test-API -Name "Access Profile Without Token" -Method GET -Url "$baseUrl/auth/profile"

# Test 30: Access admin route as customer
Test-API -Name "Customer Access Admin Route" -Method GET -Url "$baseUrl/admin/stats" -Headers @{
    Authorization = "Bearer $customerToken"
}

# ========== TEST SUMMARY ==========
Write-Host "`n`n================================" -ForegroundColor Magenta
Write-Host "       TEST SUMMARY" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "`nTotal Tests: $totalCount" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passCount/$totalCount)*100, 2))%" -ForegroundColor Yellow

Write-Host "`n================================" -ForegroundColor Magenta
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Magenta

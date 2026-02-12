# API Test Script
Write-Host "Testing Gillani Market Management API" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$API_URL = "http://localhost:5000/api"

try {
    # Test 1: Login as Admin
    Write-Host "`nStep 1: Testing Admin Login..." -ForegroundColor Yellow
    
    $loginBody = @{
        email = "admin@example.com"
        password = "admin12345"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json" `
        -ErrorAction Stop

    if ($loginResponse.success) {
        Write-Host "SUCCESS: Login Successful!" -ForegroundColor Green
        $token = $loginResponse.token
        
        if ($token) {
            Write-Host "Token received: $($token.Substring(0, [Math]::Min(30, $token.Length)))..." -ForegroundColor Gray
        } else {
            Write-Host "WARNING: No token in response!" -ForegroundColor Yellow
        }
        
        # Test 2: Get All Users
        Write-Host "`nStep 2: Fetching All Users..." -ForegroundColor Yellow
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }

        $usersResponse = Invoke-RestMethod -Uri "$API_URL/users" `
            -Method Get `
            -Headers $headers `
            -ErrorAction Stop

        Write-Host "SUCCESS: Users Fetched!" -ForegroundColor Green
        Write-Host "`nResponse Data:" -ForegroundColor Cyan
        Write-Host "  - Success: $($usersResponse.success)"
        Write-Host "  - Count: $($usersResponse.count)"
        
        if ($usersResponse.data) {
            Write-Host "`nTotal Users Found: $($usersResponse.data.Count)" -ForegroundColor Cyan
            
            if ($usersResponse.data.Count -gt 0) {
                Write-Host "`nUser List:" -ForegroundColor Cyan
                foreach ($user in $usersResponse.data) {
                    Write-Host "  - $($user.name) ($($user.email))" -ForegroundColor White
                    Write-Host "    Shop: $($user.shopName) | Rent: $($user.monthlyRent) | Status: $($user.status)" -ForegroundColor Gray
                }
            } else {
                Write-Host "  WARNING: No users found. Add users first!" -ForegroundColor Yellow
            }
        }

        Write-Host "`nAPI is working correctly!" -ForegroundColor Green
    }
} catch {
    Write-Host "`nERROR Testing API:" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody" -ForegroundColor Red
        } catch {}
    }
}

Write-Host "`n======================================" -ForegroundColor Cyan

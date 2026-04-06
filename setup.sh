#!/bin/bash

# ============================================================
# SmartRent Project Setup Script
# Creates .NET Core Web API + React Frontend with all packages
# ============================================================

set -e

echo "=========================================="
echo "  SmartRent Project Setup"
echo "=========================================="

# ──────────────────────────────────────────────
# 1. Backend — .NET Core Web API
# ──────────────────────────────────────────────
echo ""
echo "[1/4] Creating .NET Core Web API project..."
dotnet new webapi -n SmartRent.API --no-https false
cd SmartRent.API

echo "[2/4] Installing NuGet packages..."
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next
dotnet add package Microsoft.AspNetCore.SignalR
dotnet add package Swashbuckle.AspNetCore
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

# Create backend folder structure
echo "Creating backend folder structure..."
mkdir -p Controllers
mkdir -p Services/Interfaces
mkdir -p Services/Implementations
mkdir -p Models
mkdir -p DTOs/Auth
mkdir -p DTOs/Property
mkdir -p DTOs/Visit
mkdir -p DTOs/Rental
mkdir -p DTOs/Common
mkdir -p Data
mkdir -p Hubs
mkdir -p Helpers
mkdir -p Middlewares

# Create backend files
echo "Creating backend files..."

# Controllers
touch Controllers/AuthController.cs
touch Controllers/AdminController.cs
touch Controllers/PropertyController.cs
touch Controllers/VisitController.cs
touch Controllers/RentalController.cs
touch Controllers/FavoriteController.cs
touch Controllers/ReviewController.cs
touch Controllers/NotificationController.cs

# Service Interfaces
touch Services/Interfaces/IAuthService.cs
touch Services/Interfaces/IAdminService.cs
touch Services/Interfaces/IPropertyService.cs
touch Services/Interfaces/IVisitService.cs
touch Services/Interfaces/IRentalService.cs
touch Services/Interfaces/IFavoriteService.cs
touch Services/Interfaces/IReviewService.cs
touch Services/Interfaces/INotificationService.cs

# Service Implementations
touch Services/Implementations/AuthService.cs
touch Services/Implementations/AdminService.cs
touch Services/Implementations/PropertyService.cs
touch Services/Implementations/VisitService.cs
touch Services/Implementations/RentalService.cs
touch Services/Implementations/FavoriteService.cs
touch Services/Implementations/ReviewService.cs
touch Services/Implementations/NotificationService.cs

# Models
touch Models/User.cs
touch Models/Property.cs
touch Models/PropertyImage.cs
touch Models/PropertyAmenity.cs
touch Models/VisitRequest.cs
touch Models/RentalApplication.cs
touch Models/ApplicationDocument.cs
touch Models/Favorite.cs
touch Models/Review.cs
touch Models/Notification.cs

# DTOs
touch DTOs/Auth/RegisterDto.cs
touch DTOs/Auth/LoginDto.cs
touch DTOs/Auth/AuthResponseDto.cs
touch DTOs/Property/CreatePropertyDto.cs
touch DTOs/Property/UpdatePropertyDto.cs
touch DTOs/Property/PropertyResponseDto.cs
touch DTOs/Visit/CreateVisitDto.cs
touch DTOs/Visit/VisitResponseDto.cs
touch DTOs/Rental/CreateRentalDto.cs
touch DTOs/Rental/RentalResponseDto.cs
touch DTOs/Common/ServiceResult.cs
touch DTOs/Common/RejectDto.cs
touch DTOs/Common/PaginationDto.cs

# Data, Hubs, Helpers, Middlewares
touch Data/AppDbContext.cs
touch Hubs/NotificationHub.cs
touch Helpers/FileUploadHelper.cs
touch Helpers/JwtHelper.cs
touch Middlewares/ExceptionMiddleware.cs

cd ..

# ──────────────────────────────────────────────
# 2. Frontend — React App
# ──────────────────────────────────────────────
echo ""
echo "[3/4] Creating React frontend..."
npx -y create-react-app smartrent-frontend
cd smartrent-frontend

echo "[4/4] Installing frontend packages..."
npm install axios react-router-dom @microsoft/signalr react-toastify

# Create frontend folder structure
echo "Creating frontend folder structure..."
mkdir -p src/pages/auth
mkdir -p src/pages/admin
mkdir -p src/pages/landlord
mkdir -p src/pages/tenant
mkdir -p src/components
mkdir -p src/services
mkdir -p src/context
mkdir -p src/utils

# Create frontend files
echo "Creating frontend files..."

# Pages — Auth
touch src/pages/auth/Login.jsx
touch src/pages/auth/Register.jsx

# Pages — Admin
touch src/pages/admin/AdminDashboard.jsx

# Pages — Landlord
touch src/pages/landlord/LandlordDashboard.jsx
touch src/pages/landlord/MyProperties.jsx
touch src/pages/landlord/AddProperty.jsx
touch src/pages/landlord/EditProperty.jsx
touch src/pages/landlord/VisitRequests.jsx
touch src/pages/landlord/RentalRequests.jsx

# Pages — Tenant
touch src/pages/tenant/Home.jsx
touch src/pages/tenant/PropertyDetails.jsx
touch src/pages/tenant/BookVisit.jsx
touch src/pages/tenant/ApplyRental.jsx
touch src/pages/tenant/MyVisits.jsx
touch src/pages/tenant/MyApplications.jsx
touch src/pages/tenant/Favorites.jsx

# Components
touch src/components/Navbar.jsx
touch src/components/PropertyCard.jsx
touch src/components/SearchBar.jsx
touch src/components/NotificationBell.jsx
touch src/components/ProtectedRoute.jsx

# Services
touch src/services/api.js
touch src/services/authService.js
touch src/services/propertyService.js
touch src/services/visitService.js
touch src/services/rentalService.js
touch src/services/favoriteService.js
touch src/services/reviewService.js
touch src/services/notificationService.js

# Context
touch src/context/AuthContext.jsx

# Utils
touch src/utils/signalRConnection.js
touch src/utils/constants.js

cd ..

echo ""
echo "=========================================="
echo "  SmartRent setup complete!"
echo "=========================================="
echo ""
echo "To run the backend:"
echo "  cd SmartRent.API && dotnet run"
echo ""
echo "To run the frontend:"
echo "  cd smartrent-frontend && npm start"
echo ""

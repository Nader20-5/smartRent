# SmartRent — Project Structure

> Full-stack property rental management application built with .NET Core Web API + React.js + SQL Server

---

## 📁 File Tree

```
SmartRent/
├── setup.sh                                    # One-click project setup script
├── PROJECT_STRUCTURE.md                        # This file — project overview & conventions
│
├── SmartRent.API/                              # ── Backend (.NET Core Web API) ──
│   ├── SmartRent.API.csproj                    # Project file with NuGet package references
│   ├── Program.cs                              # App entry point — DI, middleware, pipeline config
│   ├── appsettings.json                        # Connection string & JWT config (placeholders)
│   │
│   ├── Controllers/
│   │   ├── AuthController.cs                   # POST /api/auth/register, POST /api/auth/login
│   │   ├── AdminController.cs                  # GET users, toggle status, dashboard stats (Admin only)
│   │   ├── PropertyController.cs               # CRUD properties, upload images (Landlord)
│   │   ├── VisitController.cs                  # Create/approve/reject/cancel visits
│   │   ├── RentalController.cs                 # Create/approve/reject rental applications
│   │   ├── FavoriteController.cs               # Toggle & list favorite properties
│   │   ├── ReviewController.cs                 # CRUD reviews on properties (Tenant)
│   │   └── NotificationController.cs           # List, mark read, unread count
│   │
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   ├── IAuthService.cs                 # Register + Login signatures
│   │   │   ├── IAdminService.cs                # User mgmt + dashboard stats signatures
│   │   │   ├── IPropertyService.cs             # Property CRUD + image upload signatures
│   │   │   ├── IVisitService.cs                # Visit scheduling signatures
│   │   │   ├── IRentalService.cs               # Rental application signatures
│   │   │   ├── IFavoriteService.cs             # Favorite toggle/list signatures
│   │   │   ├── IReviewService.cs               # Review CRUD signatures
│   │   │   └── INotificationService.cs         # Notification mgmt signatures
│   │   │
│   │   └── Implementations/
│   │       ├── AuthService.cs                  # Auth business logic (TODO)
│   │       ├── AdminService.cs                 # Admin business logic (TODO)
│   │       ├── PropertyService.cs              # Property business logic (TODO)
│   │       ├── VisitService.cs                 # Visit business logic (TODO)
│   │       ├── RentalService.cs                # Rental business logic (TODO)
│   │       ├── FavoriteService.cs              # Favorite business logic (TODO)
│   │       ├── ReviewService.cs                # Review business logic (TODO)
│   │       └── NotificationService.cs          # Notification business logic (TODO)
│   │
│   ├── Models/
│   │   ├── User.cs                             # User entity — auth, roles, profile
│   │   ├── Property.cs                         # Property listing entity
│   │   ├── PropertyImage.cs                    # Image URLs linked to a property
│   │   ├── PropertyAmenity.cs                  # Amenity tags for a property
│   │   ├── VisitRequest.cs                     # Tenant visit scheduling entity
│   │   ├── RentalApplication.cs                # Tenant rental application entity
│   │   ├── ApplicationDocument.cs              # Documents attached to rental apps
│   │   ├── Favorite.cs                         # User-Property favorite bookmark
│   │   ├── Review.cs                           # Tenant review/rating for a property
│   │   └── Notification.cs                     # In-app notification entity
│   │
│   ├── DTOs/
│   │   ├── Auth/
│   │   │   ├── RegisterDto.cs                  # Registration request payload
│   │   │   ├── LoginDto.cs                     # Login request payload
│   │   │   └── AuthResponseDto.cs              # Auth response with JWT token
│   │   ├── Property/
│   │   │   ├── CreatePropertyDto.cs            # Create property request payload
│   │   │   ├── UpdatePropertyDto.cs            # Update property request payload
│   │   │   └── PropertyResponseDto.cs          # Property response for clients
│   │   ├── Visit/
│   │   │   ├── CreateVisitDto.cs               # Schedule visit request payload
│   │   │   └── VisitResponseDto.cs             # Visit response for clients
│   │   ├── Rental/
│   │   │   ├── CreateRentalDto.cs              # Rental application request payload
│   │   │   └── RentalResponseDto.cs            # Rental application response
│   │   └── Common/
│   │       ├── ServiceResult.cs                # Generic success/failure wrapper
│   │       ├── RejectDto.cs                    # Rejection reason payload
│   │       └── PaginationDto.cs                # Pagination params + PagedResult<T>
│   │
│   ├── Data/
│   │   └── AppDbContext.cs                     # EF Core DbContext — 10 DbSets + constraints
│   │
│   ├── Hubs/
│   │   └── NotificationHub.cs                  # SignalR hub for real-time notifications
│   │
│   ├── Helpers/
│   │   ├── FileUploadHelper.cs                 # File upload/validation utilities
│   │   └── JwtHelper.cs                        # JWT token generation/validation
│   │
│   └── Middlewares/
│       └── ExceptionMiddleware.cs              # Global exception handler middleware
│
└── smartrent-frontend/                         # ── Frontend (React.js) ──
    └── src/
        ├── App.jsx                             # Root component — Router + all routes
        │
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx                   # Login form page
        │   │   └── Register.jsx                # Registration form page
        │   ├── admin/
        │   │   └── AdminDashboard.jsx          # Admin dashboard — user mgmt, stats
        │   ├── landlord/
        │   │   ├── LandlordDashboard.jsx       # Landlord overview dashboard
        │   │   ├── MyProperties.jsx            # List of landlord's properties
        │   │   ├── AddProperty.jsx             # Create new property listing
        │   │   ├── EditProperty.jsx            # Edit existing property
        │   │   ├── VisitRequests.jsx            # Manage visit requests
        │   │   └── RentalRequests.jsx          # Manage rental applications
        │   └── tenant/
        │       ├── Home.jsx                    # Browse all properties
        │       ├── PropertyDetails.jsx         # Single property details page
        │       ├── BookVisit.jsx               # Schedule a property visit
        │       ├── ApplyRental.jsx             # Submit a rental application
        │       ├── MyVisits.jsx                # View my visit requests
        │       ├── MyApplications.jsx          # View my rental applications
        │       └── Favorites.jsx               # View saved favorite properties
        │
        ├── components/
        │   ├── Navbar.jsx                      # Navigation bar component
        │   ├── PropertyCard.jsx                # Reusable property card component
        │   ├── SearchBar.jsx                   # Search/filter bar component
        │   ├── NotificationBell.jsx            # Real-time notification bell icon
        │   └── ProtectedRoute.jsx              # Route guard — auth + role check
        │
        ├── services/
        │   ├── api.js                          # Axios instance + JWT interceptor (complete)
        │   ├── authService.js                  # Auth API calls (TODO)
        │   ├── propertyService.js              # Property API calls (TODO)
        │   ├── visitService.js                 # Visit API calls (TODO)
        │   ├── rentalService.js                # Rental API calls (TODO)
        │   ├── favoriteService.js              # Favorite API calls (TODO)
        │   ├── reviewService.js                # Review API calls (TODO)
        │   └── notificationService.js          # Notification API calls (TODO)
        │
        ├── context/
        │   └── AuthContext.jsx                 # Global auth state — user, token, login/logout
        │
        └── utils/
            ├── signalRConnection.js            # SignalR connection factory
            └── constants.js                    # API URL, roles, statuses, enum values
```

---

## 🚀 How to Run

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) (database already created)

### Backend

```bash
cd SmartRent.API

# Update appsettings.json with your connection string and JWT key

dotnet restore
dotnet run
```

The API will be available at `https://localhost:5001` (or `http://localhost:5000`).  
Swagger UI: `https://localhost:5001/swagger`

### Frontend

```bash
cd smartrent-frontend

npm install
npm start
```

The app will be available at `http://localhost:3000`.

### Using the Setup Script (first time)

```bash
chmod +x setup.sh
./setup.sh
```

This creates both projects, installs all packages, and scaffolds every file.

---

## 🌿 Git Branch Strategy

```
main ← dev ← pair1 / pair2 / pair3
```

| Branch   | Purpose                                        |
| -------- | ---------------------------------------------- |
| `main`   | Production-ready code only. Never commit here.  |
| `dev`    | Integration branch. All pairs merge here first. |
| `pair1`  | Feature branch for Pair 1                       |
| `pair2`  | Feature branch for Pair 2                       |
| `pair3`  | Feature branch for Pair 3                       |

### Workflow

1. Each pair creates their branch from `dev`
2. Work on features, commit frequently
3. Open a Pull Request from `pairX` → `dev`
4. At least one review before merging
5. After sprint, merge `dev` → `main` with a tag

---

## 📝 Naming Conventions

| Element                 | Convention                | Example                          |
| ----------------------- | ------------------------- | -------------------------------- |
| **C# Classes**          | PascalCase                | `PropertyService`                |
| **C# Interfaces**       | I + PascalCase            | `IPropertyService`               |
| **C# Methods**          | PascalCase + Async suffix | `GetByIdAsync()`                 |
| **C# Properties**       | PascalCase                | `MonthlyRent`                    |
| **C# Private fields**   | _camelCase                | `_context`                       |
| **Controllers**         | PascalCase + Controller   | `PropertyController`             |
| **DTOs**                | PascalCase + Dto          | `CreatePropertyDto`              |
| **API Routes**          | kebab-case                | `/api/visit/{id}/approve`        |
| **React Components**    | PascalCase .jsx           | `PropertyCard.jsx`               |
| **React Pages**         | PascalCase .jsx           | `LandlordDashboard.jsx`         |
| **JS Services**         | camelCase .js             | `propertyService.js`             |
| **JS Functions**        | camelCase                 | `getAllProperties()`             |
| **JS Constants**        | UPPER_SNAKE_CASE          | `API_URL`, `ROLES.ADMIN`        |
| **CSS Classes**         | kebab-case                | `.property-card`                 |
| **Database Tables**     | PascalCase (plural)       | `Users`, `Properties`           |
| **Database Columns**    | PascalCase                | `FirstName`, `CreatedAt`        |
| **Git Branches**        | lowercase                 | `dev`, `pair1`                   |
| **Git Commits**         | Conventional Commits      | `feat: add login endpoint`      |

### Commit Message Format

```
type(scope): short description

feat(auth): add JWT token generation
fix(property): correct image upload path
docs(readme): update run instructions
refactor(visit): extract validation logic
```

---

## 📦 Installed Packages

### Backend (NuGet)

| Package                                              | Purpose                       |
| ---------------------------------------------------- | ----------------------------- |
| `Microsoft.EntityFrameworkCore.SqlServer`             | SQL Server EF Core provider   |
| `Microsoft.EntityFrameworkCore.Tools`                 | EF Core CLI tools             |
| `Microsoft.EntityFrameworkCore.Design`                | EF Core design-time services  |
| `Microsoft.AspNetCore.Authentication.JwtBearer`       | JWT authentication middleware |
| `BCrypt.Net-Next`                                     | Password hashing              |
| `Microsoft.AspNetCore.SignalR`                         | Real-time communication       |
| `Swashbuckle.AspNetCore`                              | Swagger/OpenAPI documentation |
| `AutoMapper.Extensions.Microsoft.DependencyInjection` | Object-to-object mapping      |

### Frontend (npm)

| Package                | Purpose                       |
| ---------------------- | ----------------------------- |
| `axios`                | HTTP client for API calls     |
| `react-router-dom`    | Client-side routing            |
| `@microsoft/signalr`  | SignalR client for real-time   |
| `react-toastify`      | Toast notifications UI         |

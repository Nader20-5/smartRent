# SmartRent

SmartRent is a comprehensive web-based property management platform designed to streamline the rental process for Landlords, Tenants, and Administrators. It allows landlords to list and manage their properties, tenants to explore properties, request visits, and apply for rentals, and administrators to oversee the platform.

## Features

- **Multi-Role Authentication & Authorization**: Secure access for Tenants, Landlords, and Admins using JWT.
- **Property Management**: Landlords can easily list, edit, and manage their properties.
- **Visit & Rental Requests**: Tenants can book property visits and submit rental applications.
- **Real-Time Notifications**: Instant updates via SignalR for visit requests, rental approvals, and system alerts.
- **Dashboards**: Dedicated dashboard interfaces for each role to track activities and statuses.
- **Property Search & Filtering**: Easy discovery of properties based on location, type, and status.

## Technology Stack

### Backend (`SmartRent.API`)
- **Framework**: .NET 8.0 Web API
- **Database ORM**: Entity Framework Core
- **Database**: SQL Server
- **Real-time Communication**: SignalR
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: BCrypt for password hashing
- **Documentation**: Swagger/OpenAPI

### Frontend (`smartrent-frontend`)
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time Client**: `@microsoft/signalr`
- **Styling & UI**: Vanilla CSS with dynamic responsive layouts and `react-icons`.

## Project Structure

- `/SmartRent.API`: Contains the ASP.NET Core backend API, handling data persistence, business logic, authentication, and real-time SignalR hubs.
- `/smartrent-frontend`: Contains the Vite + React frontend application, featuring role-based routing, real-time notification components, and interactive dashboards.

## Getting Started

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 or higher)
- SQL Server (LocalDB or dedicated instance)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd SmartRent.API
   ```
2. Restore .NET dependencies:
   ```bash
   dotnet restore
   ```
3. Update the database (Entity Framework Migrations):
   ```bash
   dotnet ef database update
   ```
4. Run the API:
   ```bash
   dotnet run
   ```
   The API will typically expose Swagger UI at `/swagger`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd smartrent-frontend
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (if required):
   Create a `.env` file to map `VITE_API_URL` and `VITE_SIGNALR_URL` to your local API instance.
4. Start the development server:
   ```bash
   npm run dev
   ```

## License
This project is an Internet Application Project and is provided as-is.

# Personal Calendar Manage - Google Calendar Integration

A modern booking and reservation system integrated with Google Calendar, built with a Clean Architecture approach.

## 🎯 Project Overview

This application allows users to manage bookings and reservations that automatically sync with their Google Calendar. Users authenticate via Google OAuth 2.0, and all their bookings are seamlessly integrated with their Google Calendar.

## 🏗️ Architecture

This is a monorepo containing:

- **Backend**: NestJS API with Clean Architecture (Hexagonal Architecture)
- **Frontend**: Next.js application with Server and Client Components
- **Database**: PostgreSQL managed with Prisma ORM

### Project Structure

```
personal-calendar-manage/
├── backend/              # NestJS API Server
│   ├── src/
│   │   ├── core/        # Domain layer (entities, use cases)
│   │   ├── infrastructure/  # Infrastructure layer (database, external services)
│   │   └── presentation/    # Presentation layer (controllers, DTOs)
│   ├── prisma/          # Database schema and migrations
│   └── .env.example     # Environment variables template
├── frontend/            # Next.js Frontend Application
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   ├── infrastructure/ # API client and services
│   ├── shared/         # Shared types and utilities
│   └── .env.example    # Environment variables template
├── docker-compose.yml  # PostgreSQL container configuration
└── .env.example        # Root environment variables documentation
```

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma 6
- **Authentication**: Passport (Google OAuth 2.0, JWT)
- **External APIs**: Google Calendar API
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React

### DevOps & Tools
- **Package Manager**: pnpm
- **Database Container**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest (Backend), React Testing Library (Frontend)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher
- **Docker**: Latest version
- **Docker Compose**: Latest version
- **Google Cloud Account**: For OAuth 2.0 credentials

### Install pnpm (if not installed)

```bash
npm install -g pnpm
```

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd personal-calendar-manage
```

### 2. Configure Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Copy environment variables template
cp .env.example .env

# Edit .env and fill in your values:
# - DATABASE_URL (use the same as docker-compose.yml)
# - JWT_SECRET (generate a secure random string)
# - GOOGLE_CLIENT_ID (from Google Cloud Console)
# - GOOGLE_CLIENT_SECRET (from Google Cloud Console)
# - GOOGLE_CALLBACK_URL (http://localhost:3001/auth/google/callback)
# - FRONTEND_URL (http://localhost:3000)
```

### 4. Setup Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
pnpm install

# Copy environment variables template
cp .env.example .env

# Edit .env and set:
# - NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Start PostgreSQL Database

```bash
# From the root directory
docker-compose up -d

# Verify the database is running
docker ps
```

### 6. Run Database Migrations

```bash
# Navigate to backend directory
cd backend

# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Open Prisma Studio to view your database
pnpm prisma studio
```

### 7. Start the Applications

#### Terminal 1 - Backend
```bash
cd backend
pnpm start:dev
```

The backend API will be available at: `http://localhost:3001`

#### Terminal 2 - Frontend
```bash
cd frontend
pnpm dev
```

The frontend will be available at: `http://localhost:3000`

## 📚 Available Scripts

### Backend

```bash
# Development
pnpm start:dev          # Start in watch mode
pnpm start:debug        # Start in debug mode

# Build & Production
pnpm build              # Build the project
pnpm start:prod         # Start in production mode

# Code Quality
pnpm lint               # Run ESLint
pnpm format             # Format code with Prettier

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Generate coverage report
pnpm test:e2e           # Run end-to-end tests

# Database
pnpm prisma studio      # Open Prisma Studio
pnpm prisma migrate dev # Run migrations
pnpm prisma generate    # Generate Prisma Client
```

### Frontend

```bash
# Development
pnpm dev                # Start development server

# Build & Production
pnpm build              # Build for production
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run ESLint
```

## 🔐 Authentication Flow

1. User clicks "Login with Google" on the frontend
2. Frontend redirects to backend: `GET /auth/google`
3. Backend initiates Google OAuth flow
4. User authenticates with Google and grants permissions
5. Google redirects back to: `GET /auth/google/callback`
6. Backend:
   - Creates or updates user in database
   - Stores Google access/refresh tokens
   - Generates JWT token
7. Backend redirects to frontend with JWT in URL
8. Frontend stores JWT and uses it for subsequent API calls

## 🗄️ Database Schema

### User Model
- `id`: Unique identifier (CUID)
- `email`: User's Google email (unique)
- `name`: User's full name
- `picture`: Google avatar URL
- `googleId`: Google account ID (unique)
- `accessToken`: Google OAuth access token (for Calendar API)
- `refreshToken`: Google OAuth refresh token
- `tokenExpiry`: Token expiration timestamp
- `bookings`: One-to-many relationship with Booking

### Booking Model
- `id`: Unique identifier (CUID)
- `userId`: Foreign key to User
- `title`: Booking title
- `startTime`: Start date/time (timestamptz)
- `endTime`: End date/time (timestamptz)

## 🌐 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/me` - Get current user data

### Bookings
- `GET /bookings` - Get all user bookings
- `POST /bookings` - Create a new booking
- `GET /bookings/:id` - Get booking by ID
- `PATCH /bookings/:id` - Update a booking
- `DELETE /bookings/:id` - Delete a booking

## 🤝 Git Flow

This project uses Git Flow for branch management:

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `chore/*` - Maintenance tasks (configs, docs)

## 📖 Documentation

For more detailed documentation, see:

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🐛 Troubleshooting

### Permission denied errors on dist or .next directories

If you encounter permission errors:

```bash
# As root user (if you're in distrobox)
rm -rf backend/dist frontend/.next
```

### Database connection issues

```bash
# Check if PostgreSQL container is running
docker ps

# Check container logs
docker logs booking-postgres

# Restart the container
docker-compose restart postgres
```

### Port already in use

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9
```
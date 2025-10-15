# Backend - Personal Calendar Manage

RESTful API for the Personal Calendar Management system, built with NestJS and Clean Architecture principles.

## 🚀 Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL 15 (via Docker)
- **ORM**: Prisma 6.17
- **Authentication**: Passport (Google OAuth 2.0, JWT)
- **External APIs**: Google Calendar API (googleapis)
- **Validation**: class-validator, class-transformer
- **Testing**: Jest 30
- **Code Quality**: ESLint 9, Prettier 3, typescript-eslint

## 📁 Project Structure

```
backend/
├── src/
│   ├── core/                      # Domain Layer (Business Logic)
│   │   ├── domain/               # Domain entities
│   │   │   ├── bookings/
│   │   │   │   └── booking.entity.ts
│   │   │   └── users/
│   │   │       └── user.entity.ts
│   │   └── use-cases/            # Business use cases
│   │       ├── bookings/
│   │       │   ├── create-booking.use-case.ts
│   │       │   ├── get-bookings.use-case.ts
│   │       │   ├── update-booking.use-case.ts
│   │       │   └── delete-booking.use-case.ts
│   │       └── users/
│   │           └── get-user.use-case.ts
│   │
│   ├── infrastructure/            # Infrastructure Layer
│   │   ├── database/             # Database configuration
│   │   │   └── prisma.service.ts
│   │   ├── config/               # App configuration
│   │   │   └── env.config.ts
│   │   ├── guards/               # Auth guards
│   │   │   └── jwt-auth.guard.ts
│   │   └── strategies/           # Passport strategies
│   │       ├── google.strategy.ts
│   │       └── jwt.strategy.ts
│   │
│   ├── presentation/             # Presentation Layer (API)
│   │   ├── controllers/
│   │   │   ├── auth/
│   │   │   │   └── auth.controller.ts
│   │   │   └── bookings/
│   │   │       └── bookings.controller.ts
│   │   └── dtos/                # Data Transfer Objects
│   │       └── bookings/
│   │           ├── create-booking.dto.ts
│   │           └── update-booking.dto.ts
│   │
│   ├── app.module.ts             # Root module
│   ├── app.controller.ts         # Root controller
│   ├── app.service.ts            # Root service
│   └── main.ts                   # Application entry point
│
├── prisma/
│   ├── schema.prisma             # Prisma schema definition
│   └── migrations/               # Database migrations
│
├── test/                         # E2E tests
├── .env.example                  # Environment variables template
├── nest-cli.json                 # NestJS CLI configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🏗️ Architecture

This project follows **Clean Architecture** (Hexagonal Architecture) with clear separation of concerns:

### 1. **Domain Layer** (`/core/domain`)
- Pure business logic
- Domain entities (User, Booking)
- No external dependencies
- Framework-agnostic

### 2. **Use Cases Layer** (`/core/use-cases`)
- Application-specific business rules
- Orchestrates data flow between entities
- Independent of frameworks and databases
- Single Responsibility Principle

### 3. **Infrastructure Layer** (`/infrastructure`)
- Database access (Prisma)
- External services (Google OAuth, Calendar API)
- Authentication strategies (Passport)
- Configuration management
- Framework-specific implementations

### 4. **Presentation Layer** (`/presentation`)
- HTTP controllers (REST API)
- DTOs (Data Transfer Objects)
- Request/Response handling
- API documentation

## 🔧 Setup

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- Docker & Docker Compose (for PostgreSQL)
- Google Cloud Project with OAuth 2.0 credentials

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# See "Environment Variables" section below
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="postgresql://booking_user:booking_pass@localhost:5432/booking_db?schema=public"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secure-jwt-secret-min-64-chars"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Frontend
FRONTEND_URL="http://localhost:3000"
```

**Required variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing (use `openssl rand -base64 64`)
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

**Optional variables (have defaults):**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (default: development)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

### Database Setup

```bash
# Start PostgreSQL with Docker Compose (from root directory)
cd ..
docker-compose up -d

# Verify database is running
docker ps

# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# (Optional) Seed database
pnpm prisma db seed

# (Optional) Open Prisma Studio to view data
pnpm prisma studio  # Opens at http://localhost:5555
```

## 🚀 Development

```bash
# Start in watch mode (recommended for development)
pnpm start:dev

# Start in debug mode
pnpm start:debug

# The API will be available at http://localhost:3001
```

## 🏗️ Build & Production

```bash
# Build the project
pnpm build

# Start in production mode
pnpm start:prod
```

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:cov

# Run end-to-end tests
pnpm test:e2e
```

## 🧹 Code Quality

```bash
# Run ESLint
pnpm lint

# Format code with Prettier
pnpm format
```

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  picture       String?   // Google avatar
  googleId      String    @unique
  // Google OAuth tokens for Calendar API
  accessToken   String?   @db.Text
  refreshToken  String?   @db.Text
  tokenExpiry   DateTime?
  // Relations
  bookings      Booking[]
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}
```

### Booking Model

```prisma
model Booking {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  startTime   DateTime @db.Timestamptz
  endTime     DateTime @db.Timestamptz
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Indexes for performance
  @@index([userId])
  @@index([startTime, endTime])
  @@map("bookings")
}
```

## 🌐 API Endpoints

### Authentication

#### `GET /auth/google`
Initiate Google OAuth 2.0 flow

**Response**: Redirects to Google OAuth consent screen

---

#### `GET /auth/google/callback`
Google OAuth callback endpoint

**Query Parameters:**
- `code` - OAuth authorization code (from Google)

**Response**: Redirects to frontend with JWT token
```
http://localhost:3000/auth/callback?token=<jwt_token>
```

---

#### `GET /auth/me`
Get current authenticated user data

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "clx123abc",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "googleId": "1234567890",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

### Bookings

All booking endpoints require JWT authentication.

---

#### `GET /bookings`
Get all bookings for the authenticated user

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "clx456def",
    "userId": "clx123abc",
    "title": "Team Meeting",
    "startTime": "2025-01-20T14:00:00.000Z",
    "endTime": "2025-01-20T15:00:00.000Z",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

---

#### `POST /bookings`
Create a new booking

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Team Meeting",
  "startTime": "2025-01-20T14:00:00.000Z",
  "endTime": "2025-01-20T15:00:00.000Z"
}
```

**Validations:**
- `title`: required, non-empty string
- `startTime`: required, valid ISO 8601 date
- `endTime`: required, valid ISO 8601 date, must be after startTime

**Response:** `201 Created`
```json
{
  "id": "clx789ghi",
  "userId": "clx123abc",
  "title": "Team Meeting",
  "startTime": "2025-01-20T14:00:00.000Z",
  "endTime": "2025-01-20T15:00:00.000Z",
  "createdAt": "2025-01-15T12:00:00.000Z",
  "updatedAt": "2025-01-15T12:00:00.000Z"
}
```

**Note**: Also creates an event in the user's Google Calendar.

---

#### `GET /bookings/:id`
Get a specific booking by ID

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "clx789ghi",
  "userId": "clx123abc",
  "title": "Team Meeting",
  "startTime": "2025-01-20T14:00:00.000Z",
  "endTime": "2025-01-20T15:00:00.000Z",
  "createdAt": "2025-01-15T12:00:00.000Z",
  "updatedAt": "2025-01-15T12:00:00.000Z"
}
```

---

#### `PATCH /bookings/:id`
Update an existing booking

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body** (all fields optional):
```json
{
  "title": "Updated Meeting Title",
  "startTime": "2025-01-20T15:00:00.000Z",
  "endTime": "2025-01-20T16:00:00.000Z"
}
```

**Response:** `200 OK`
```json
{
  "id": "clx789ghi",
  "userId": "clx123abc",
  "title": "Updated Meeting Title",
  "startTime": "2025-01-20T15:00:00.000Z",
  "endTime": "2025-01-20T16:00:00.000Z",
  "createdAt": "2025-01-15T12:00:00.000Z",
  "updatedAt": "2025-01-15T14:00:00.000Z"
}
```

**Note**: Also updates the event in Google Calendar.

---

#### `DELETE /bookings/:id`
Delete a booking

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** `204 No Content`

**Note**: Also deletes the event from Google Calendar.

## 🔐 Authentication & Authorization

### Google OAuth 2.0 Flow

1. Frontend redirects user to `GET /auth/google`
2. Backend redirects to Google OAuth consent screen
3. User authorizes the application
4. Google redirects to `GET /auth/google/callback?code=...`
5. Backend:
   - Exchanges code for Google tokens
   - Fetches user profile from Google
   - Creates/updates user in database
   - Stores Google access/refresh tokens
   - Generates JWT token
6. Backend redirects to frontend with JWT
7. Frontend stores JWT for subsequent requests

### JWT Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**JWT Payload:**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1705320000,
  "exp": 1705406400
}
```

**Token Expiration**: 1 day (configurable in `env.config.ts`)

## 🔄 Google Calendar Integration

The backend integrates with Google Calendar API to sync bookings:

- **Create Booking** → Creates event in Google Calendar
- **Update Booking** → Updates event in Google Calendar
- **Delete Booking** → Deletes event from Google Calendar

**Required OAuth Scopes:**
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/calendar`

## 📦 Key Dependencies

### Core
- `@nestjs/core@11.0.1` - NestJS framework
- `@nestjs/common@11.0.1` - Common utilities
- `@nestjs/platform-express@11.0.1` - Express adapter
- `typescript@5.7.3` - TypeScript language

### Database
- `@prisma/client@6.17.1` - Prisma ORM client
- `prisma@6.17.1` - Prisma CLI

### Authentication
- `@nestjs/passport@11.0.5` - Passport integration
- `@nestjs/jwt@11.0.1` - JWT utilities
- `passport@0.7.0` - Authentication middleware
- `passport-google-oauth20@2.0.0` - Google OAuth strategy
- `passport-jwt@4.0.1` - JWT strategy

### Validation
- `class-validator@0.14.2` - Decorator-based validation
- `class-transformer@0.5.1` - Object transformation

### External APIs
- `googleapis@162.0.0` - Google Calendar API client

### Testing
- `jest@30.0.0` - Testing framework
- `ts-jest@29.2.5` - TypeScript support for Jest
- `supertest@7.0.0` - HTTP testing

## 🐛 Debugging

### Enable Debug Mode

```bash
# Start with debug logging
pnpm start:debug

# Attach debugger on port 9229
```

### Prisma Studio

```bash
# Visual database browser
pnpm prisma studio

# Opens at http://localhost:5555
```

### Common Issues

**1. Database connection failed**
- Verify PostgreSQL is running: `docker ps`
- Check `DATABASE_URL` in `.env`
- Ensure database exists: `docker exec -it booking-postgres psql -U booking_user -d booking_db`

**2. Google OAuth errors**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check authorized redirect URIs in Google Cloud Console
- Ensure Google Calendar API is enabled

**3. JWT token invalid**
- Check `JWT_SECRET` is set in `.env`
- Verify token hasn't expired (1 day expiration)
- Ensure Authorization header format: `Bearer <token>`

## 📚 Learn More

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Passport Documentation](http://www.passportjs.org/docs/)
- [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🔗 Related Documentation

- [Root README](../README.md) - Project overview
- [Frontend README](../frontend/README.md) - Frontend application documentation
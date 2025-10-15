# Frontend - Personal Calendar Manage

Frontend application for the Personal Calendar Management system, built with Next.js 15 and the App Router.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.5 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5
- **HTTP Client**: Axios 1.12
- **Date Utilities**: date-fns 4
- **Icons**: Lucide React
- **Code Quality**: ESLint 9, eslint-config-next

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (login)
│   ├── dashboard/         # Dashboard page
│   ├── auth/              # Auth callback pages
│   │   ├── callback/      # OAuth callback handler
│   │   └── error/         # Auth error page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── BookingCalendar.tsx
│   ├── BookingForm.tsx
│   └── BookingList.tsx
├── infrastructure/        # Infrastructure layer
│   └── api/
│       └── axios-client.ts  # Axios instance configuration
├── shared/                # Shared code
│   ├── types/            # TypeScript types
│   │   └── booking.types.ts
│   └── store/            # Zustand stores
│       └── auth.store.ts
├── .env.example          # Environment variables template
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🏗️ Architecture

The frontend follows a layered architecture:

### 1. **App Layer** (`/app`)
- Next.js App Router pages and layouts
- Server and Client Components
- Route handlers

### 2. **Components Layer** (`/components`)
- Reusable React components
- UI components for bookings management
- Calendar display components

### 3. **Infrastructure Layer** (`/infrastructure`)
- API client configuration (Axios)
- External service integrations
- HTTP interceptors

### 4. **Shared Layer** (`/shared`)
- TypeScript type definitions
- Global state management (Zustand stores)
- Utility functions
- Constants

## 🔧 Setup

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- Backend API running on `http://localhost:3001`

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env and configure:
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## 🚀 Development

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:3000
```

The development server features:
- Hot Module Replacement (HMR)
- Fast Refresh for instant feedback
- Automatic compilation
- Error overlay

## 🏗️ Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# The production app will be available at http://localhost:3000
```

## 🧪 Code Quality

```bash
# Run ESLint
pnpm lint

# ESLint will check for:
# - Code style issues
# - Potential bugs
# - Best practices violations
# - Next.js specific rules
```

## 📦 Key Dependencies

### Core
- `next@15.5.5` - React framework with App Router
- `react@19.1.0` - UI library
- `react-dom@19.1.0` - React DOM renderer
- `typescript@5` - Type safety

### State & Data Management
- `zustand@5.0.8` - Lightweight state management
- `axios@1.12.2` - HTTP client for API requests

### UI & Styling
- `tailwindcss@4` - Utility-first CSS framework
- `lucide-react@0.545.0` - Beautiful icon library
- `date-fns@4.1.0` - Modern date utility library

## 🔐 Authentication Flow

1. User lands on home page (`/`)
2. Clicks "Login with Google"
3. Redirects to backend: `${NEXT_PUBLIC_API_URL}/auth/google`
4. Google OAuth flow completes
5. Backend redirects to `/auth/callback?token=<jwt>`
6. Callback page:
   - Extracts JWT from URL
   - Stores it in Zustand store
   - Redirects to `/dashboard`
7. Protected routes check for JWT before rendering

## 🌐 API Integration

The frontend communicates with the backend API using Axios.

### Axios Client Configuration

Located in `infrastructure/api/axios-client.ts`:

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use((config) => {
  const token = getToken(); // From Zustand store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Endpoints Used

```typescript
// Authentication
GET /auth/google              // Initiate OAuth
GET /auth/google/callback     // OAuth callback
GET /auth/me                  // Get current user

// Bookings
GET    /bookings              // Get all user bookings
POST   /bookings              // Create new booking
GET    /bookings/:id          // Get booking by ID
PATCH  /bookings/:id          // Update booking
DELETE /bookings/:id          // Delete booking
```

## 🎨 Styling with Tailwind CSS

This project uses Tailwind CSS 4 with the new `@tailwindcss/postcss` plugin.

### Configuration Files

- `tailwind.config.ts` - Tailwind configuration
- `postcss.config.mjs` - PostCSS configuration
- `app/globals.css` - Global styles and Tailwind directives

### Example Usage

```tsx
export default function BookingCard({ booking }: Props) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{booking.title}</h3>
      <p className="text-sm text-muted-foreground">
        {format(booking.startTime, 'PPpp')}
      </p>
    </div>
  );
}
```

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page with Google login button

### Protected Routes
- `/dashboard` - Main dashboard with bookings calendar
- `/auth/callback` - OAuth callback handler
- `/auth/error` - Authentication error page

## 🔄 State Management with Zustand

### Auth Store Example

```typescript
// shared/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

## 🎯 TypeScript Types

Shared types are defined in `shared/types/`:

```typescript
// shared/types/booking.types.ts
export interface Booking {
  id: string;
  userId: string;
  title: string;
  startTime: string; // ISO 8601 string
  endTime: string;   // ISO 8601 string
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  title: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingDto {
  title?: string;
  startTime?: string;
  endTime?: string;
}
```

## 🐛 Debugging

### Common Issues

**1. API Connection Errors**
- Verify backend is running on `http://localhost:3001`
- Check `NEXT_PUBLIC_API_URL` in `.env`
- Inspect Network tab in browser DevTools

**2. Authentication Issues**
- Clear browser localStorage
- Check JWT token in Zustand store
- Verify Google OAuth credentials in backend

**3. Build Errors**
- Delete `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && pnpm install`

### Development Tools

- **React DevTools**: Browser extension for React debugging
- **Network Tab**: Monitor API requests and responses
- **Console**: Check for JavaScript errors and logs

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [date-fns Documentation](https://date-fns.org)

## 🔗 Related Documentation

- [Root README](../README.md) - Project overview
- [Backend README](../backend/README.md) - Backend API documentation
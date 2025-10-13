# Personal Calendar Manage - Google Calendar Integration
Reservation system synchronized with Google Calendar.

## Tech Stack
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js + React + TailwindCSS
- **Auth**: Google OAuth 2.0
- **Package Manager**: pnpm

## Structure
booking-app/
├── backend/     # NestJS API
├── frontend/    # Next.js App
└── docker-compose.yml

## Requirements
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

## Quick Start
```bash
# Recommended install pnpm global
npm install -g pnpm

# Install dependencies
cd backend && pnpm install
cd ../frontend && pnpm install

# Start PostgreSQL
docker-compose up -d

# Start backend
cd backend && pnpm start:dev

# Start frontend
cd frontend && pnpm dev
# EmpathyOS

## Overview

EmpathyOS is an AI-powered micro-coaching web application for difficult workplace conversations, grounded in the "Love as a Strategy" framework. It guides users through a 4-step conversation flow:

1. **Clarify** – User describes the situation, goal, and fears; AI provides reframed intent, blind spots, and emotional context
2. **Draft** – User writes what they want to say; AI returns a coached version with coaching notes
3. **Anticipate** – AI simulates likely emotional reactions from the other person with suggested loving responses
4. **Reflect** – After the conversation, user logs what happened; AI provides micro-learning insights

The app uses OpenAI (via Replit AI Integrations) to power all coaching interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with two main routes: `/` (landing page) and `/chat` (conversation flow)
- **State Management**: TanStack React Query for server state; local component state for the multi-step conversation flow
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming. Warm, human design language using cream backgrounds, coral primary, muted gold secondary, and deep navy foreground. Custom fonts: Inter (body) and Playfair Display (headings)
- **Animations**: Framer Motion for page transitions and step reveals; react-confetti for celebration on completion
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js, written in TypeScript (run via tsx in dev, esbuild bundle in production)
- **API Design**: REST JSON endpoints defined in `shared/routes.ts` with Zod schemas for input validation and response types. All routes are registered in `server/routes.ts`
- **AI Integration**: OpenAI client configured via Replit AI Integrations environment variables (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`). System prompt embodies the Love as a Strategy coaching framework
- **API Routes**:
  - `POST /api/conversations` – Create a new conversation record
  - `GET /api/conversations` – List all conversations
  - `GET /api/conversations/:id` – Get single conversation
  - `PUT /api/conversations/:id` – Update conversation
  - `POST /api/ai/clarify` – AI coaching for Step 1
  - `POST /api/ai/draft` – AI coaching for Step 2
  - `POST /api/ai/anticipate` – AI coaching for Step 3
  - `POST /api/ai/reflect` – AI coaching for Step 4

### Database
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema**: Single `conversations` table in `shared/schema.ts` containing all fields for the 4-step flow (inputs and AI outputs). Uses `jsonb` columns for structured data like coaching notes and reactions
- **Migrations**: Managed via `drizzle-kit push` (`npm run db:push`)

### Shared Layer
- `shared/schema.ts` – Drizzle table definitions, Zod insert schemas, and TypeScript types
- `shared/routes.ts` – API route manifest with paths, methods, input/output Zod schemas (acts as a typed API contract between client and server)

### Build & Dev
- **Dev**: `npm run dev` runs the Express server with Vite middleware for HMR
- **Build**: `npm run build` runs a custom script (`script/build.ts`) that builds the Vite client and bundles the server with esbuild
- **Production**: `npm start` serves the built assets from `dist/`

### Replit Integrations
- `server/replit_integrations/` and `client/replit_integrations/` contain pre-built utilities for audio/voice chat, image generation, batch processing, and chat storage. These are scaffolding from Replit's AI integration system — the app primarily uses the OpenAI client for text-based coaching
- Note: `shared/models/chat.ts` contains an alternative chat schema (conversations + messages tables) from the Replit integration scaffolding that may conflict with the main schema in `shared/schema.ts`. The main app uses `shared/schema.ts`

## External Dependencies

### Required Services
- **PostgreSQL Database**: Must be provisioned and `DATABASE_URL` environment variable set
- **OpenAI API (via Replit AI Integrations)**: Requires `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables. Uses GPT models for all coaching endpoints

### Key NPM Packages
- **Frontend**: React, Wouter, TanStack React Query, Framer Motion, react-confetti, shadcn/ui (Radix UI primitives), Tailwind CSS, Lucide icons, react-hook-form with Zod resolvers
- **Backend**: Express 5, OpenAI SDK, Drizzle ORM, pg (node-postgres), Zod, connect-pg-simple (session store)
- **Shared**: drizzle-zod, zod
- **Build**: Vite, esbuild, tsx
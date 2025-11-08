# AI Project Planning Engine

## Overview

This is an AI-powered project planning and task management platform that helps developers break down software projects into actionable tasks. The application uses Google's Gemini AI to analyze project requirements, generate system architecture, and automatically create task breakdowns in a Kanban board format. The platform features a clean, developer-focused UI inspired by Atlassian's design system, with emphasis on clarity and efficient workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript in SPA (Single Page Application) mode
- **Rationale**: React provides component reusability and TypeScript ensures type safety, reducing runtime errors
- **UI Library**: Shadcn/ui with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens following Atlassian design principles
- **State Management**: TanStack React Query for server state, local React state for UI
- **Routing**: Wouter for lightweight client-side routing

**Design System**:
- Typography: Inter for UI/body text, JetBrains Mono for code snippets
- Color scheme: Professional blue accent (#0052CC) with semantic status colors (lozenges)
- Layout: Fixed sidebar navigation (256px), fluid content area with responsive grid
- Components follow Atlassian/Jira patterns (cards, lozenges, avatars, kanban boards)

### Backend Architecture

**Server Framework**: Express.js (Node.js) serving as API gateway
- **Rationale**: Express provides minimal, flexible API routing suitable for orchestration layer
- **Session Management**: Uses connect-pg-simple for PostgreSQL-backed sessions
- **Build System**: Vite for frontend bundling, esbuild for server compilation
- **Development**: Hot module replacement via Vite middleware in dev mode

**API Design**: RESTful endpoints with /api prefix
- Projects CRUD operations
- Task management
- AI job orchestration (triggers generation workflows)
- Integration endpoints for external tools (GitHub, Jira, Slack - planned)

### Data Storage

**Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database access
- **Rationale**: PostgreSQL chosen for relational data integrity, ACID compliance for project/task relationships
- **Schema**: Currently implements user authentication schema, designed to extend with projects, tasks, modules, architectures
- **Connection**: Neon's serverless driver with WebSocket support for edge environments

**Storage Pattern**: MemStorage class provides in-memory fallback during development, designed to be swapped with database implementation

### Authentication & Authorization

**Authentication**: JWT-based authentication pattern (infrastructure ready)
- Session storage in PostgreSQL via connect-pg-simple
- User schema with username/password fields
- Passwords expected to be hashed (bcrypt recommended)

**Session Management**: Express sessions with PostgreSQL backing for production persistence

### AI Integration

**AI Service**: Google Gemini AI (@google/genai)
- **Purpose**: Requirements analysis, architecture generation, task decomposition, developer spec creation
- **Workflow Stages**:
  1. Requirements Analysis - Parse and understand project scope
  2. Architecture Generation - Create module breakdowns with technology recommendations
  3. Schema Design - Generate database schemas
  4. Task Breakdown - Create epics, stories, subtasks with story points
  5. Spec Generation - Developer-ready implementation prompts

**Processing Pattern**: Frontend initiates AI jobs, backend orchestrates calls to Gemini, progress updates via simulated stages (production would use WebSockets or polling)

### Build & Deployment

**Development**:
- Vite dev server with HMR
- TypeScript compilation without emit (type checking only)
- Express serves Vite middleware in dev mode

**Production**:
- Frontend: Vite build outputs to dist/public
- Backend: esbuild bundles server code to dist/index.js
- Single Node.js process serves both static assets and API

**Database Migrations**: Drizzle Kit for schema management with push command

## External Dependencies

### Third-Party Services

**Google Gemini AI** (@google/genai v1.29.0)
- LLM service for AI-powered project analysis and generation
- Requires API key configuration

**Neon Database** (@neondatabase/serverless)
- Serverless PostgreSQL hosting
- WebSocket-based connections for edge compatibility
- Requires DATABASE_URL environment variable

### UI Component Libraries

**Radix UI** (Multiple packages v1.x)
- Unstyled, accessible component primitives
- Dialog, Dropdown, Select, Toast, Tooltip, Tabs, and 20+ other components

**Shadcn/ui Configuration**
- Custom component library built on Radix primitives
- Tailwind-based styling with CSS variables
- "new-york" style variant selected

### Development Tools

**Replit Plugins** (Development only)
- vite-plugin-cartographer: Code navigation
- vite-plugin-dev-banner: Development indicators
- vite-plugin-runtime-error-modal: Enhanced error overlay

### Additional Libraries

**Date Handling**: date-fns for date formatting and manipulation
**Form Management**: React Hook Form with Zod resolver for validation
**Command Palette**: cmdk for search/command interface
**Icons**: Lucide React for consistent iconography
**Utilities**: clsx + tailwind-merge for conditional className handling

### Planned Integrations

Based on requirements documentation, the following external integrations are planned but not yet implemented:
- **GitHub**: Repository sync, issue creation
- **Jira**: Task export, project sync
- **Slack**: Notifications, updates
- **Stripe**: Payment processing (for e-commerce example projects)
- **Elasticsearch**: Advanced search (for task/project search)
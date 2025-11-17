# ArchiMind

AI-powered project planning and architecture engine that transforms ideas into comprehensive project specifications.

## Screenshots

### Dashboard

<img width="1920" height="1080" alt="Screenshot (2)" src="https://github.com/user-attachments/assets/43355094-65aa-4125-853f-c3cab27f7ccc" />

### Project Planning

<img width="1920" height="1080" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/59491b37-0cbb-4519-b88f-a4f3dca10273" />

### Kanban Board

<img width="1920" height="1080" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/075bd391-c8ee-4fd4-905f-7efb9d8c577a" />

### Analytics

<img width="1920" height="1080" alt="Screenshot (8)" src="https://github.com/user-attachments/assets/1df047d6-5187-449e-a2c8-d9137aef7014" />

## Features

- **AI-Powered Planning**: Uses Google Gemini AI to analyze requirements and generate complete project plans
- **Architecture Generation**: Automatically creates system architecture, database schemas, and module breakdowns
- **Task Management**: Kanban board interface with AI-generated tasks, epics, and stories
- **Atlassian Design System**: Clean, professional UI following Jira design principles
- **Real-time Analytics**: Reports and dashboards for project insights

## Tech Stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon serverless)
- **AI**: Google Gemini API
- **ORM**: Drizzle ORM

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Session encryption secret

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:5000`

## Architecture

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

## Project Structure

- `/client` - React frontend application
- `/server` - Express backend API
- `/shared` - Shared types and schemas
- `/db` - Database schemas and migrations

## Features Overview

### Project Planning

- Input project requirements
- AI generates comprehensive specifications
- Automated task breakdown with story points
- Architecture and schema recommendations

### Task Management

- Kanban board interface
- Drag-and-drop task organization
- Task types: Epics, Stories, Subtasks
- Priority and status tracking

### Analytics

- Project metrics and KPIs
- Team performance tracking
- AI usage statistics
- Sprint velocity reports

## Deployment

### Deploy to Netlify

This application is configured for deployment to Netlify using Netlify Functions.

**Quick Deploy:**

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Netlify](https://app.netlify.com/start)
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/public`
4. Add environment variables in Netlify dashboard:
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Session encryption secret (generate a random string)
   - `NODE_ENV` - Set to `production`
5. Deploy!

**Environment Variables:**

- `GEMINI_API_KEY`: Your Google Gemini API key
- `DATABASE_URL`: PostgreSQL connection string (e.g., Neon, Supabase, or other PostgreSQL provider)
- `SESSION_SECRET`: A random string for session encryption (you can generate one with: `openssl rand -base64 32`)
- `NODE_ENV`: Set to `production`

The application uses Netlify Functions to handle API routes (`/api/*`) and serves static files directly from the build output.

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

## License

MIT

# vibeathon

![Logo](assets/logo.png)

AI-powered project planning and architecture engine that transforms ideas into comprehensive project specifications.
g
## Screenshots

### Dashboard
![Dashboard](assets/screenshots/dashboard.png)

### Project Planning
![Project Planning](assets/screenshots/project-planning.png)

### Kanban Board
![Kanban Board](assets/screenshots/kanban-board.png)

### Analytics
![Analytics](assets/screenshots/analytics.png)

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

## Architecture

### System Architecture
![System Architecture](assets/architecture/system-architecture.png)

### Database Schema
![Database Schema](assets/architecture/database-schema.png)

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

## License

MIT

# vibeathon

AI-powered project planning and architecture engine that transforms ideas into comprehensive project specifications.

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

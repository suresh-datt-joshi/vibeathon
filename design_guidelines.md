# Design Guidelines: AI Project Planning Engine

## Design Approach
**Reference-Based**: Inspired by Postman and Insomnia API clients - clean, developer-focused interfaces with efficient information architecture and excellent data visualization.

## Core Design Principles
1. **Clarity First**: Information hierarchy optimized for rapid comprehension
2. **Developer-Centric**: Professional aesthetic targeting technical users
3. **Efficient Workflows**: Minimal clicks to accomplish core tasks
4. **Visual Feedback**: Clear states for AI processing and task completion

## Typography System
- **Primary Font**: Inter (UI elements, body text, headings)
- **Code Font**: JetBrains Mono (JSON output, technical specs, API endpoints)
- **Scale**: 
  - Hero/Display: 2.5rem (40px) - Inter Bold
  - H1: 1.875rem (30px) - Inter Semibold
  - H2: 1.5rem (24px) - Inter Semibold
  - H3: 1.25rem (20px) - Inter Medium
  - Body: 0.875rem (14px) - Inter Regular
  - Small/Caption: 0.75rem (12px) - Inter Regular
  - Code: 0.875rem (14px) - JetBrains Mono

## Layout System
**Spacing Units**: Use Tailwind spacing - primarily 2, 4, 6, 8, 12, 16 units
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Card gaps: gap-4 to gap-6
- Consistent 16px (4 units) base rhythm

**Grid Structure**:
- Sidebar: Fixed 256px width on desktop, collapsible on mobile
- Main content: Fluid with max-w-7xl container
- Cards: 2-3 column grid on desktop (grid-cols-2 lg:grid-cols-3)
- Forms: Single column max-w-2xl for optimal reading

## Component Library

### Navigation
- **Sidebar**: Fixed left navigation, dark slate background (#1E293B), icons + labels
- **Top Bar**: Project selector, user menu, notification bell, search
- **Breadcrumbs**: Show hierarchy (Workspace > Project > Architecture)

### Dashboard Cards
- White background, subtle shadow (shadow-sm), rounded corners (rounded-lg)
- Header with title + action button
- Content area with appropriate padding (p-6)
- Hover state: subtle shadow increase (hover:shadow-md)

### Kanban Board
- **Columns**: Backlog, To Do, In Progress, Review, Done
- **Cards**: Draggable task cards with priority badges, assignee avatars
- **Visual Density**: Compact cards showing title, type icon, story points
- Add task button at bottom of each column

### Architecture Diagram
- **Node-based visualization**: Interactive components showing services/modules
- Connection lines showing data flow
- Color-coded by service type (Frontend: blue, Backend: emerald, AI: violet)
- Zoom controls and minimap for large diagrams

### Forms & Inputs
- **Input Fields**: Border #E2E8F0, focus ring in primary blue, height h-10
- **Text Areas**: Rich text editor for requirements (min-h-40)
- **Buttons**: Primary (blue), Secondary (outline), Success (emerald)
- **Dropdowns**: Custom styled with chevron icon

### Data Display
- **Tables**: Striped rows, sortable headers, hover highlight
- **JSON Viewer**: Syntax-highlighted, collapsible sections, copy button
- **Progress Indicators**: Linear progress bars for AI processing
- **Status Badges**: Pill-shaped, color-coded (blue: in progress, emerald: complete, violet: AI generated)

### Modals & Overlays
- **Modal**: Centered, max-w-2xl, backdrop blur
- **Slide-over Panel**: Right-side panel for details/editing (w-96)
- **Toast Notifications**: Top-right, auto-dismiss, success/error states

## Page Layouts

### Dashboard Home
- **Header**: Welcome message, quick stats (projects, tasks, AI jobs)
- **Grid**: Recent projects (3 columns), recent activity feed
- **CTA Section**: "Create New Project" prominent action

### Project Detail
- **Tabs**: Overview, Architecture, Tasks, Prompts, Settings
- **Overview Tab**: Requirements display, AI status, generated artifacts cards
- **Architecture Tab**: Interactive diagram + module details panel
- **Tasks Tab**: Full Kanban board with filters

### AI Generation Flow
- **Step Indicator**: Show progress (Requirements → Architecture → Tasks → Prompts)
- **Live Updates**: Real-time status with animated dots during processing
- **Results Preview**: Expandable cards showing generated content

## Interaction Patterns
- **Drag & Drop**: Tasks between Kanban columns with smooth transitions
- **Click to Edit**: Inline editing for task titles, descriptions
- **Keyboard Shortcuts**: CMD+K for search, N for new project
- **Loading States**: Skeleton screens for data loading, spinner for AI processing

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation for all workflows
- Focus visible states (ring-2 ring-primary)
- Sufficient contrast ratios (WCAG AA minimum)
- Screen reader announcements for AI job completion

## Images
No hero images needed - this is a dashboard application focused on productivity and data visualization. All visual interest comes from:
- Clean layout and typography
- Interactive diagrams and charts
- Well-designed component states
- Subtle animations on state changes
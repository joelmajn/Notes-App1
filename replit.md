# Overview

This is a full-stack notes application built with React, Express, TypeScript, and PostgreSQL. The application provides a comprehensive note-taking experience with categories, tags, checklists, reminders, and search functionality. It features a modern UI built with shadcn/ui components and Tailwind CSS, with both light and dark theme support. The app is designed to be responsive and includes Progressive Web App (PWA) capabilities with offline functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Theme System**: Custom theme provider supporting light/dark/system modes

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful API with comprehensive CRUD operations
- **Data Storage**: In-memory storage implementation with interface for easy database migration
- **Development Server**: Vite integration for hot module replacement in development

## Database Schema
- **Notes Table**: Core entity with title, content, category, tags, checklist, reminders, favorites, and archive functionality
- **Categories Table**: Organizational system with colors for visual categorization
- **Tags Table**: Flexible tagging system for cross-cutting note organization
- **Relationships**: Notes reference categories via foreign key, tags stored as arrays

## Key Features
- **Note Management**: Full CRUD operations with rich text content
- **Organization**: Category-based organization with color coding
- **Tagging**: Flexible tag system for multi-dimensional organization
- **Checklists**: JSON-based checklist items within notes
- **Reminders**: Date-based reminders with repeat options
- **Search**: Full-text search across note titles and content
- **Favorites & Archive**: Special collections for important and archived notes
- **Responsive Design**: Mobile-first design with dedicated mobile navigation
- **PWA Support**: Service worker for offline functionality and app-like experience

## Development Architecture
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Development Setup**: Hot reload for both frontend and backend changes
- **Error Handling**: Runtime error overlay and comprehensive error boundaries

# External Dependencies

## Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL database client for Neon
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation and type inference
- **date-fns**: Date manipulation and formatting

## UI Component Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional CSS class utilities
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel components

## Development Dependencies
- **vite**: Frontend build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database migration and schema management tools

## PWA Dependencies
- Service worker for offline functionality
- Web app manifest for app-like installation
- Background sync capabilities for offline note operations

## Database Integration
- PostgreSQL as the primary database (configured for Neon)
- Drizzle ORM for type-safe database operations
- Connection pooling via DATABASE_URL environment variable
- Migration system for schema updates
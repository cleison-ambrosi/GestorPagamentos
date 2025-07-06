# Payment Management System

## Overview

This is a full-stack payment management system built with React, Express.js, and PostgreSQL. The application helps businesses manage contracts, suppliers, payment schedules, and financial tracking. It features a modern UI built with shadcn/ui components and Tailwind CSS, with a RESTful API backend using Drizzle ORM for database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Comprehensive set of accessible components using Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: MySQL with Drizzle ORM
- **Connection**: Aiven MySQL cloud database with SSL
- **Development**: Hot-reload development server with middleware logging
- **Build**: ESBuild for production bundling

## Key Components

### Database Schema (MySQL)
The system manages several core entities using MySQL database:
- **Empresas (Companies)**: Business entities with name and CNPJ
- **Fornecedores (Suppliers)**: Vendor information with contact details
- **Plano de Contas (Chart of Accounts)**: Hierarchical account structure
- **Tags**: Categorization system with color coding
- **Contratos (Contracts)**: Contract management with payment terms
- **Títulos (Payment Titles)**: Individual payment obligations
- **Título Baixa (Payment Records)**: Payment execution tracking

### Frontend Features
- **Dashboard**: Overview with key metrics and upcoming payments
- **Contract Management**: Create and manage payment contracts
- **Supplier Management**: Vendor database with contact information
- **Payment Tracking**: Monitor payment schedules and overdue amounts
- **Financial Reports**: Generate various financial reports
- **Responsive Design**: Mobile-friendly interface

### API Endpoints
- RESTful API structure with CRUD operations for all entities
- Dashboard endpoint for aggregated financial data
- Comprehensive error handling and logging
- Request/response logging for debugging

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Processing**: Express.js routes handle requests and validate data
3. **Database Operations**: Drizzle ORM executes type-safe database queries
4. **Response Handling**: Data is returned and cached on the client
5. **UI Updates**: React components re-render with fresh data

## External Dependencies

### Database
- **Aiven MySQL**: Cloud-hosted MySQL database with SSL encryption
- **Connection Pooling**: Efficient database connection management
- **SSL Certificate**: Secure connections using ca.pem certificate

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESLint**: Code quality and consistency
- **Vite**: Fast development builds and HMR

## Deployment Strategy

### Development
- Vite development server with hot module replacement
- Express.js server with request logging
- Database migrations using Drizzle Kit
- Development environment detection for debugging tools

### Production
- Client-side build output to `dist/public`
- Server-side bundle to `dist/index.js`
- Static file serving from Express.js
- Environment-based configuration

### Build Process
1. Client build: `vite build` creates optimized React bundle
2. Server build: `esbuild` creates Node.js compatible bundle
3. Database: `drizzle-kit push` applies schema changes
4. Deployment: Single Node.js process serves both API and static files

## Changelog

Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Major UI updates: 
  * Fixed plano de contas deletion icon color for consistency
  * Updated header colors in fornecedores and empresas pages
  * Completely redesigned relatorios page with new layout
  * Added resumo por empresa cards to dashboard
  * Replaced dashboard bottom cards with títulos recentes table
  * Standardized deletion icon colors across all pages (slate instead of red)
  * Updated contratos and titulos layouts per design specifications
- July 04, 2025. Layout simplification: 
  * Implemented clean simple layout for títulos, contratos, and plano de contas pages
  * Removed complex tabs and empresa selection combos from main listing views
  * Added simple search bar and direct table view matching design requirements
  * Created configurações system for saving empresa selections with database persistence
  * Implemented automatic toast notifications for user feedback
- July 05, 2025. Enhanced filtering system:
  * Added empresa dropdown filter and search input to contratos and titulos pages
  * Implemented responsive layout with proper labels for filter controls
  * Both filters work simultaneously for precise data filtering
- July 05, 2025. MySQL configuration system:
  * Converted entire system architecture from PostgreSQL to MySQL
  * Updated schema definitions to use MySQL syntax with proper data types
  * Implemented SSL certificate support using ca.pem file
  * Created comprehensive MySQL connection diagnostics
  * Added /mysql-config page for connection status monitoring
  * Configured environment variable support for flexible MySQL connections
  * Added retry logic and detailed error reporting for connection issues
  * Note: Current MySQL server (mysql8free-gestor-f.aivencloud.com:18411) has DNS resolution issues in Replit environment
- July 06, 2025. Complete MySQL migration finalized:
  * Successfully established connection to Aiven MySQL server with SSL
  * Removed all PostgreSQL dependencies and references
  * Configured MySQL credentials via Replit secrets for security
  * System fully operational with MySQL database backend
  * All API endpoints working with MySQL data layer
- July 06, 2025. UI standardization update:
  * Updated fornecedores page to match plano de contas visual design
  * Implemented consistent header panel with white background and blue accent button
  * Applied standardized table styling with ID column and hover effects
  * Used uniform spacing and typography following established design patterns

## User Preferences

Preferred communication style: Simple, everyday language.
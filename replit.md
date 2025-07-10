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
- July 07, 2025. Título management enhancements:
  * Restructured título CRUD modal to use 3-column layout for better organization
  * Removed "todas as empresas" option from company filter dropdowns in títulos and contratos pages
  * Fixed date validation issues in título creation by updating insertTituloSchema with proper date transformation
  * Updated título modal to use real data from API endpoints instead of hardcoded values
  * Fixed foreign key constraint errors by ensuring proper data mapping between frontend and database
  * System now successfully creates títulos with proper validation and data persistence
  * Reverted company selection persistence feature due to configuration API issues
- July 07, 2025. Status system overhaul and database fixes:
  * Converted títulos status field from string enum to numeric values (1-4: Em Aberto, Parcial, Pago, Cancelado)
  * Removed "cancelado" boolean field from títulos schema as status now handles this state
  * Updated storage layer to use new numeric status filtering (status != 4 for non-cancelled titles)
  * Made status field readonly in título modal with automatic text conversion display
  * Fixed MySQL storage implementation to properly implement IStorage interface
  * Simplified dashboard getDashboardData method temporarily to resolve connection issues
  * Updated título badge display system to work with numeric status values
  * Implemented company filter auto-population in título creation modal when filter is active
  * Fixed all database queries to use new status system instead of removed cancelado field
- July 07, 2025. Enhanced sidebar design and relatórios restructuring:
  * Redesigned sidebar with "Contas a Pagar" branding, compact layout (w-56), and blue accent colors
  * Updated all icons to be smaller (w-4 h-4) and more professional appearance
  * Completely restructured relatórios page to group titles by due date (vencimento)
  * Implemented daily totalization with subtotals per date and grand total
  * Removed individual vencimento column since data is now grouped by date
  * Enhanced visual hierarchy with date headers and improved spacing
  * Fixed default filter to show "Em Aberto" titles instead of restrictive date filters
- July 09, 2025. Payment system with timestamp and cancellation features:
  * Updated payment date field to capture full datetime instead of just date
  * Enhanced payment history to display date and time together (e.g., "07/01/2025 às 14:30")
  * Implemented automatic payment calculation: valor pago = valor baixa + juros - desconto
  * Added payment cancellation system with "cancelado" field in titulo_baixa table
  * Payment cancellation marks records as cancelled while keeping them in history
  * Cancelled payments display with red background, "CANCELADA" badge, and struck-through values
  * Balance calculations properly exclude cancelled payments and restore values to título saldo
  * "Lançar Baixa" button disables when saldo=0 and shows "Título Liquidado" caption
  * Fixed real-time balance updates when payments are created or cancelled
  * Enhanced query invalidation to ensure immediate UI updates after payment operations
- July 10, 2025. Título cancellation system implementation:
  * Replaced delete functionality with título cancellation (status = 4)
  * Cancelled titles cannot be edited or receive new payments
  * Edit and Baixa buttons are hidden for cancelled titles in the listing
  * Cancel button (X icon) only appears for non-cancelled titles
  * Modal forms are disabled when título status is "Cancelado"
  * Save and "Lançar Baixa" buttons show appropriate disabled states
  * Added comprehensive validation to prevent modifications on cancelled titles
  * Confirmation dialog warns users that cancellation cannot be undone
  * Removed "Salvar" button from baixa modal - payments save immediately
  * Baixa modal now only shows "Fechar" button for clean workflow
  * All payment operations (create/cancel) auto-save without user confirmation
  * Added auto-focus on "Valor Baixa" field when entering baixa tab
  * Real-time balance updates in "Saldo Atual" display after payment operations
  * All balance calculations now use current título data for immediate updates
- July 10, 2025. Dynamic button visibility based on balance:
  * "Salvar" button in título modal only appears when saldo > 0 or for new títulos
  * Button visibility updates dynamically when balance changes through payments/cancellations
  * Implemented real-time synchronization between baixas tab and dados tab button state
  * For títulos with zero balance, only "Cancelar" button remains visible in dados tab
  * System maintains proper business logic preventing modifications when title is fully paid

## User Preferences

Preferred communication style: Simple, everyday language.
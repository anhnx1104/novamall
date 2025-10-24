# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (development mode without SSL on custom server)
- `npm run build` - Build the application for production
- `npm run start` - Start production server with SSL enabled on port 8080
- `npm run start_dev` - Start production server without SSL (for dev environment)
- `npm run lint` - Run ESLint code linting
- `npm run seed` - Run database seeder scripts
- `npm run s3tolocal` - Convert S3 URLs to local file paths
- `npm run analyze` - Analyze bundle size with webpack analyzer

## PM2 Production Commands

The application is configured for PM2 deployment with two environments:

- `pm2 start ecosystem.config.js --only novamall-prod` - Production (cluster mode, port 8080, SSL enabled)
- `pm2 start ecosystem.config.js --only novamall-stg` - Staging (single instance, port 8080, no SSL)
- `pm2 logs novamall-prod` - View production logs
- `pm2 logs novamall-stg` - View staging logs

## Architecture Overview

This is a Next.js 13 e-commerce application with the following structure:

### Core Technologies
- **Next.js 13** with Pages Router (not App Router)
- **Express.js** custom server ([server.js](server.js)) for static file serving from `/public/uploads`
- **MongoDB** with Mongoose ODM
- **Redux Toolkit** for state management
- **NextAuth.js** for authentication
- **Styled Components** for styling
- **Internationalization** via ni18n (supports en, bn, ar, fr, kr)

### Directory Structure
- `/pages` - Next.js pages with API routes in `/pages/api`
- `/components` - React components organized by feature
- `/lib` - Shared utility functions (cart handling, rebates, email, etc.)
- `/utils` - Core utilities including database connection ([dbConnect.js](utils/dbConnect.js))
- `/models` - Mongoose database schemas
- `/redux` - Redux slices (cart, session, settings)
- `/styles` - Global CSS and styled-components
- `/public` - Static assets including uploads directory served by Express
- `/seeder` - Database seeding scripts (.mjs files)

### Key Features
- Multi-language e-commerce platform
- User authentication and authorization
- Shopping cart and checkout flow
- Admin dashboard for management
- Product catalog with categories and attributes
- Order tracking and management
- File upload capabilities with S3 integration
- Email notifications via nodemailer
- Payment processing with Stripe

### Database Models
Core entities in `/models`: User, Product, Category, Brand, Order, Coupon, Address, Notification, Event, Group, GroupRanking, PointHistory, Notice, FAQ, Form, Refund, ShippingCharge, Newsletter, Webpages, Setting

### State Management
Redux store ([redux/store.js](redux/store.js)) with slices:
- `cart.slice.js` - Shopping cart state
- `session.slice.js` - User session state
- `settings.slice.js` - Application settings

### Authentication
NextAuth.js with MongoDB adapter at `/pages/api/auth/[...nextauth].js`, supporting session-based authentication with role-based access control (requireAuth/requireAuthAdmin page properties)

### Custom Server
Express server ([server.js](server.js)) serves static files from `/public/uploads` and proxies all other requests to Next.js

### Page Layout System
Pages use special properties for layout control:
- `Component.requireAuth` - Requires user authentication
- `Component.requireAuthAdmin` - Requires admin authentication
- `Component.dashboard` - Uses dashboard layout
- `Component.footer/header` - Controls footer/header visibility
- `Component.headerBack/headerBackText` - Back button in header

### Styling
Global CSS with Bootstrap 5 and custom styled-components. Uses Google Fonts (Roboto, Inter) and Pretendard for Korean. Custom CSS variables for theming.

### File Uploads
Handled via formidable with S3 integration for cloud storage. Static uploads served from `/public/uploads` via Express server.

### Internationalization
Configured via [ni18n.config.js](ni18n.config.js) with support for en, bn, ar, fr, kr. Applied to app in [_app.js](pages/_app.js) using `appWithI18Next` wrapper.
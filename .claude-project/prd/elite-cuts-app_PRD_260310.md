# elite-cuts-app — Product Requirements Document

**Version:** 1.0
**Date:** 2023-10-27
**Status:** Draft

---

## 0. Project Overview

### Product

**Name:** elite-cuts-app
**Type:** Web App (Mobile-Responsive for Clients, Desktop-Optimized for Admin)
**Deadline:** Q1 2024
**Status:** Draft

### Description

Elite Cuts is a premier barbershop brand in Houston, TX, currently operating with fragmented systems (Square at one location, paper-based at another). The **elite-cuts-app** is a unified digital platform designed to centralize booking, manage a real-time walk-in queue for 12+ barbers, automate commission tracking, and enhance client retention through a built-in loyalty program and SMS automation.

### Goals

1. **Unify Operations:** Move both Houston locations onto a single digital source of truth, eliminating paper logs.
2. **Optimize Throughput:** Balance scheduled appointments with a dynamic walk-in queue to maximize barber "chair time."
3. **Automate Financials:** Eliminate manual spreadsheet calculations for barber commissions and payouts.
4. **Increase Retention:** Use SMS reminders and a loyalty point system to reduce no-shows and increase visit frequency.

### Target Audience

| Audience | Description |
|----------|-------------|
| **Primary** | **Clients:** Local Houston residents seeking high-quality grooming with the convenience of digital booking. |
| **Secondary** | **Barbers:** Professional service providers needing to manage their schedules and track earnings. |
| **Tertiary** | **Shop Owners/Managers:** Administrators focused on shop performance, payroll, and marketing. |

### User Types

| Type | DB Value | Description | Key Actions |
|------|----------|-------------|-------------|
| **Client** | `0` | End customer | Book appointments, join walk-in queue, view loyalty points. |
| **Barber** | `1` | Service provider | Manage personal schedule, view daily earnings, check-in clients. |
| **Admin** | `99` | Shop Owner/Manager | Full system access, payroll/commission reports, staff management. |

### User Status

| Status | DB Value | Behavior |
|--------|----------|----------|
| **Active** | `0` | Full access to relevant features. |
| **Suspended** | `1` | Cannot log in — show: "Account suspended. Please contact management." |
| **Flagged** | `2` | "No-show" history — requires pre-payment for future bookings. |

### MVP Scope

**Included:**
- Multi-location booking engine.
- Real-time Walk-in Queue (Digital Kiosk mode).
- SMS Notifications (Twilio integration).
- Commission Tracking (Tiered percentages).
- Client CRM with visit history.
- Integrated Payments (Stripe/Square API).

**Excluded (deferred):**
- Inventory/Product Sales (Retail).
- Multi-language support (Spanish/English).
- Barber-to-Client direct chat.

---

## 1. Terminology

### Core Concepts

| Term | Definition |
|------|------------|
| **Elite Cuts App** | The unified platform for both Houston locations. |
| **The Chair** | A specific barber's station/availability. |
| **Walk-in Queue** | A virtual line for clients without appointments. |
| **Commission Split** | The percentage-based earnings shared between the shop and the barber. |
| **Loyalty Tier** | Status levels (Bronze, Silver, Gold) based on visit frequency. |

### User Roles

| Role | Description |
|------|-------------|
| **Guest** | Unauthenticated user viewing services and barber profiles. |
| **Client** | Registered user with booking and payment history. |
| **Barber** | Staff member with access to their specific calendar and commission dashboard. |
| **Admin** | High-level access for financial reporting and system configuration. |

### Status Values

| Enum | Values | Description |
|------|--------|-------------|
| **BookingStatus** | `PENDING`, `CONFIRMED`, `COMPLETED`, `NOSHOW`, `CANCELLED` | Lifecycle of an appointment. |
| **QueueStatus** | `WAITING`, `IN_CHAIR`, `FINISHED` | Lifecycle of a walk-in client. |
| **PaymentStatus** | `UNPAID`, `PARTIAL`, `PAID`, `REFUNDED` | Financial state of a service. |

---

## 2. System Modules

### Module 1 — Smart Booking & Scheduling

Handles the complex logic of matching client requests with barber availability across 12 chairs.

#### Main Features

1. **Dynamic Calendar** — Real-time availability based on barber shifts.
2. **Service Buffer Logic** — Automatically adds 5-10 minutes between cuts for cleaning.
3. **Multi-Location Toggle** — Switch between the two Houston locations.

#### Technical Flow

##### Appointment Creation

1. User selects "Location" -> "Service" -> "Barber" (or 'Any Available').
2. App queries `availability` table for the selected date/barber.
3. Backend (NestJS) validates that the slot doesn't overlap with existing bookings or walk-ins currently "In Chair."
4. On success:
   - Create record in `appointments` table.
   - Trigger Twilio SMS worker for confirmation.
   - Update barber's local view via WebSockets.
5. On failure:
   - Return "Slot no longer available" and suggest the next 3 closest times.

---

### Module 2 — Walk-in Queue Management

A digital alternative to the paper-based "sign-in sheet" for the second location.

#### Main Features

1. **Kiosk Check-in** — Simple UI for walk-ins to enter Name + Phone + Service.
2. **Wait-Time Estimator** — Algorithmic calculation based on average service time and queue length.
3. **SMS "Next Up" Alert** — Automated text when the client is 2nd in line.

#### Technical Flow

1. Client enters details at the shop tablet (Kiosk Mode).
2. Backend calculates `estimated_wait` = (Number of people in queue / Active Barbers) * 30 mins.
3. On success:
   - Client added to `walk_in_queue` with status `WAITING`.
   - Client receives SMS: "You're on the list! Est. wait: 45 mins."
4. When a barber marks a previous client as `FINISHED`:
   - System checks the queue.
   - If `queue_position == 2`, trigger "You're up next" SMS.

---

### Module 3 — Financials & Commission Tracking

Automates the calculation of barber earnings to replace manual Square/Paper reconciliation.

#### Main Features

1. **Commission Engine** — Calculates split (e.g., 60/40) per service.
2. **Payout Dashboard** — Weekly/Monthly views for barbers to see their take-home pay.
3. **Tip Management** — 100% pass-through of digital tips to the barber.

#### Technical Flow

1. Service is marked `COMPLETED` and `PAID`.
2. `CommissionService` in NestJS triggers.
3. Logic: `(ServicePrice * BarberCommissionRate) + Tip = BarberEarnings`.
4. Record created in `ledger` table linked to `BarberID` and `AppointmentID`.

---

## 3. User Application

### 3.1 Page Architecture

**Stack:** React, React Router, Tailwind CSS, TanStack Query.

#### Route Groups

| Group | Access |
|-------|--------|
| Public | Anyone (Landing, Services, Barber Profiles) |
| Auth | Unauthenticated (Login, Signup, Forgot Password) |
| Protected | Logged-in Clients (Dashboard, My Bookings, Loyalty) |

#### Page Map

**Public**
| Route | Page |
|-------|------|
| `/` | Home / Location Selection |
| `/services` | Service Menu & Pricing |
| `/barbers` | Barber Profiles & Portfolios |

**Auth**
| Route | Page |
|-------|------|
| `/login` | Client/Staff Login |
| `/register` | New Client Signup |

**Protected (Client)**
| Route | Page |
|-------|------|
| `/dashboard` | Upcoming Appointments & Loyalty Points |
| `/book` | Booking Flow (Wizard) |
| `/queue` | Join Walk-in Queue (Location-based) |
| `/history` | Past Cuts & Receipts |
| `/profile` | Personal Info & Preferences |

---

### 3.2 Feature List by Page

#### `/` — Home
- Hero section with "Book Now" vs "Join Queue" CTAs.
- Location cards (Houston North vs Houston South) with live wait times.

#### `/book` — Booking Wizard
- Step 1: Select Service (Haircut, Beard, Combo).
- Step 2: Select Barber (includes "First Available" option).
- Step 3: Date/Time Picker (Calendar view).
- Step 4: Payment/Deposit (Stripe Elements integration).

#### `/dashboard` — Client Dashboard
- **Loyalty Card:** Digital punch-card (e.g., "7/10 cuts until free service").
- **Active Booking:** Card showing time, barber, and "Add to Calendar" button.
- **Quick Rebook:** One-click button for "My Usual" (last service + last barber).

---

## 4. Admin Dashboard

### 4.1 Page Architecture

**Access:** Admin or Barber (Limited View)

| Route | Page |
|-------|------|
| `/admin` | Shop Overview (Live Chair Status) |
| `/admin/queue` | Queue Management (Drag & Drop) |
| `/admin/roster` | Staff Management & Schedules |
| `/admin/clients` | CRM / Client Database |
| `/admin/finance` | Commission & Revenue Reports |
| `/admin/settings` | Shop Hours & Service Pricing |

---

### 4.2 Feature List by Page

#### `/admin` — Shop Overview
- **Live Floor Map:** Visual representation of 12 chairs.
- **Status Indicators:** Green (Available), Red (Occupied), Yellow (Cleaning).
- **Daily Stats:** Total Revenue, No-show rate, Average Wait Time.

#### `/admin/queue` — Queue Management
- List of all walk-ins.
- **Manual Override:** Admin can move a VIP up the list or remove a "ghost" check-in.
- **Assign Barber:** Manually pair a walk-in with a specific chair.

#### `/admin/finance` — Finance & Commission
- **Barber Payout Table:** List of all 12 barbers, total services, total tips, and net payout.
- **Export:** Generate CSV for payroll processing.
- **Revenue Chart:** Comparison of Location A (Square) vs Location B (Paper-converted).

---

## 5. Tech Stack

### Architecture

The system uses a monorepo-style structure with a shared TypeScript types library to ensure consistency between the API and the Frontend.

```
elite-cuts-app/
├── backend/       ← NestJS API (Node.js)
├── frontend/      ← React Client App
└── shared/        ← TypeScript Interfaces & Constants
```

### Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Backend | NestJS | 10.x | Scalable API Architecture |
| Language | TypeScript | 5.x | Type safety across stack |
| ORM | TypeORM | 0.3.x | Database mapping & migrations |
| Database | PostgreSQL | 15 | Relational data (Bookings, Users) |
| Frontend | React | 18.x | UI Library |
| Routing | React Router | 6.x | Client-side navigation |
| State | TanStack Query | 5.x | Server state & Caching |
| CSS | Tailwind CSS | 3.x | Utility-first styling |
| Build | Vite | 4.x | Fast development & bundling |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **Twilio** | SMS Reminders and Queue Alerts |
| **Stripe** | Payment processing and deposit holds |
| **AWS S3** | Hosting barber portfolio images and client avatars |
| **Google Maps API** | Location services and distance calculation |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **PostgreSQL** | Necessary for complex relational queries involving 12 barbers, schedules, and financial ledgers. |
| **WebSockets (Socket.io)** | Required for the "Live Floor Map" and "Walk-in Queue" so admins see updates without refreshing. |
| **NestJS** | Provides a structured framework that makes it easy to add "Location C" in the future. |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string |
| `STRIPE_SECRET_KEY` | Payment processing |
| `TWILIO_AUTH_TOKEN` | SMS gateway credentials |
| `JWT_SECRET` | Secure user authentication |

---

## 6. Open Questions

| # | Question | Context / Impact | Owner | Status |
|:-:|----------|-----------------|-------|--------|
| 1 | **Square Data Migration?** | Do we need to import historical client data from the existing Square account? | Client | ⏳ Open |
| 2 | **Deposit Policy?** | Will all bookings require a deposit, or only for "Flagged" no-show users? | Client | ⏳ Open |
| 3 | **Hardware for Kiosk?** | Will the shop provide iPads for the walk-in queue check-in? | Client | ⏳ Open |
| 4 | **Commission Tiers?** | Do barbers have different rates (e.g., Senior vs. Junior)? | Client | ⏳ Open |
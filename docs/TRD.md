# Technical Requirements Document (TRD)
## ExampleHR Time-Off System

**Version:** 1.0  
**Date:** April 24, 2026  
**Status:** Complete

---

## 1. System Overview

The ExampleHR Time-Off System is a web application that enables employees to submit time-off requests and managers to approve or deny those requests. The system simulates a real-world Human Capital Management (HCM) backend with intentional failure modes to test and demonstrate client-side resilience patterns.

### 1.1 Key Features

- **Employee View**: Submit time-off requests, view balance table with optimistic updates
- **Manager View**: Review pending requests, approve/deny with preflight balance checks
- **Role Toggle**: Switch between Employee and Manager views for demonstration
- **Mock HCM Backend**: Simulates real-world API failures, data corruption, and anniversary bonuses

### 1.2 Users

- **Employees**: Submit time-off requests, view their balances
- **Managers**: Review pending requests, approve or deny with balance verification

---

## 2. Technology Stack

### 2.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.4 | React framework with App Router |
| React | 19.2.4 | UI library |
| React Query (TanStack Query) | 5.100.1 | Server state management |
| Zustand | 5.0.12 | Client-side UI state |
| Tailwind CSS | 4.x | Styling (CSS-first config) |

### 2.2 Backend (Mock)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.2.4 | REST API endpoints |
| node-cron | 4.2.1 | Anniversary timer scheduling |

### 2.3 Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| Jest | 30.3.0 | Unit/integration tests |
| @testing-library/react | 16.3.2 | React component testing |
| MSW | 2.13.5 | API mocking |

### 2.4 Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | 5.x | Type safety |
| ESLint | 9.x | Linting |
| Storybook | 8.6.18 | Component documentation |

---

## 3. Architecture

### 3.1 Directory Structure

```
examplehr-timeoff/
├── app/                          # Next.js App Router
│   ├── api/hcm/                 # Mock HCM API endpoints
│   │   ├── balance/route.ts      # GET single, POST submit
│   │   ├── batch/route.ts       # GET all balances
│   │   ├── check/route.ts       # POST preflight check
│   │   ├── deny/route.ts        # POST deny request
│   │   ├── anniversary/route.ts # POST trigger bonus
│   │   └── timer/route.ts       # GET timer status
│   ├── providers.tsx            # React Query provider
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page with role toggle
│   └── globals.css              # Tailwind CSS 4 config
│
├── src/
│   ├── lib/                     # Core utilities
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── hcmStore.ts        # In-memory HCM data store
│   │   ├── hcmClient.ts      # Fetch wrappers
│   │   ├── anniversaryTimer.ts # Client-side timer
│   │   └── anniversaryBackground.ts # Server-side cron
│   │
│   ├── stores/                   # Zustand stores (UI state)
│   │   ├── balanceStore.ts   # Balance + optimistic state
│   │   ├── requestStore.ts  # Pending requests
│   │   └── roleStore.ts     # Current role
│   │
│   ├── hooks/                    # React Query hooks
│   │   ├── useBalances.ts   # Fetch + submit mutations
│   │   └── useManagerActions.ts # Approve/deny/preflight
│   │
│   ├── components/
│   │   ├── balance/          # Balance table components
│   │   ├── request/         # Request form components
│   │   ├── manager/          # Manager view components
│   │   ├── shared/          # Reusable components
│   │   └── ui/             # UI components
│   │
│   └── stories/               # Storybook stories
│
├── tests/
│   ├── unit/                 # Unit tests (185 tests)
│   ├── integration/          # Integration tests (60 tests)
│   └── utils/               # Test helpers
│
├── jest.config.ts
└── package.json
```

### 3.2 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/hcm/balance` | GET | Fetch single employee balance |
| `/api/hcm/balance` | POST | Submit time-off request |
| `/api/hcm/batch` | GET | Fetch all employee balances (500ms delay) |
| `/api/hcm/check` | POST | Preflight balance verification |
| `/api/hcm/deny` | POST | Deny a request |
| `/api/hcm/anniversary` | POST | Trigger +5 days bonus |
| `/api/hcm/timer` | GET | Timer status |

### 3.3 Components

| Category | Components |
|----------|------------|
| Balance | `BalanceTable`, `BalanceRow` |
| Request | `RequestForm`, `LocationSelect`, `DaysInput` |
| Manager | `PendingRequestsList`, `RequestCard` |
| Shared | `ActionButtons`, `BalanceComparison`, `BalanceTableAlert`, `EmptyState`, `RequestPreview`, `StatusBadge`, `StatusMessage` |
| UI | `RoleToggle`, `AnniversaryTimer` |

### 3.4 State Management Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   React Components                          │
│  (BalanceTable, RequestForm, PendingRequestsList, etc.)    │
└──────────────────────────┬────────────────────────────────┘
                           │ Props
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Zustand Stores (UI State)                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │balanceStore │ │requestStore │ │ roleStore    │     │
│  │ - balances  │ │ - requests  │ │ -currentRole │     │
│  │- optimistic│ │ - addRequest│ │ - employeeId│     │
│  │ - stale     │ │ - updateReq │ │             │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              React Query (Server State)                 │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ useBatchBalances │  │ useSubmitRequest │             │
│  │ useApproveRequest│  │ useDenyRequest  │             │
│  │ usePreflightCheck│  │ useVerifyBalance│            │
│  └─────��────────────┘  └──────────────────┘             │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  HCM Client (hcmClient.ts)                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ getBalance │ │submitRequest│ │ denyRequest │          │
│  │ getBatch   │ │ checkBalance│ │triggerAnniv │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└──────────────────────────┬────────────────────────────────┘
                           │ HTTP
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                Mock HCM API (app/api/hcm/)                │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │balance │ │ batch  │ │ check  │ │ deny   │ │anniv   │  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              In-Memory HCM Store (hcmStore.ts)            │
│  Map<'emp-001:loc-ny', BalanceRecord>                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Data Models

### 4.1 Core Types (`src/lib/types.ts`)

```typescript
export type Role = 'employee' | 'manager';

export interface Location {
  id: string;
  name: string;
}

export interface Balance {
  employeeId: string;
  locationId: string;
  locationName: string;
  balanceDays: number;
  version: number;
  lastUpdated: string;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  locationId: string;
  locationName: string;
  requestedDays: number;
  submittedAt: string;
  status: RequestStatus;
  balanceAtSubmission: number;
}

export type RequestStatus =
  | 'idle'
  | 'optimistic'
  | 'pending'
  | 'approved'
  | 'denied'
  | 'hcmRejected';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
```

### 4.2 HCM Response Types

```typescript
export interface HcmBalanceResponse {
  success: boolean;
  balanceDays?: number;
  version?: number;
  lastUpdated?: string;
  error?: string;
  message?: string;
}

export interface HcmBatchResponse {
  balances: Balance[];
}

export interface HcmAnniversaryResponse {
  success: boolean;
  employeeId: string;
  locationId: string;
  bonusDays: number;
}
```

### 4.3 Data Entities

**Locations (4):**
- `loc-ny`: New York Office
- `loc-sf`: San Francisco Office
- `loc-chi`: Chicago Office
- `loc-uk`: London Office

**Employees (10):**
- `emp-001` to `emp-010` (Alice Johnson through Jack Davis)

---

## 5. Mock HCM Behaviors

The mock HCM backend simulates real-world API issues:

| Behavior | Rate | Details |
|----------|------|--------|
| Random Errors | 5% | balance, batch, check, deny endpoints return 500 error |
| Silent Corruption | 5% | batch endpoint removes random balance entry |
| Batch Delay | 500ms | Artificial delay on `/api/hcm/batch` |
| Anniversary Bonus | +5 days | Every 45 seconds to random employee |

### 5.1 Error Injection Locations

- `app/api/hcm/balance/route.ts`: Line 16 - 5% random 500 error
- `app/api/hcm/batch/route.ts`: Line 15 - 5% random 500 error; Line 26 - 5% silent corruption
- `app/api/hcm/check/route.ts`: Line 16 - 5% random 500 error
- `app/api/hcm/deny/route.ts`: Line 16 - 5% random 500 error

### 5.2 Anniversary Timer

- **Interval**: Every 45 seconds (`*/45 * * * * *`)
- **Bonus**: +5 days to random employee's random location
- **Implementation**: `node-cron` in development mode, client-side timer in `anniversaryTimer.ts`

---

## 6. Testing Coverage

### 6.1 Test Results

| Test Level | Tests | Status |
|------------|------|--------|
| Unit Tests | 185 | ✅ Passing |
| Integration Tests | 60 | ✅ Passing |
| **Total** | **245** | **All Passing** |

### 6.2 Coverage Metrics

| Metric | Coverage |
|--------|----------|
| Statements | 91.38% |
| Branches | 91.7% |
| Functions | 95% |
| Lines | 91.66% |

### 6.3 Test Suites (33 total)

- Unit: components (balance, request, manager, shared, ui), hooks, stores, lib
- Integration: API routes, workflows, error handling, store integration

---

## 7. Technical Challenges & Solutions

| Challenge | Description | Solution |
|-----------|------------|----------|
| **5% Random API Errors** | HCM endpoints randomly return 500 errors | Retry wrapper (`retryRequest()`) with exponential backoff in integration tests |
| **10% Data Corruption** | Batch endpoint silently returns incorrect data | Preflight balance check (`/api/hcm/check`) before any mutations |
| **Silent Failure** | Some failures don't throw explicit errors | React Query error boundaries + status messages in UI |
| **Race Conditions** | Concurrent requests may conflict | Version tracking on balances, optimistic UI updates |
| **State Sync** | UI state vs server state synchronization | Separate Zustand (UI) and React Query (server) stores |
| **Test Flakiness** | Random errors cause non-deterministic tests | Mock HTTP via MSW in integration, deterministic responses |
| **Batch Delay** | 500ms delay causes timeout in tests | Increased timeout in test config |

### 7.1 Error Handling Strategy

```
1. Request initiated
   ↓
2. Optimistic UI update (immediate)
   ↓
3. API call with retry (3 attempts)
   ↓
4. Success: Confirm optimistic update
   ↓
5. Failure: Show error message, revert optimistic update
```

---

## 8. Key Design Decisions

### 8.1 State Separation

- **Zustand**: UI state (current role, pending requests, balance cache)
- **React Query**: Server state (API data, caching, mutations)
- **Rationale**: Clear separation of concerns, easier testing and debugging

### 8.2 Component Architecture

- **Props Pattern**: All components receive data via props, no direct store access
- **Rationale**: Enables proper testing, supports Storybook, better reusability

### 8.3 Optimistic Updates

- **Implementation**: Balance decreases immediately on request submit
- **Confirmation**: React Query mutation on success
- **Rollback**: Revert on error with status message

### 8.4 Preflight Check

- **Requirement**: Manager approve must verify balance via `/api/hcm/check`
- **Rationale**: Prevent over-approval due to stale data or corruption

### 8.5 Error Handling

- **Retry Logic**: Exponential backoff for 5% random errors
- **User Feedback**: Status messages for all operations
- **Error Boundaries**: React Query error boundaries catch render failures

---

## 9. Running the Application

### 9.1 Development

```bash
npm run dev          # Start development server (localhost:3000)
npm run build       # Production build
npm run lint        # ESLint
npm run storybook   # Storybook (localhost:6006)
```

### 9.2 Testing

```bash
npm test              # Run all tests (245 tests)
npm run test:unit    # Run unit tests only (185 tests)
npm run test:integration  # Run integration tests only (60 tests)
npm run test:coverage # Run with coverage report
```

### 9.3 Demo Users

- **Current User**: `emp-001` (can be changed via role toggle)
- **Sample Employees**: `emp-001` through `emp-010`
- **Sample Locations**: New York, San Francisco, Chicago, London

---

## 10. Appendix

### 10.1 NPM Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest",
  "test:unit": "jest tests/unit",
  "test:integration": "jest tests/integration",
  "test:coverage": "jest --coverage",
  "storybook": "storybook dev -p 6006"
}
```

### 10.2 Dependencies

- `@tanstack/react-query`: ^5.100.1
- `msw`: ^2.13.5
- `next`: 16.2.4
- `node-cron`: ^4.2.1
- `react`: 19.2.4
- `react-dom`: 19.2.4
- `zustand`: ^5.0.12

### 10.3 Dev Dependencies

- `@playwright/test`: ^1.59.1
- `@tailwindcss/postcss`: ^4
- `@testing-library/react`: ^16.3.2
- `@types/jest`: ^30.0.0
- `eslint-config-next`: 16.2.4
- `jest`: 30.3.0
- `storybook`: 8.6.18
- `tailwindcss`: ^4

---

**End of TRD**
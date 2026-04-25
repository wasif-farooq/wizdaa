# ExampleHR Time-Off Application

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run storybook    # Storybook (localhost:6006)
npm run test         # All tests (Jest)
npm run test:unit    # jest tests/unit
npm run test:integration  # jest tests/integration
npm run test:coverage    # --coverage report
```

## Framework

- **Next.js 16** App Router — routes in `app/`, layouts in `layout.tsx`
- **No `src/` prefix** for app layer — `app/` is root; `src/` holds UI/stores/hooks/lib
- **Tailwind 4** — no `tailwind.config.js`; theme config lives in CSS `@theme` blocks
- **Server Components** — add `'use client'` for interactive components
- **Route Handlers** — `app/api/*/route.ts`

## Architecture

```
app/api/hcm/          # Mock HCM API routes (balance, batch, timer, anniversary, deny, check)
app/                  # App Router entrypoints (layout, page)
src/
  stores/             # Zustand (balanceStore, requestStore, roleStore)
  hooks/              # React Query hooks (useBalances, useManagerActions)
  components/         # Presentational components (balance, request, manager, ui)
  lib/                # hcmClient, hcmStore, types
  mocks/              # MSW handlers
tests/
  unit/               # Unit tests (balanceStore, requestStore, roleStore, hcmStore)
  integration/        # API route tests, workflow tests, store integration
  setup.ts            # Mocks React Query, next/navigation; resets beforeEach
  __mocks__/          # Mock implementations (hcmClient)
```

## State & Data Conventions

- **Zustand** for UI state; **React Query** for server state
- Components receive data via props, no direct store access
- API calls go through `src/lib/hcmClient.ts` only

## Mock HCM Behaviors (intentional failures for testing)

- `/api/hcm/balance` — GET/POST (5% error rate, 10% silent failure)
- `/api/hcm/batch` — GET all (500ms delay, 5% corruption)
- `/api/hcm/anniversary` — POST adds +5 days to random employee

## Test Setup

- **Jest** with `ts-jest` + `jsdom`
- **Setup**: `tests/setup.ts` — mocks `@tanstack/react-query` and `next/navigation`
- **Test files**: `**/*.test.{ts,tsx}` in `tests/` and `src/`
- **Coverage thresholds**: 80% statements/functions/lines, 70% branches

## Dev Notes

- Demo user: `emp-001`; 10 employees, 4 locations
- Anniversary timer: runs every 45s in dev only
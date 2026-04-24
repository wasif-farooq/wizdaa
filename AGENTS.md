# ExampleHR Time-Off Application

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run storybook    # Storybook (localhost:6006)
npm run test         # All tests (Jest)
npm run test:unit    # Unit tests only
npm run test:integration  # Integration tests only
npm run test:coverage    # With coverage report
```

## Framework (Next.js 16)

- **App Router**: Routes in `app/`, shared layouts in `layout.tsx`
- **No `src/` by default**: App folder IS root; `src/` holds UI code
- **Tailwind 4**: No `tailwind.config.js` — config in CSS `@theme` blocks
- **Server Components**: Use `'use client'` for interactive components
- **Route Handlers**: API routes in `app/api/*/route.ts`

## Architecture

```
app/api/hcm/         # Mock HCM API routes (balance, batch, anniversary)
app/                 # App Router entrypoints (layout, page)
src/
  stores/            # Zustand (balanceStore, requestStore, roleStore)
  hooks/             # React Query hooks (useBalances, useManagerActions)
  components/        # Presentational components (balance, request, manager, ui)
  lib/               # hcmClient, hcmStore, types
  mocks/             # MSW handlers
```

## Conventions

- **State**: Zustand for UI state; React Query for server state
- **Components**: Receive data via props, no direct store access
- **API calls**: Use `src/lib/hcmClient.ts` wrappers only

## Mock HCM Behaviors

- `/api/hcm/balance` — GET/POST (5% error, 10% silent failure)
- `/api/hcm/batch` — GET all (500ms delay, 5% corruption)
- `/api/hcm/anniversary` — POST adds +5 days to random employee

## Test Setup

- **Runner**: Jest with `ts-jest` + `jsdom`
- **Setup file**: `tests/setup.ts` (mocks React Query, next/navigation)
- **Test files**: Match `**/*.test.{ts,tsx}` in `tests/` and `src/`
- **Coverage threshold**: 80% statements/branches/lines, 70% branches

## Dev Notes

- Demo user: `emp-001`; 10 employees, 4 locations
- Anniversary timer: runs every 45s in dev only
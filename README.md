# Wizdaa - ExampleHR Time-Off Application

A premium time-off management application built with Next.js 16, featuring a robust mock HCM (Human Capital Management) backend.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn/pnpm)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wizdaa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Storybook

We use Storybook for component-driven development and visual testing.

To run Storybook:
```bash
npm run storybook
```
Open [http://localhost:6006](http://localhost:6006) to view the component library.

To build Storybook for production:
```bash
npm run build-storybook
```

## 🧪 Testing

The project uses Jest and React Testing Library for comprehensive test coverage.

- **Run all tests:**
  ```bash
  npm run test
  ```
- **Run unit tests:**
  ```bash
  npm run test:unit
  ```
- **Run integration tests:**
  ```bash
  npm run test:integration
  ```
- **Check coverage:**
  ```bash
  npm run test:coverage
  ```

> [!NOTE]
> Coverage thresholds: 80% for statements, functions, and lines; 70% for branches.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand (UI State), React Query (Server State)
- **Testing:** Jest, MSW (Mock Service Worker)
- **Runtime Logic:** Node-cron (for anniversary timers)

## 🏢 Architecture

- `app/`: Next.js App Router entrypoints and API routes.
- `src/components/`: Presentational components.
- `src/stores/`: Zustand stores for local state.
- `src/hooks/`: React Query hooks for data fetching.
- `src/lib/`: Shared utilities and HCM client logic.
- `tests/`: Unit and integration test suites.

## ⚙️ Mock HCM Behaviors

The application includes intentional API failures and delays to simulate real-world HCM behavior:
- **Balance API:** 5% error rate, 10% silent failure.
- **Batch API:** 500ms artificial delay, 5% data corruption.
- **Anniversary Timer:** Automatically runs every 45s in development mode to add +5 days to random employees.

## 👤 Demo Information

- **Demo User ID:** `emp-001`
- **Dataset:** 10 employees across 4 locations.

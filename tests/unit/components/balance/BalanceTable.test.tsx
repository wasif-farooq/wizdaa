import { render, screen } from '@testing-library/react';
import { BalanceTable } from '../../../../src/components/balance/BalanceTable';

describe('BalanceTable', () => {
  const mockBalances = [
    { locationId: 'loc-vacation', locationName: 'Vacation', balanceDays: 15, lastUpdated: '2024-01-15T10:00:00.000Z' },
    { locationId: 'loc-sick', locationName: 'Sick', balanceDays: 10, lastUpdated: '2024-01-15T10:00:00.000Z' },
  ];

  it('renders table header with total days', () => {
    render(
      <BalanceTable
        balances={mockBalances}
        optimisticDeductions={new Map()}
        staleLocations={new Set()}
      />
    );
    
    expect(screen.getByText('Time-Off Balances')).toBeInTheDocument();
    expect(screen.getByText('Total: 25 days')).toBeInTheDocument();
  });

  it('renders all balance rows', () => {
    render(
      <BalanceTable
        balances={mockBalances}
        optimisticDeductions={new Map()}
        staleLocations={new Set()}
      />
    );
    
    expect(screen.getByText('Vacation')).toBeInTheDocument();
    expect(screen.getByText('Sick')).toBeInTheDocument();
  });

  it('shows warning when partial data', () => {
    render(
      <BalanceTable
        balances={[mockBalances[0]]}
        optimisticDeductions={new Map()}
        staleLocations={new Set()}
        expectedLocations={4}
      />
    );
    
    expect(screen.getByText(/Some balances may be unavailable/)).toBeInTheDocument();
  });

  it('shows error alert when error is present', () => {
    render(
      <BalanceTable
        balances={mockBalances}
        optimisticDeductions={new Map()}
        staleLocations={new Set()}
        error="Failed to load balances"
      />
    );
    
    expect(screen.getByText(/Error loading balances/)).toBeInTheDocument();
  });

  it('displays optimistic deductions in yellow', () => {
    const optimisticDeductions = new Map([['loc-vacation', 5]]);
    render(
      <BalanceTable
        balances={mockBalances}
        optimisticDeductions={optimisticDeductions}
        staleLocations={new Set()}
      />
    );
    
    const yellowText = document.body.querySelector('.text-yellow-600');
    expect(yellowText?.textContent).toBe('10');
  });

  it('displays pending badge for optimistic locations', () => {
    const optimisticDeductions = new Map([['loc-vacation', 5]]);
    render(
      <BalanceTable
        balances={mockBalances}
        optimisticDeductions={optimisticDeductions}
        staleLocations={new Set()}
      />
    );
    
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('displays needs refresh badge for stale locations', () => {
    const staleLocations = new Set(['loc-vacation']);
    render(
      <BalanceTable
        balances={mockBalances}
        optimisticDeductions={new Map()}
        staleLocations={staleLocations}
      />
    );
    
    expect(screen.getByText('Needs refresh')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(
      <BalanceTable
        balances={mockBalances}
        optimisticDeductions={new Map()}
        staleLocations={new Set()}
      />
    );
    
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Days Available')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});
import { render, screen } from '@testing-library/react';
import { BalanceTableHeader } from '../../../../src/components/shared/BalanceTableHeader';

describe('BalanceTableHeader', () => {
  it('renders title and total days', () => {
    render(<BalanceTableHeader title="Vacation Balances" totalDays={15} />);
    
    expect(screen.getByText('Vacation Balances')).toBeInTheDocument();
    expect(screen.getByText('Total: 15 days')).toBeInTheDocument();
  });

  it('displays zero days correctly', () => {
    render(<BalanceTableHeader title="Sick Leave" totalDays={0} />);
    
    expect(screen.getByText('Total: 0 days')).toBeInTheDocument();
  });

  it('displays large numbers correctly', () => {
    render(<BalanceTableHeader title="PTO" totalDays={999} />);
    
    expect(screen.getByText('Total: 999 days')).toBeInTheDocument();
  });
});
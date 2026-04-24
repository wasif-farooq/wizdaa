import { render, screen } from '@testing-library/react';
import { BalanceRow } from '../../../../src/components/balance/BalanceRow';

describe('BalanceRow', () => {
  const defaultProps = {
    locationId: 'loc-vacation',
    locationName: 'Vacation',
    balanceDays: 15,
    lastUpdated: '2024-01-15T10:00:00.000Z',
  };

  it('renders balance row with location name and days', () => {
    render(<BalanceRow {...defaultProps} />);
    
    expect(screen.getByText('Vacation')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('shows effective days when optimistic', () => {
    render(<BalanceRow {...defaultProps} isOptimistic optimisticDays={5} />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('shows stale badge when stale', () => {
    render(<BalanceRow {...defaultProps} isStale />);
    
    expect(screen.getByText('Needs refresh')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    render(<BalanceRow {...defaultProps} isLoading />);
    
    expect(document.body.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows line-through original balance when optimistic', () => {
    render(<BalanceRow {...defaultProps} isOptimistic optimisticDays={3} />);
    
    const lineThrough = document.body.querySelector('.line-through');
    expect(lineThrough).toBeInTheDocument();
  });

  it('calculates effective days correctly with optimistic deduction', () => {
    render(<BalanceRow {...defaultProps} isOptimistic optimisticDays={20} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
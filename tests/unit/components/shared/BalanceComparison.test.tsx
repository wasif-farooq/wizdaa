import { render, screen } from '@testing-library/react';
import { BalanceComparison } from '../../../../src/components/shared/BalanceComparison';

describe('BalanceComparison', () => {
  it('renders when balances are equal', () => {
    render(<BalanceComparison submissionBalance={15} currentBalance={15} />);
    
    expect(screen.getByText('Current Balance:')).toBeInTheDocument();
    expect(screen.getByText('15 days')).toBeInTheDocument();
  });

  it('shows changed indicator when balances differ', () => {
    render(<BalanceComparison submissionBalance={15} currentBalance={12} />);
    
    expect(screen.getByText('(changed)')).toBeInTheDocument();
  });

  it('returns null when currentBalance is null', () => {
    const { container } = render(<BalanceComparison submissionBalance={15} currentBalance={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when currentBalance is undefined', () => {
    const { container } = render(<BalanceComparison submissionBalance={15} currentBalance={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders changed with lower balance', () => {
    render(<BalanceComparison submissionBalance={10} currentBalance={15} />);
    
    expect(screen.getByText('(changed)')).toBeInTheDocument();
  });
});
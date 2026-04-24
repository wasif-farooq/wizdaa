import { render, screen } from '@testing-library/react';
import { BalanceTableAlert } from '../../../../src/components/shared/BalanceTableAlert';

describe('BalanceTableAlert', () => {
  it('renders error alert correctly', () => {
    render(
      <BalanceTableAlert
        type="error"
        message="Failed to load"
        currentCount={2}
        expectedCount={4}
      />
    );
    
    expect(screen.getByText(/Error loading balances:/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load/)).toBeInTheDocument();
  });

  it('renders warning alert correctly', () => {
    render(
      <BalanceTableAlert
        type="warning"
        message=""
        currentCount={3}
        expectedCount={4}
      />
    );
    
    expect(screen.getByText(/Some balances may be unavailable/)).toBeInTheDocument();
  });

  it('renders info alert correctly', () => {
    render(
      <BalanceTableAlert
        type="info"
        message=""
        currentCount={0}
        expectedCount={4}
      />
    );
    
    expect(screen.getByText(/Loading balances/)).toBeInTheDocument();
  });

  it('uses custom message when provided', () => {
    render(
      <BalanceTableAlert
        type="error"
        message="Custom error message"
        currentCount={1}
        expectedCount={4}
      />
    );
    
    expect(screen.getByText(/Custom error message/)).toBeInTheDocument();
  });
});
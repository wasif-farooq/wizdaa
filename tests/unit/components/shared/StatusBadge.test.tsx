import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../../../src/components/shared/StatusBadge';

describe('StatusBadge', () => {
  it('renders optimistic status', () => {
    render(<StatusBadge status="optimistic" />);
    expect(screen.getByText('optimistic')).toBeInTheDocument();
  });

  it('renders pending status', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('renders approved status', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('approved')).toBeInTheDocument();
  });

  it('renders denied status', () => {
    render(<StatusBadge status="denied" />);
    expect(screen.getByText('denied')).toBeInTheDocument();
  });

  it('renders hcmRejected status', () => {
    render(<StatusBadge status="hcmRejected" />);
    expect(screen.getByText('hcmRejected')).toBeInTheDocument();
  });

  it('renders idle status', () => {
    render(<StatusBadge status="idle" />);
    expect(screen.getByText('idle')).toBeInTheDocument();
  });
});
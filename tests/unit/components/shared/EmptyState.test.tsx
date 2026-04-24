import { render, screen } from '@testing-library/react';
import { EmptyState } from '../../../../src/components/shared/EmptyState';

describe('EmptyState', () => {
  it('renders title and message', () => {
    render(<EmptyState title="No requests" message="There are no pending requests" />);
    
    expect(screen.getByText('No requests')).toBeInTheDocument();
    expect(screen.getByText('There are no pending requests')).toBeInTheDocument();
  });

  it('uses default icon when not specified', () => {
    render(<EmptyState title="Empty" message="Nothing here" />);
    const container = document.body.querySelector('[class*="rounded-lg"]');
    expect(container).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    render(<EmptyState title="Search" message="No results found" icon="🔍" />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
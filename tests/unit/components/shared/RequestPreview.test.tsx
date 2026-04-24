import { render, screen } from '@testing-library/react';
import { RequestPreview } from '../../../../src/components/shared/RequestPreview';

describe('RequestPreview', () => {
  const mockLocation = {
    id: 'loc-vacation',
    name: 'Vacation',
    balanceDays: 15,
  };

  it('renders request preview with correct details', () => {
    render(<RequestPreview location={mockLocation} requestedDays={5} />);
    
    expect(screen.getByText(/You are requesting/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Vacation')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calculates remaining days correctly', () => {
    render(<RequestPreview location={mockLocation} requestedDays={10} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows zero remaining when requesting more than available', () => {
    render(<RequestPreview location={mockLocation} requestedDays={20} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('returns null when location is undefined', () => {
    const { container } = render(<RequestPreview location={undefined} requestedDays={5} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when requestedDays is zero', () => {
    const { container } = render(<RequestPreview location={mockLocation} requestedDays={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when requestedDays is negative', () => {
    const { container } = render(<RequestPreview location={mockLocation} requestedDays={-1} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows location name in preview', () => {
    render(<RequestPreview location={mockLocation} requestedDays={3} />);
    
    expect(screen.getByText('Vacation')).toBeInTheDocument();
  });
});
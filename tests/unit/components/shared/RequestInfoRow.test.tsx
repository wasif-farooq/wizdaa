import { render, screen } from '@testing-library/react';
import { RequestInfoRow } from '../../../../src/components/shared/RequestInfoRow';

describe('RequestInfoRow', () => {
  it('renders label and value', () => {
    render(<RequestInfoRow label="Employee" value="John Doe" />);
    
    expect(screen.getByText('Employee')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<RequestInfoRow label="Days" value={5} />);
    
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders highlighted row', () => {
    render(<RequestInfoRow label="Total" value={15} highlighted />);
    
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders non-highlighted row by default', () => {
    render(<RequestInfoRow label="Status" value="Pending" highlighted={false} />);
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
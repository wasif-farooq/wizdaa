import { render, screen, fireEvent } from '@testing-library/react';
import { LocationSelect } from '../../../../src/components/request/LocationSelect';

describe('LocationSelect', () => {
  const mockLocations = [
    { id: 'loc-vacation', name: 'Vacation', balanceDays: 15 },
    { id: 'loc-sick', name: 'Sick', balanceDays: 10 },
    { id: 'loc-empty', name: 'Empty', balanceDays: 0 },
  ];

  it('renders with placeholder option', () => {
    render(<LocationSelect locations={mockLocations} value="" onChange={jest.fn()} />);
    
    expect(screen.getByText('Select a location')).toBeInTheDocument();
  });

  it('renders locations with available balance', () => {
    render(<LocationSelect locations={mockLocations} value="" onChange={jest.fn()} />);
    
    expect(screen.getByText('Vacation (15 days available)')).toBeInTheDocument();
    expect(screen.getByText('Sick (10 days available)')).toBeInTheDocument();
  });

  it('hides locations with zero balance', () => {
    render(<LocationSelect locations={mockLocations} value="" onChange={jest.fn()} />);
    
    expect(screen.queryByText('Empty')).not.toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(<LocationSelect locations={mockLocations} value="" onChange={onChange} />);
    
    const select = screen.getByLabelText('Location');
    fireEvent.change(select, { target: { value: 'loc-vacation' } });
    
    expect(onChange).toHaveBeenCalledWith('loc-vacation');
  });

  it('shows selected value', () => {
    render(<LocationSelect locations={mockLocations} value="loc-sick" onChange={jest.fn()} />);
    
    expect(screen.getByLabelText('Location')).toHaveValue('loc-sick');
  });

  it('disables select when disabled prop is true', () => {
    render(<LocationSelect locations={mockLocations} value="" onChange={jest.fn()} disabled />);
    
    expect(screen.getByLabelText('Location')).toBeDisabled();
  });

  it('handles empty locations array', () => {
    render(<LocationSelect locations={[]} value="" onChange={jest.fn()} />);
    
    expect(screen.getByText('Select a location')).toBeInTheDocument();
  });
});
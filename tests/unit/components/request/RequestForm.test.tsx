import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RequestForm } from '../../../../src/components/request/RequestForm';

describe('RequestForm', () => {
  const mockLocations = [
    { id: 'loc-vacation', name: 'Vacation', balanceDays: 15 },
    { id: 'loc-sick', name: 'Sick', balanceDays: 10 },
  ];

  it('renders form with all fields', () => {
    render(<RequestForm locations={mockLocations} onSubmit={jest.fn()} />);
    
    expect(screen.getByText('Request Time Off')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Days Requested')).toBeInTheDocument();
  });

  it('calls onSubmit with correct data', async () => {
    const onSubmit = jest.fn().mockResolvedValue({});
    render(<RequestForm locations={mockLocations} onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'loc-vacation' } });
    fireEvent.change(screen.getByLabelText('Days Requested'), { target: { value: '5' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit Request' }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        locationId: 'loc-vacation',
        days: 5,
      });
    });
  });

  it('disables submit button when submitting', () => {
    const onSubmit = jest.fn().mockImplementation(() => new Promise(() => {}));
    render(<RequestForm locations={mockLocations} onSubmit={onSubmit} isSubmitting />);
    
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
  });

  it('shows success message after submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue({});
    render(
      <RequestForm
        locations={mockLocations}
        onSubmit={onSubmit}
        submitStatus="success"
      />
    );
    
    expect(screen.getByText('Request submitted successfully!')).toBeInTheDocument();
  });

  it('shows error message on submission failure', () => {
    render(
      <RequestForm
        locations={mockLocations}
        onSubmit={jest.fn()}
        submitStatus="error"
        errorMessage="Network error occurred"
      />
    );
    
    expect(screen.getByText('Network error occurred')).toBeInTheDocument();
  });

  it('shows preview after selecting location and days', () => {
    render(<RequestForm locations={mockLocations} onSubmit={jest.fn()} />);
    
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'loc-vacation' } });
    fireEvent.change(screen.getByLabelText('Days Requested'), { target: { value: '5' } });
    
    expect(screen.getByText('Vacation')).toBeInTheDocument();
  });

  it('disables submit when no location selected', () => {
    render(<RequestForm locations={mockLocations} onSubmit={jest.fn()} />);
    
    expect(screen.getByRole('button', { name: 'Submit Request' })).toBeDisabled();
  });
});
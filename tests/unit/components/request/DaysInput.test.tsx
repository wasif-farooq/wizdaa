import { render, screen, fireEvent } from '@testing-library/react';
import { DaysInput } from '../../../../src/components/request/DaysInput';

describe('DaysInput', () => {
  it('renders with initial value', () => {
    render(<DaysInput value={5} onChange={jest.fn()} />);
    
    expect(screen.getByLabelText('Days Requested')).toHaveValue(5);
  });

  it('calls onChange when value changes to valid number', () => {
    const onChange = jest.fn();
    render(<DaysInput value={1} onChange={onChange} />);
    
    const input = screen.getByLabelText('Days Requested');
    fireEvent.change(input, { target: { value: '10' } });
    
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('calls onChange with 1 when empty value is entered', () => {
    const onChange = jest.fn();
    render(<DaysInput value={5} onChange={onChange} />);
    
    const input = screen.getByLabelText('Days Requested');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('shows error and does not call onChange when value exceeds maxDays', () => {
    const onChange = jest.fn();
    render(<DaysInput value={5} onChange={onChange} maxDays={10} />);
    
    const input = screen.getByLabelText('Days Requested');
    fireEvent.change(input, { target: { value: '15' } });
    
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/Cannot request more than 10 days/)).toBeInTheDocument();
  });

  it('displays max days label', () => {
    render(<DaysInput value={5} onChange={jest.fn()} maxDays={15} />);
    
    expect(screen.getByText('Maximum: 15 days')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<DaysInput value={5} onChange={jest.fn()} disabled />);
    
    expect(screen.getByLabelText('Days Requested')).toBeDisabled();
  });

  it('updates local value when prop value changes', () => {
    const { rerender } = render(<DaysInput value={5} onChange={jest.fn()} />);
    
    rerender(<DaysInput value={10} onChange={jest.fn()} />);
    
    expect(screen.getByLabelText('Days Requested')).toHaveValue(10);
  });
});
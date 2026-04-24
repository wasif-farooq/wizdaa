import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButtons } from '../../../../src/components/shared/ActionButtons';

describe('ActionButtons', () => {
  it('renders approve and deny buttons', () => {
    render(<ActionButtons onApprove={jest.fn()} onDeny={jest.fn()} />);
    
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deny' })).toBeInTheDocument();
  });

  it('calls onApprove when approve button is clicked', () => {
    const onApprove = jest.fn();
    const onDeny = jest.fn();
    render(<ActionButtons onApprove={onApprove} onDeny={onDeny} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onDeny).not.toHaveBeenCalled();
  });

  it('calls onDeny when deny button is clicked', () => {
    const onApprove = jest.fn();
    const onDeny = jest.fn();
    render(<ActionButtons onApprove={onApprove} onDeny={onDeny} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(onDeny).toHaveBeenCalledTimes(1);
    expect(onApprove).not.toHaveBeenCalled();
  });

  it('disables buttons when isProcessing is true', () => {
    render(<ActionButtons onApprove={jest.fn()} onDeny={jest.fn()} isProcessing />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('disables buttons when isDisabled is true', () => {
    render(<ActionButtons onApprove={jest.fn()} onDeny={jest.fn()} isDisabled />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('shows Processing... text when isProcessing', () => {
    render(<ActionButtons onApprove={jest.fn()} onDeny={jest.fn()} isProcessing />);
    
    const buttons = screen.getAllByText('Processing...');
    expect(buttons.length).toBe(2);
  });
});
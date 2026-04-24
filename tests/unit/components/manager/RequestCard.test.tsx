import { render, screen, fireEvent } from '@testing-library/react';
import { RequestCard } from '../../../../src/components/manager/RequestCard';
import type { TimeOffRequest } from '../../../../src/lib/types';
import * as ReactQuery from '@tanstack/react-query';

const mockRequest: TimeOffRequest = {
  id: 'req-001',
  employeeId: 'emp-001',
  employeeName: 'Alice Johnson',
  locationId: 'loc-vacation',
  locationName: 'Vacation',
  requestedDays: 5,
  submittedAt: '2024-01-15T10:00:00.000Z',
  status: 'pending',
  balanceAtSubmission: 15,
};

describe('RequestCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders request details', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15 },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(
      <RequestCard
        request={mockRequest}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
      />
    );

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Vacation')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows loading state for balance', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    render(
      <RequestCard
        request={mockRequest}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
      />
    );

    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('shows preflight warning when insufficient balance', () => {
    (ReactQuery.useQuery as jest.Mock)
      .mockReturnValueOnce({
        data: { success: true, balanceDays: 3 },
        isLoading: false,
        isSuccess: true,
        isError: false,
      })
      .mockReturnValueOnce({
        data: { sufficient: false, availableBalance: 3, requestedDays: 5, message: 'Insufficient balance' },
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

    render(
      <RequestCard
        request={mockRequest}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
      />
    );

    expect(screen.getByText(/Insufficient balance/)).toBeInTheDocument();
  });

  it('calls onApprove when approve button is clicked', () => {
    const onApprove = jest.fn();
    const onDeny = jest.fn();

    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15 },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(
      <RequestCard
        request={mockRequest}
        onApprove={onApprove}
        onDeny={onDeny}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprove).toHaveBeenCalledWith('req-001');
  });

  it('calls onDeny when deny button is clicked', () => {
    const onApprove = jest.fn();
    const onDeny = jest.fn();

    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15 },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(
      <RequestCard
        request={mockRequest}
        onApprove={onApprove}
        onDeny={onDeny}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(onDeny).toHaveBeenCalledWith('req-001');
  });

  it('disables buttons when isProcessing', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15 },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(
      <RequestCard
        request={mockRequest}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
        isProcessing
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });

  it('disables buttons for already processed requests', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15 },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(
      <RequestCard
        request={{ ...mockRequest, status: 'approved' }}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });
});
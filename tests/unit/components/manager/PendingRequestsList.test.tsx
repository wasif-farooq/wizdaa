import { render, screen, fireEvent } from '@testing-library/react';
import { PendingRequestsList } from '../../../../src/components/manager/PendingRequestsList';
import type { TimeOffRequest } from '../../../../src/lib/types';
import * as ReactQuery from '@tanstack/react-query';

const mockRequests: TimeOffRequest[] = [
  {
    id: 'req-001',
    employeeId: 'emp-001',
    employeeName: 'Alice Johnson',
    locationId: 'loc-vacation',
    locationName: 'Vacation',
    requestedDays: 5,
    submittedAt: '2024-01-15T10:00:00.000Z',
    status: 'pending',
    balanceAtSubmission: 15,
  },
  {
    id: 'req-002',
    employeeId: 'emp-002',
    employeeName: 'Bob Smith',
    locationId: 'loc-sick',
    locationName: 'Sick',
    requestedDays: 3,
    submittedAt: '2024-01-15T11:00:00.000Z',
    status: 'pending',
    balanceAtSubmission: 10,
  },
];

describe('PendingRequestsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15, sufficient: true },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });
  });

  it('renders empty state when no requests', () => {
    render(
      <PendingRequestsList
        requests={[]}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
      />
    );

    expect(screen.getByText('Pending Requests')).toBeInTheDocument();
    expect(screen.getByText('No pending requests at this time.')).toBeInTheDocument();
  });

  it('renders all requests', () => {
    render(
      <PendingRequestsList
        requests={mockRequests}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
      />
    );

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  it('shows correct pending count', () => {
    render(
      <PendingRequestsList
        requests={mockRequests}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
      />
    );

    expect(screen.getByText('2 pending')).toBeInTheDocument();
  });

  it('only counts pending/optimistic/idle requests', () => {
    const mixedRequests: TimeOffRequest[] = [
      ...mockRequests,
      { ...mockRequests[0], id: 'req-003', status: 'approved' as const },
    ];

    render(
      <PendingRequestsList
        requests={mixedRequests}
        onApprove={jest.fn()}
        onDeny={jest.fn()}
      />
    );

    expect(screen.getByText('2 pending')).toBeInTheDocument();
  });

  it('calls onApprove with correct request id', () => {
    const onApprove = jest.fn();
    const onDeny = jest.fn();

    render(
      <PendingRequestsList
        requests={mockRequests}
        onApprove={onApprove}
        onDeny={onDeny}
      />
    );

    const approveButtons = screen.getAllByRole('button', { name: 'Approve' });
    fireEvent.click(approveButtons[0]);
    
    expect(onApprove).toHaveBeenCalledWith('req-001');
  });

  it('calls onDeny with correct request id', () => {
    const onApprove = jest.fn();
    const onDeny = jest.fn();

    render(
      <PendingRequestsList
        requests={mockRequests}
        onApprove={onApprove}
        onDeny={onDeny}
      />
    );

    const denyButtons = screen.getAllByRole('button', { name: 'Deny' });
    fireEvent.click(denyButtons[1]);
    
    expect(onDeny).toHaveBeenCalledWith('req-002');
  });

  it('disables all buttons when isProcessing', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15 },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    render(
      <PendingRequestsList
        requests={mockRequests}
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
});
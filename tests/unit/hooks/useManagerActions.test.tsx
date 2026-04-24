import { renderHook } from '@testing-library/react';
import * as ReactQuery from '@tanstack/react-query';
import { useCurrentBalance, useApproveRequest, useDenyRequest, usePreflightCheck } from '../../../src/hooks/useManagerActions';

describe('useCurrentBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches current balance', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: {
        success: true,
        balanceDays: 15,
        version: 2,
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useCurrentBalance('emp-001', 'loc-vacation'));
    expect(result.current.isSuccess).toBe(true);
  });

  it('does not fetch when employeeId is empty', () => {
    renderHook(() => useCurrentBalance('', 'loc-vacation'));
    expect(ReactQuery.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('does not fetch when locationId is empty', () => {
    renderHook(() => useCurrentBalance('emp-001', ''));
    expect(ReactQuery.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('returns error on failure', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: new Error('Server error'),
    });

    const { result } = renderHook(() => useCurrentBalance('emp-001', 'loc-vacation'));
    expect(result.current.isError).toBe(true);
  });

  it('passes correct query key', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15 },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    renderHook(() => useCurrentBalance('emp-001', 'loc-vacation'));
    expect(ReactQuery.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(['currentBalance', 'emp-001', 'loc-vacation']),
      })
    );
  });
});

describe('useApproveRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls mutation with correct params', () => {
    const mockMutate = jest.fn();
    (ReactQuery.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: jest.fn().mockResolvedValue({ success: true, canApprove: true }),
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useApproveRequest());
    result.current.mutate({
      employeeId: 'emp-001',
      locationId: 'loc-vacation',
      requestedDays: 3,
    });

    expect(mockMutate).toHaveBeenCalledWith({
      employeeId: 'emp-001',
      locationId: 'loc-vacation',
      requestedDays: 3,
    });
  });

  it('returns loading state during approval', () => {
    (ReactQuery.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useApproveRequest());
    expect(result.current.isLoading).toBe(true);
  });

  it('handles insufficient balance', () => {
    (ReactQuery.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn().mockResolvedValue({
        success: false,
        canApprove: false,
        error: 'INSUFFICIENT_BALANCE',
        message: 'Not enough days',
      }),
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useApproveRequest());
    expect(result.current.isSuccess).toBe(true);
  });
});

describe('useDenyRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls mutation with correct params', () => {
    const mockMutate = jest.fn();
    (ReactQuery.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: jest.fn().mockResolvedValue({ success: true }),
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useDenyRequest());
    result.current.mutate({
      requestId: 'req-001',
      employeeId: 'emp-002',
      locationId: 'loc-vacation',
      requestedDays: 3,
    });

    expect(mockMutate).toHaveBeenCalledWith({
      requestId: 'req-001',
      employeeId: 'emp-002',
      locationId: 'loc-vacation',
      requestedDays: 3,
    });
  });

  it('handles denial failure', () => {
    (ReactQuery.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn().mockResolvedValue({
        success: false,
        message: 'Failed to deny request',
      }),
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useDenyRequest());
    expect(result.current.isSuccess).toBe(true);
  });
});

describe('usePreflightCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('checks balance sufficiency', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: {
        sufficient: true,
        availableBalance: 15,
        requestedDays: 5,
        message: 'Balance sufficient',
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => usePreflightCheck('emp-001', 'loc-vacation', 5));
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data?.sufficient).toBe(true);
  });

  it('returns insufficient when balance is low', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: {
        sufficient: false,
        availableBalance: 3,
        requestedDays: 5,
        message: 'Insufficient balance',
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => usePreflightCheck('emp-001', 'loc-vacation', 5));
    expect(result.current.data?.sufficient).toBe(false);
  });

  it('does not fetch when employeeId is empty', () => {
    renderHook(() => usePreflightCheck('', 'loc-vacation', 5));
    expect(ReactQuery.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('does not fetch when locationId is empty', () => {
    renderHook(() => usePreflightCheck('emp-001', '', 5));
    expect(ReactQuery.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('does not fetch when requestedDays is 0', () => {
    renderHook(() => usePreflightCheck('emp-001', 'loc-vacation', 0));
    expect(ReactQuery.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('does not fetch when requestedDays is negative', () => {
    renderHook(() => usePreflightCheck('emp-001', 'loc-vacation', -1));
    expect(ReactQuery.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });
});
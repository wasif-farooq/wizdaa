import { renderHook } from '@testing-library/react';
import * as ReactQuery from '@tanstack/react-query';
import { useBatchBalances, useSubmitRequest, useVerifyBalance } from '../../../src/hooks/useBalances';
import type { Balance } from '../../../src/lib/types';

const mockBalances: Balance[] = [
  {
    employeeId: 'emp-001',
    locationId: 'loc-vacation',
    locationName: 'Vacation',
    balanceDays: 15,
    version: 1,
    lastUpdated: '2024-01-01T00:00:00.000Z',
  },
  {
    employeeId: 'emp-001',
    locationId: 'loc-sick',
    locationName: 'Sick',
    balanceDays: 10,
    version: 1,
    lastUpdated: '2024-01-01T00:00:00.000Z',
  },
];

describe('useBatchBalances', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loading state initially', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useBatchBalances('emp-001', true));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns balances on success', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: mockBalances,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useBatchBalances('emp-001', true));
    expect(result.current.data).toEqual(mockBalances);
    expect(result.current.isSuccess).toBe(true);
  });

  it('returns error on failure', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: new Error('Network error'),
    });

    const { result } = renderHook(() => useBatchBalances('emp-001', true));
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
  });
});

describe('useSubmitRequest', () => {
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

    const { result } = renderHook(() => useSubmitRequest());
    result.current.mutate({
      employeeId: 'emp-001',
      locationId: 'loc-vacation',
      requestedDays: 3,
      employeeName: 'Alice Johnson',
      locationName: 'Vacation',
      balanceAtSubmission: 15,
    });

    expect(mockMutate).toHaveBeenCalledWith({
      employeeId: 'emp-001',
      locationId: 'loc-vacation',
      requestedDays: 3,
      employeeName: 'Alice Johnson',
      locationName: 'Vacation',
      balanceAtSubmission: 15,
    });
  });

  it('returns loading state during submission', () => {
    (ReactQuery.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useSubmitRequest());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns success state after submission', () => {
    (ReactQuery.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn().mockResolvedValue({
        success: true,
        balanceDays: 12,
      }),
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useSubmitRequest());
    expect(result.current.isSuccess).toBe(true);
  });

  it('returns error state on failure', () => {
    (ReactQuery.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      mutateAsync: jest.fn().mockRejectedValue(new Error('Network error')),
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: new Error('Network error'),
    });

    const { result } = renderHook(() => useSubmitRequest());
    expect(result.current.isError).toBe(true);
  });
});

describe('useVerifyBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches balance for verification', () => {
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

    const { result } = renderHook(() => useVerifyBalance('emp-001', 'loc-vacation'));
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBeDefined();
  });

  it('passes correct query key', () => {
    (ReactQuery.useQuery as jest.Mock).mockReturnValue({
      data: { success: true, balanceDays: 15 },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    renderHook(() => useVerifyBalance('emp-001', 'loc-vacation'));
    expect(ReactQuery.useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(['verifyBalance', 'emp-001', 'loc-vacation']),
      })
    );
  });
});
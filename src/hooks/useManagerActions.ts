import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { submitRequest, getBatchBalances, getBalance, denyRequest, checkBalance } from '../lib/hcmClient';
import { useRequestStore, useBalanceStore } from '../stores';

const BATCH_KEY = 'batchBalances';

const RETRY_DELAYS = [1000, 2000, 4000];

interface ApprovalResult {
  success: boolean;
  canApprove: boolean;
  balanceDays?: number;
  version?: number;
  lastUpdated?: string;
  error?: string;
  message?: string;
}

async function approveWithRetry(
  employeeId: string,
  locationId: string,
  requestedDays: number
): Promise<ApprovalResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const result = await submitRequest(employeeId, locationId, requestedDays);

      if (result.success) {
        return {
          success: true,
          canApprove: true,
          balanceDays: result.balanceDays,
          version: result.version,
          lastUpdated: result.lastUpdated,
        };
      }

      if (result.error === 'INSUFFICIENT_BALANCE') {
        return {
          success: false,
          canApprove: false,
          error: result.error,
          message: result.message || 'Insufficient balance',
        };
      }

      throw new Error(result.message || 'Approval failed');
    } catch (err) {
      lastError = err as Error;

      if (attempt < RETRY_DELAYS.length) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
      }
    }
  }

  return {
    success: false,
    canApprove: false,
    error: 'NETWORK_ERROR',
    message: lastError?.message || 'Approval failed after retries',
  };
}

async function denyWithRetry(
  employeeId: string,
  locationId: string,
  requestedDays: number,
  requestId: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const result = await denyRequest(employeeId, locationId, requestedDays, requestId);
      return result;
    } catch (err) {
      lastError = err as Error;

      if (attempt < RETRY_DELAYS.length) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
      }
    }
  }

  return {
    success: false,
    error: 'NETWORK_ERROR',
    message: lastError?.message || 'Failed to deny request',
  };
}

export function useCurrentBalance(employeeId: string, locationId: string) {
  return useQuery({
    queryKey: ['currentBalance', employeeId, locationId],
    queryFn: async () => {
      return getBalance(employeeId, locationId);
    },
    enabled: !!employeeId && !!locationId,
    staleTime: 5000,
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();
  const { updateRequestStatus } = useRequestStore();
  const { setBalance, setError } = useBalanceStore();

  return useMutation({
    mutationFn: async ({
      employeeId,
      locationId,
      requestedDays,
    }: {
      employeeId: string;
      locationId: string;
      requestedDays: number;
    }) => {
      return approveWithRetry(employeeId, locationId, requestedDays);
    },
    onSuccess: async (data, { employeeId, locationId }) => {
      if (!data.canApprove) {
        setError(data.message || 'Balance changed - cannot approve');
        return;
      }

      if (data.success && data.balanceDays !== undefined) {
        setBalance({
          employeeId,
          locationId,
          locationName: '',
          balanceDays: data.balanceDays,
          version: data.version || 0,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        });
      }
      await queryClient.invalidateQueries({ queryKey: [BATCH_KEY, employeeId] });
    },
    onError: async (error, { employeeId }) => {
      setError(error instanceof Error ? error.message : 'Approval failed - please try again');
      await queryClient.invalidateQueries({ queryKey: [BATCH_KEY, employeeId] });
    },
  });
}

export function useDenyRequest() {
  const queryClient = useQueryClient();
  const { updateRequestStatus } = useRequestStore();
  const { setError } = useBalanceStore();

  return useMutation({
    mutationFn: async ({
      requestId,
      employeeId,
      locationId,
      requestedDays,
    }: {
      requestId: string;
      employeeId: string;
      locationId: string;
      requestedDays: number;
    }) => {
      return denyWithRetry(employeeId, locationId, requestedDays, requestId);
    },
    onSuccess: async (data, { requestId, employeeId }) => {
      if (!data.success) {
        setError(data.message || 'Failed to deny request');
        return;
      }
      updateRequestStatus(requestId, 'denied');
      await queryClient.invalidateQueries({ queryKey: [BATCH_KEY, employeeId] });
    },
    onError: async (error, { requestId, employeeId }) => {
      setError(error instanceof Error ? error.message : 'Failed to deny request');
      await queryClient.invalidateQueries({ queryKey: [BATCH_KEY, employeeId] });
    },
  });
}

const RETRY_DELAYS_CHECK = [1000, 2000, 4000];

async function checkBalanceWithRetry(
  employeeId: string,
  locationId: string,
  requestedDays: number
) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RETRY_DELAYS_CHECK.length; attempt++) {
    try {
      return await checkBalance(employeeId, locationId, requestedDays);
    } catch (err) {
      lastError = err as Error;

      if (attempt < RETRY_DELAYS_CHECK.length) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS_CHECK[attempt]));
      }
    }
  }

  return {
    sufficient: false,
    availableBalance: 0,
    requestedDays,
    message: lastError?.message || 'Failed to check balance',
  };
}

export function usePreflightCheck(
  employeeId: string,
  locationId: string,
  requestedDays: number
) {
  return useQuery({
    queryKey: ['preflightCheck', employeeId, locationId, requestedDays],
    queryFn: async () => {
      return checkBalanceWithRetry(employeeId, locationId, requestedDays);
    },
    enabled: !!employeeId && !!locationId && !!requestedDays && requestedDays > 0,
    staleTime: 3000,
  });
}
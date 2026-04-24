import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getBatchBalances, submitRequest, getBalance } from '../lib/hcmClient';
import { useBalanceStore, useRequestStore } from '../stores';
import type { TimeOffRequest, Balance } from '../lib/types';

const BATCH_KEY = 'batchBalances';

const RETRY_DELAYS = [1000, 2000, 4000];

async function submitWithRetry(
  employeeId: string,
  locationId: string, 
  requestedDays: number
): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const result = await submitRequest(employeeId, locationId, requestedDays);
      
      if (result.success) {
        return result;
      }
      
      if (result.error === 'INSUFFICIENT_BALANCE') {
        return result;
      }
      
      throw new Error(result.message || 'Unknown error');
    } catch (err) {
      lastError = err as Error;
      
      if (attempt < RETRY_DELAYS.length) {
        console.log(`[Submit] Attempt ${attempt + 1} failed, retrying in ${RETRY_DELAYS[attempt]}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]));
      }
    }
  }
  
  throw lastError;
}

export function useBatchBalances(employeeId: string, enabled = true) {
  const { setBalance, setLoading, setError, markStale, optimisticDeductions } = useBalanceStore();
  
  const query = useQuery<Balance[]>({
    queryKey: [BATCH_KEY, employeeId],
    queryFn: async () => {
      const data = await getBatchBalances(employeeId);
      return data.balances;
    },
    enabled,
    refetchInterval: 30000,
    staleTime: 25000,
  });
  
  // Use useEffect to update store ONLY after render, preventing infinite loop
  useEffect(() => {
    if (query.isSuccess && query.data) {
      for (const b of query.data) {
        const hasOptimisticPending = optimisticDeductions.has(b.locationId);
        if (hasOptimisticPending) {
          markStale(b.locationId);
        } else {
          setBalance(b);
        }
      }
      setLoading(false);
    }
    
    if (query.isError) {
      setError(query.error instanceof Error ? query.error.message : 'Failed to fetch balances');
      setLoading(false);
    }
  }, [query.isSuccess, query.isError, query.data, optimisticDeductions]);
  
  return query;
}

export function useSubmitRequest() {
  const queryClient = useQueryClient();
  const { subtractOptimistic, rollbackOptimistic, setBalance, clearStale, setMismatch, clearMismatch, setError } = useBalanceStore();
  const { addRequest } = useRequestStore();
  
  return useMutation({
    mutationFn: async ({
      employeeId,
      locationId,
      requestedDays,
      employeeName,
      locationName,
      balanceAtSubmission,
    }: {
      employeeId: string;
      locationId: string;
      requestedDays: number;
      employeeName: string;
      locationName: string;
      balanceAtSubmission: number;
    }) => {
      return submitWithRetry(employeeId, locationId, requestedDays);
    },
    onMutate: async ({ locationId, requestedDays, employeeId, employeeName, locationName, balanceAtSubmission }) => {
      await queryClient.cancelQueries({ queryKey: [BATCH_KEY, employeeId] });
      
      subtractOptimistic(locationId, requestedDays);
      clearMismatch();
      setError(null);
      
      const newRequest: TimeOffRequest = {
        id: `req-${Date.now()}`,
        employeeId,
        employeeName,
        locationId,
        locationName,
        requestedDays,
        submittedAt: new Date().toISOString(),
        status: 'optimistic',
        balanceAtSubmission,
      };
      addRequest(newRequest);
      
      return { locationId };
    },
    onSuccess: async (data, { locationId, employeeId, locationName, balanceAtSubmission, requestedDays }) => {
      if (data.success && data.balanceDays !== undefined) {
        setBalance({
          employeeId,
          locationId,
          locationName: locationName || '',
          balanceDays: data.balanceDays,
          version: data.version || 0,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        });
        clearStale(locationId);
      }
      await queryClient.invalidateQueries({ queryKey: [BATCH_KEY, employeeId] });
      
      setTimeout(async () => {
        try {
          const verification = await getBalance(employeeId, locationId);
          if (verification.balanceDays !== undefined) {
            const expectedBalance = balanceAtSubmission - requestedDays;
            if (verification.balanceDays !== expectedBalance && verification.balanceDays !== data.balanceDays) {
              setMismatch(locationId, 'Balance changed externally - reload to see current');
            } else {
              clearMismatch();
            }
            setBalance({
              employeeId,
              locationId,
              locationName: locationName || '',
              balanceDays: verification.balanceDays,
              version: verification.version || 0,
              lastUpdated: verification.lastUpdated || new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('[Verification] Failed:', err);
        }
      }, 2000);
    },
    onError: async (error, { locationId, employeeId }) => {
      rollbackOptimistic(locationId);
      setError(error instanceof Error ? error.message : 'Network error - please try again');
      await queryClient.invalidateQueries({ queryKey: [BATCH_KEY, employeeId] });
    },
  });
}

export function useVerifyBalance(employeeId: string, locationId: string) {
  const { setBalance } = useBalanceStore();
  
  return useQuery({
    queryKey: ['verifyBalance', employeeId, locationId],
    queryFn: async () => {
      return getBalance(employeeId, locationId);
    },
    enabled: !!employeeId && !!locationId,
  });
}
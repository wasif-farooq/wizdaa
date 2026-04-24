import { useBalanceStore } from '../../../src/stores/balanceStore';
import type { Balance } from '../../../src/lib/types';

describe('balanceStore', () => {
  beforeEach(() => {
    useBalanceStore.setState({
      balances: new Map(),
      optimisticDeductions: new Map(),
      staleLocations: new Set(),
      isLoading: false,
      error: null,
      balanceMismatch: null,
      hasError: false,
    });
  });

  const createBalance = (overrides: Partial<Balance> = {}): Balance => ({
    employeeId: 'emp-001',
    locationId: 'loc-ny',
    locationName: 'New York Office',
    balanceDays: 15,
    version: 1,
    lastUpdated: new Date().toISOString(),
    ...overrides,
  });

  describe('setBalance', () => {
    it('adds balance to store', () => {
      const balance = createBalance();
      useBalanceStore.getState().setBalance(balance);
      const stored = useBalanceStore.getState().balances.get('emp-001:loc-ny');
      expect(stored).toEqual(balance);
    });

    it('updates existing balance', () => {
      useBalanceStore.getState().setBalance(createBalance({ balanceDays: 15 }));
      useBalanceStore.getState().setBalance(createBalance({ balanceDays: 10 }));
      expect(useBalanceStore.getState().balances.get('emp-001:loc-ny')?.balanceDays).toBe(10);
    });

    it('clears error when setting balance', () => {
      useBalanceStore.getState().setError('Previous error');
      useBalanceStore.getState().setBalance(createBalance());
      expect(useBalanceStore.getState().error).toBeNull();
    });
  });

  describe('setBalances', () => {
    it('adds multiple balances', () => {
      useBalanceStore.getState().setBalances([
        createBalance({ locationId: 'loc-ny' }),
        createBalance({ locationId: 'loc-sf' }),
      ]);
      expect(useBalanceStore.getState().balances.size).toBe(2);
    });
  });

  describe('subtractOptimistic', () => {
    it('adds optimistic deduction', () => {
      useBalanceStore.getState().subtractOptimistic('loc-ny', 5);
      expect(useBalanceStore.getState().optimisticDeductions.get('loc-ny')).toBe(5);
    });

    it('accumulates deductions', () => {
      useBalanceStore.getState().subtractOptimistic('loc-ny', 3);
      useBalanceStore.getState().subtractOptimistic('loc-ny', 2);
      expect(useBalanceStore.getState().optimisticDeductions.get('loc-ny')).toBe(5);
    });
  });

  describe('rollbackOptimistic', () => {
    it('removes deduction', () => {
      useBalanceStore.getState().subtractOptimistic('loc-ny', 5);
      useBalanceStore.getState().rollbackOptimistic('loc-ny');
      expect(useBalanceStore.getState().optimisticDeductions.get('loc-ny')).toBeUndefined();
    });
  });

  describe('markStale / clearStale', () => {
    it('marks location as stale', () => {
      useBalanceStore.getState().markStale('loc-ny');
      expect(useBalanceStore.getState().staleLocations.has('loc-ny')).toBe(true);
    });

    it('clears stale status', () => {
      useBalanceStore.getState().markStale('loc-ny');
      useBalanceStore.getState().clearStale('loc-ny');
      expect(useBalanceStore.getState().staleLocations.has('loc-ny')).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('sets loading state', () => {
      useBalanceStore.getState().setLoading(true);
      expect(useBalanceStore.getState().isLoading).toBe(true);
    });
  });

  describe('setError', () => {
    it('sets error and hasError', () => {
      useBalanceStore.getState().setError('Test error');
      expect(useBalanceStore.getState().error).toBe('Test error');
      expect(useBalanceStore.getState().hasError).toBe(true);
    });

    it('clears error with null', () => {
      useBalanceStore.getState().setError('Test error');
      useBalanceStore.getState().setError(null);
      expect(useBalanceStore.getState().error).toBeNull();
      expect(useBalanceStore.getState().hasError).toBe(false);
    });
  });

  describe('setMismatch / clearMismatch', () => {
    it('sets and clears mismatch', () => {
      useBalanceStore.getState().setMismatch('loc-ny', 'Mismatch');
      expect(useBalanceStore.getState().balanceMismatch?.locationId).toBe('loc-ny');
      useBalanceStore.getState().clearMismatch();
      expect(useBalanceStore.getState().balanceMismatch).toBeNull();
    });
  });

  describe('getEffectiveBalance', () => {
    it('returns balance with deduction', () => {
      useBalanceStore.getState().setBalance(createBalance({ balanceDays: 15 }));
      useBalanceStore.getState().subtractOptimistic('loc-ny', 5);
      expect(useBalanceStore.getState().getEffectiveBalance('loc-ny')).toBe(10);
    });
  });

  describe('getBalanceForLocation', () => {
    it('returns balance for location', () => {
      useBalanceStore.getState().setBalance(createBalance({ locationId: 'loc-ny' }));
      expect(useBalanceStore.getState().getBalanceForLocation('loc-ny')?.locationId).toBe('loc-ny');
    });

    it('returns undefined for non-existent location', () => {
      expect(useBalanceStore.getState().getBalanceForLocation('loc-invalid')).toBeUndefined();
    });
  });
});
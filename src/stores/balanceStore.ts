import { create } from 'zustand';
import type { Balance } from '../lib/types';

interface BalanceState {
  balances: Map<string, Balance>;
  optimisticDeductions: Map<string, number>;
  staleLocations: Set<string>;
  isLoading: boolean;
  error: string | null;
  balanceMismatch: { locationId: string; message: string } | null;
  hasError: boolean;
  
  setBalance: (balance: Balance) => void;
  setBalances: (balances: Balance[]) => void;
  subtractOptimistic: (locationId: string, days: number) => void;
  rollbackOptimistic: (locationId: string) => void;
  markStale: (locationId: string) => void;
  clearStale: (locationId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMismatch: (locationId: string, message: string) => void;
  clearMismatch: () => void;
  getEffectiveBalance: (locationId: string) => number | null;
  getBalanceForLocation: (locationId: string) => Balance | undefined;
}

const makeKey = (employeeId: string, locationId: string) => `${employeeId}:${locationId}`;

export const useBalanceStore = create<BalanceState>((set, get) => ({
  balances: new Map(),
  optimisticDeductions: new Map(),
  staleLocations: new Set(),
  isLoading: false,
  error: null,
  balanceMismatch: null,
  hasError: false,

  setBalance: (balance) => set((state) => {
    const balances = new Map(state.balances);
    balances.set(makeKey(balance.employeeId, balance.locationId), balance);
    return { balances, error: null };
  }),

  setBalances: (balances) => set((state) => {
    const newBalances = new Map(state.balances);
    for (const b of balances) {
      newBalances.set(makeKey(b.employeeId, b.locationId), b);
    }
    return { balances: newBalances, error: null };
  }),

  subtractOptimistic: (locationId, days) => set((state) => {
    const deductions = new Map(state.optimisticDeductions);
    const current = deductions.get(locationId) || 0;
    deductions.set(locationId, current + days);
    return { optimisticDeductions: deductions };
  }),

  rollbackOptimistic: (locationId) => set((state) => {
    const deductions = new Map(state.optimisticDeductions);
    deductions.delete(locationId);
    return { optimisticDeductions: deductions };
  }),

  markStale: (locationId) => set((state) => {
    const stale = new Set(state.staleLocations);
    stale.add(locationId);
    return { staleLocations: stale };
  }),

  clearStale: (locationId) => set((state) => {
    const stale = new Set(state.staleLocations);
    stale.delete(locationId);
    return { staleLocations: stale };
  }),

setLoading: (isLoading) => set({ isLoading }),
setError: (error) => set({ error, hasError: error !== null }),
  setMismatch: (locationId, message) => set({ balanceMismatch: { locationId, message } }),
  clearMismatch: () => set({ balanceMismatch: null }),
  
  getEffectiveBalance: (locationId) => {
    const state = get();
    const deduction = state.optimisticDeductions.get(locationId) || 0;
    for (const balance of state.balances.values()) {
      if (balance.locationId === locationId) {
        return Math.max(0, balance.balanceDays - deduction);
      }
    }
    return null;
  },
  
  getBalanceForLocation: (locationId) => {
    const state = get();
    for (const balance of state.balances.values()) {
      if (balance.locationId === locationId) {
        return balance;
      }
    }
    return undefined;
  },
}));
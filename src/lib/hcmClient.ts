import type { HcmBalanceResponse, HcmBatchResponse, HcmAnniversaryResponse } from './types';

const API_BASE = '/api/hcm';

export async function getBalance(employeeId: string, locationId: string): Promise<HcmBalanceResponse> {
  const res = await fetch(`${API_BASE}/balance?employeeId=${employeeId}&locationId=${locationId}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export async function submitRequest(
  employeeId: string,
  locationId: string,
  requestedDays: number
): Promise<HcmBalanceResponse> {
  const res = await fetch(`${API_BASE}/balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, locationId, requestedDays }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    return { success: false, error: error.error || 'SERVER_ERROR', message: error.message };
  }
  return res.json();
}

export async function getBatchBalances(employeeId: string): Promise<HcmBatchResponse> {
  const res = await fetch(`${API_BASE}/batch?employeeId=${employeeId}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export async function triggerAnniversary(): Promise<HcmAnniversaryResponse> {
  const res = await fetch(`${API_BASE}/anniversary`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export async function denyRequest(
  employeeId: string,
  locationId: string,
  requestedDays: number,
  requestId: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const res = await fetch(`${API_BASE}/deny`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, locationId, requestedDays, requestId }),
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, error: error.error || 'SERVER_ERROR', message: error.message };
  }
  return res.json();
}

export type CheckBalanceResponse = {
  sufficient: boolean;
  availableBalance: number;
  requestedDays: number;
  message: string;
};

export async function checkBalance(
  employeeId: string,
  locationId: string,
  requestedDays: number
): Promise<CheckBalanceResponse> {
  const res = await fetch(`${API_BASE}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, locationId, requestedDays }),
  });

  if (!res.ok) {
    const error = await res.json();
    return { sufficient: false, availableBalance: 0, requestedDays, message: error.message || 'Failed to check balance' };
  }
  return res.json();
}
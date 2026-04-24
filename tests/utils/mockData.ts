import { jest } from '@jest/globals';
import type { Balance, TimeOffRequest } from '../../src/lib/types';

export const mockBalances: Balance[] = [
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

export const mockRequests: TimeOffRequest[] = [
  {
    id: 'req-001',
    employeeId: 'emp-002',
    employeeName: 'Jane Smith',
    locationId: 'loc-vacation',
    locationName: 'Vacation',
    requestedDays: 3,
    submittedAt: '2024-01-15T10:00:00.000Z',
    status: 'pending',
    balanceAtSubmission: 12,
  },
  {
    id: 'req-002',
    employeeId: 'emp-003',
    employeeName: 'Bob Johnson',
    locationId: 'loc-sick',
    locationName: 'Sick',
    requestedDays: 2,
    submittedAt: '2024-01-15T11:00:00.000Z',
    status: 'pending',
    balanceAtSubmission: 8,
  },
];

export const createMockBalance = (overrides: Partial<Balance> = {}): Balance => ({
  employeeId: 'emp-001',
  locationId: 'loc-vacation',
  locationName: 'Vacation',
  balanceDays: 10,
  version: 1,
  lastUpdated: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

export const createMockRequest = (overrides: Partial<TimeOffRequest> = {}): TimeOffRequest => ({
  id: 'req-test',
  employeeId: 'emp-001',
  employeeName: 'Test User',
  locationId: 'loc-vacation',
  locationName: 'Vacation',
  requestedDays: 5,
  submittedAt: '2024-01-15T10:00:00.000Z',
  status: 'pending',
  balanceAtSubmission: 15,
  ...overrides,
});

export const mockApiResponses = {
  success: {
    batch: { balances: mockBalances },
    balance: { success: true, balanceDays: 15, version: 2, lastUpdated: '2024-01-15T00:00:00.000Z' },
    submit: { success: true, balanceDays: 12, version: 2, lastUpdated: '2024-01-15T00:00:00.000Z' },
    deny: { success: true },
    check: { sufficient: true, availableBalance: 15, requestedDays: 5 },
  },
  insufficient: {
    submit: { success: false, error: 'INSUFFICIENT_BALANCE', message: 'Not enough days' },
    check: { sufficient: false, availableBalance: 3, requestedDays: 5, message: 'Insufficient balance' },
  },
  error: {
    serverError: { success: false, error: 'SERVER_ERROR', message: 'Internal server error' },
    networkError: new Error('Network error'),
  },
};
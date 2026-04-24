export const mockHcmClient = {
  getBatchBalances: jest.fn(),
  getBalance: jest.fn(),
  submitRequest: jest.fn(),
  denyRequest: jest.fn(),
  checkBalance: jest.fn(),
  triggerAnniversary: jest.fn(),
};

export const resetHcmClientMocks = () => {
  mockHcmClient.getBatchBalances.mockReset();
  mockHcmClient.getBalance.mockReset();
  mockHcmClient.submitRequest.mockReset();
  mockHcmClient.denyRequest.mockReset();
  mockHcmClient.checkBalance.mockReset();
  mockHcmClient.triggerAnniversary.mockReset();
};

export const setupSuccessMocks = () => {
  mockHcmClient.getBatchBalances.mockResolvedValue({
    balances: [
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
    ],
  });

  mockHcmClient.getBalance.mockResolvedValue({
    success: true,
    balanceDays: 15,
    version: 2,
    lastUpdated: '2024-01-15T00:00:00.000Z',
  });

  mockHcmClient.submitRequest.mockResolvedValue({
    success: true,
    balanceDays: 12,
    version: 2,
    lastUpdated: '2024-01-15T00:00:00.000Z',
  });

  mockHcmClient.denyRequest.mockResolvedValue({
    success: true,
    message: 'Request denied',
  });

  mockHcmClient.checkBalance.mockResolvedValue({
    sufficient: true,
    availableBalance: 15,
    requestedDays: 5,
    message: 'Balance sufficient',
  });
};

export const setupInsufficientBalanceMocks = () => {
  mockHcmClient.submitRequest.mockResolvedValue({
    success: false,
    error: 'INSUFFICIENT_BALANCE',
    message: 'Not enough days available',
  });

  mockHcmClient.checkBalance.mockResolvedValue({
    sufficient: false,
    availableBalance: 3,
    requestedDays: 5,
    message: 'Insufficient balance',
  });
};

export const setupErrorMocks = () => {
  mockHcmClient.getBatchBalances.mockRejectedValue(new Error('Network error'));
  mockHcmClient.getBalance.mockRejectedValue(new Error('Server error'));
  mockHcmClient.submitRequest.mockRejectedValue(new Error('Submission failed'));
  mockHcmClient.denyRequest.mockRejectedValue(new Error('Deny failed'));
  mockHcmClient.checkBalance.mockRejectedValue(new Error('Check failed'));
};

jest.mock('../../src/lib/hcmClient', () => ({
  getBatchBalances: mockHcmClient.getBatchBalances,
  getBalance: mockHcmClient.getBalance,
  submitRequest: mockHcmClient.submitRequest,
  denyRequest: mockHcmClient.denyRequest,
  checkBalance: mockHcmClient.checkBalance,
  triggerAnniversary: mockHcmClient.triggerAnniversary,
}));
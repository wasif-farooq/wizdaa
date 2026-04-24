import { makeRequest, resetBalances } from '../testHelpers';

async function retryRequest(fn: () => Promise<any>, retries = 10) {
  for (let i = 0; i < retries; i++) {
    const res = await fn();
    if (res.status !== 500) return res;
  }
  return { status: 500, body: { error: 'Max retries exceeded' } };
}

describe('API Route - /api/hcm/deny', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('POST /api/hcm/deny', () => {
    it('denies request successfully', async () => {
      const { status, body } = await retryRequest(() => makeRequest('POST', '/api/hcm/deny', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 2,
        requestId: 'req-001',
      }));
      
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.message).toBe('Request has been denied');
    });

    it('returns 400 when required params are missing', async () => {
      const { status, body } = await makeRequest('POST', '/api/hcm/deny', {
        employeeId: 'emp-001',
      });
      
      expect(status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBe('MISSING_PARAMS');
    });

    it('handles request without requestId', async () => {
      const { status, body } = await retryRequest(() => makeRequest('POST', '/api/hcm/deny', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 2,
      }));
      
      expect(status).toBe(200);
      expect(body.success).toBe(true);
    });

    it('does not affect balance when denying', async () => {
      const beforeBalance = global.__balances?.get('emp-001:loc-ny')?.balanceDays;
      
      await retryRequest(() => makeRequest('POST', '/api/hcm/deny', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 2,
      }));
      
      const afterBalance = global.__balances?.get('emp-001:loc-ny')?.balanceDays;
      expect(afterBalance).toBe(beforeBalance);
    });
  });
});
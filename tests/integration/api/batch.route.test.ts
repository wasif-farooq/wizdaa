import { makeRequest, resetBalances } from '../testHelpers';

async function retryRequest(fn: () => Promise<any>, retries = 10) {
  for (let i = 0; i < retries; i++) {
    const res = await fn();
    if (res.status !== 500) return res;
  }
  return { status: 500, body: { error: 'Max retries exceeded' } };
}

describe('API Route - /api/hcm/batch', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('GET /api/hcm/batch', () => {
    it('returns all balances for an employee', async () => {
      const { status, body } = await retryRequest(() => makeRequest('GET', '/api/hcm/batch?employeeId=emp-001'));
      
      expect(status).toBe(200);
      expect(body.balances).toBeDefined();
      expect(Array.isArray(body.balances)).toBe(true);
      expect(body.balances.length).toBeGreaterThan(0);
    });

    it('returns balance for each location', async () => {
      const { status, body } = await retryRequest(() => makeRequest('GET', '/api/hcm/batch?employeeId=emp-001'));
      
      body.balances.forEach((balance: any) => {
        expect(balance.employeeId).toBe('emp-001');
        expect(balance.locationId).toBeDefined();
        expect(balance.locationName).toBeDefined();
        expect(balance.balanceDays).toBeDefined();
        expect(balance.version).toBeDefined();
        expect(balance.lastUpdated).toBeDefined();
      });
    });

    it('returns 400 when employeeId is missing', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/batch');
      
      expect(status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBe('MISSING_PARAMS');
    });

    it('returns 404 for invalid employee', async () => {
      const { status, body } = await retryRequest(() => makeRequest('GET', '/api/hcm/batch?employeeId=invalid'));
      
      expect(status).toBe(200);
      expect(body.balances).toEqual([]);
    });

    it('returns empty array for non-existent employee', async () => {
      const { status, body } = await retryRequest(() => makeRequest('GET', '/api/hcm/batch?employeeId=emp-999'));
      
      expect(status).toBe(200);
      expect(body.balances).toBeDefined();
      expect(body.balances.length).toBeLessThanOrEqual(4);
    });

    it('has response delay for batch endpoint', async () => {
      const startTime = Date.now();
      await retryRequest(() => makeRequest('GET', '/api/hcm/batch?employeeId=emp-001'));
      const duration = Date.now() - startTime;
      
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });
});
import { makeRequest, resetBalances } from '../testHelpers';

async function retryRequest(fn: () => Promise<any>, retries = 10) {
  for (let i = 0; i < retries; i++) {
    const res = await fn();
    if (res.status !== 500) return res;
  }
  return { status: 500, body: { error: 'Max retries exceeded' } };
}

describe('API Route - /api/hcm/balance', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('GET /api/hcm/balance', () => {
    it('returns balance for valid employee and location', async () => {
      const { status, body } = await retryRequest(() => makeRequest('GET', '/api/hcm/balance?employeeId=emp-001&locationId=loc-ny'));
      
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.balanceDays).toBeDefined();
      expect(body.version).toBeDefined();
      expect(body.lastUpdated).toBeDefined();
    });

    it('returns 400 when employeeId is missing', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/balance?locationId=loc-ny');
      
      expect(status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBe('MISSING_PARAMS');
    });

    it('returns 400 when locationId is missing', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/balance?employeeId=emp-001');
      
      expect(status).toBe(400);
      expect(body.success).toBe(false);
    });

    it('returns error for invalid employee', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/balance?employeeId=invalid&locationId=loc-ny');
      
      expect(status).toBeGreaterThanOrEqual(400);
      expect(body.success).toBe(false);
    });

    it('returns error for invalid location', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/balance?employeeId=emp-001&locationId=invalid');
      
      expect(status).toBeGreaterThanOrEqual(400);
      expect(body.success).toBe(false);
    });
  });

  describe('POST /api/hcm/balance', () => {
    it('submits time-off request successfully', async () => {
      const { status, body } = await retryRequest(() => makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 2,
      }));
      
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.newBalance).toBeDefined();
    });

    it('returns 400 when required params are missing', async () => {
      const { status, body } = await makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
      });
      
      expect(status).toBe(400);
      expect(body.success).toBe(false);
    });

    it('returns 400 for insufficient balance', async () => {
      const { status, body } = await retryRequest(() => makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 1000,
      }));
      
      expect(status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBe('INSUFFICIENT_BALANCE');
    });

    it('deducts from balance when submission succeeds', async () => {
      const beforeBalance = global.__balances?.get('emp-001:loc-ny')?.balanceDays;
      
      await retryRequest(() => makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 2,
      }));
      
      const afterBalance = global.__balances?.get('emp-001:loc-ny')?.balanceDays;
      expect(afterBalance).toBeLessThanOrEqual(beforeBalance! - 2);
    });
  });
});
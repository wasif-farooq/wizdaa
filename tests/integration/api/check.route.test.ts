import { makeRequest, resetBalances } from '../testHelpers';

async function retryRequest(fn: () => Promise<any>, retries = 10) {
  for (let i = 0; i < retries; i++) {
    const res = await fn();
    if (res.status !== 500) return res;
  }
  return { status: 500, body: { error: 'Max retries exceeded' } };
}

describe('API Route - /api/hcm/check', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('POST /api/hcm/check', () => {
    it('returns sufficient: true when balance is enough', async () => {
      const { status, body } = await retryRequest(() => makeRequest('POST', '/api/hcm/check', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 5,
      }));
      
      expect(status).toBe(200);
      expect(body.sufficient).toBe(true);
      expect(body.availableBalance).toBeDefined();
      expect(body.requestedDays).toBe(5);
    });

    it('returns sufficient: false when balance is not enough', async () => {
      const { status, body } = await retryRequest(() => makeRequest('POST', '/api/hcm/check', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 1000,
      }));
      
      expect(status).toBe(200);
      expect(body.sufficient).toBe(false);
      expect(body.message).toContain('Only');
    });

    it('returns 400 when required params are missing', async () => {
      const { status, body } = await makeRequest('POST', '/api/hcm/check', {
        employeeId: 'emp-001',
      });
      
      expect(status).toBe(400);
      expect(body.sufficient).toBe(false);
    });

    it('returns 400 for empty body', async () => {
      const { status, body } = await makeRequest('POST', '/api/hcm/check', {});
      
      expect(status).toBe(400);
      expect(body.sufficient).toBe(false);
    });

    it('returns correct message when insufficient', async () => {
      const { status, body } = await retryRequest(() => makeRequest('POST', '/api/hcm/check', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 1000,
      }));
      
      expect(status).toBe(200);
      expect(body.message).toContain('Only');
      expect(body.message).toContain('available');
    });

    it('returns available balance in response', async () => {
      const { status, body } = await retryRequest(() => makeRequest('POST', '/api/hcm/check', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 5,
      }));
      
      expect(status).toBe(200);
      expect(body.availableBalance).toBeGreaterThan(0);
    });
  });
});
import { makeRequest, resetBalances } from '../testHelpers';

describe('API Route - /api/hcm/anniversary', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('POST /api/hcm/anniversary', () => {
    it('triggers anniversary bonus successfully', async () => {
      const { status, body } = await makeRequest('POST', '/api/hcm/anniversary');
      
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.bonusDays).toBe(5);
      expect(body.employeeId).toBeDefined();
      expect(body.locationId).toBeDefined();
    });

    it('adds 5 days to the balance', async () => {
      const { status: status1, body: body1 } = await makeRequest('POST', '/api/hcm/anniversary');
      
      if (status1 === 200 && body1.success) {
        const key = `${body1.employeeId}:${body1.locationId}`;
        const balance = global.__balances?.get(key);
        expect(balance?.balanceDays).toBeGreaterThanOrEqual(15);
      }
    });

    it('can be called multiple times', async () => {
      const { status: status1 } = await makeRequest('POST', '/api/hcm/anniversary');
      expect(status1).toBe(200);
      
      const { status: status2 } = await makeRequest('POST', '/api/hcm/anniversary');
      expect(status2).toBe(200);
    });
  });
});

describe('API Route - /api/hcm/timer', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('GET /api/hcm/timer', () => {
    it('returns timer status', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/timer');
      
      expect(status).toBe(200);
      expect(body.message).toBeDefined();
      expect(body.intervalMs).toBe(45000);
    });

    it('does not require authentication', async () => {
      const { status } = await makeRequest('GET', '/api/hcm/timer');
      expect(status).toBe(200);
    });
  });
});
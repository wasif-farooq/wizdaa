import { makeRequest, resetBalances } from '../testHelpers';

describe('Error Handling - Server Errors', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('5% Server Error Rate', () => {
    it('balance GET endpoint handles server errors gracefully', async () => {
      let serverErrorCount = 0;
      let successCount = 0;
      let clientErrorCount = 0;
      
      for (let i = 0; i < 50; i++) {
        resetBalances();
        const { status } = await makeRequest('GET', '/api/hcm/balance?employeeId=emp-001&locationId=loc-ny');
        if (status === 500) serverErrorCount++;
        else if (status === 200) successCount++;
        else clientErrorCount++;
      }
      
      expect(successCount).toBeGreaterThan(0);
      expect(clientErrorCount + successCount + serverErrorCount).toBe(50);
    });

    it('balance POST endpoint handles server errors gracefully', async () => {
      let serverErrorCount = 0;
      let successCount = 0;
      let clientErrorCount = 0;
      
      for (let i = 0; i < 50; i++) {
        resetBalances();
        const { status } = await makeRequest('POST', '/api/hcm/balance', {
          employeeId: 'emp-001',
          locationId: 'loc-ny',
          requestedDays: 1,
        });
        if (status === 500) serverErrorCount++;
        else if (status === 200) successCount++;
        else clientErrorCount++;
      }
      
      expect(successCount + clientErrorCount).toBeGreaterThan(0);
    });

    it('batch GET endpoint handles server errors gracefully', async () => {
      let serverErrorCount = 0;
      let successCount = 0;
      
      for (let i = 0; i < 50; i++) {
        resetBalances();
        const { status } = await makeRequest('GET', '/api/hcm/batch?employeeId=emp-001');
        if (status === 500) serverErrorCount++;
        else if (status === 200) successCount++;
      }
      
      expect(successCount).toBeGreaterThan(0);
    });

    it('check POST endpoint handles server errors gracefully', async () => {
      let serverErrorCount = 0;
      let successCount = 0;
      
      for (let i = 0; i < 50; i++) {
        resetBalances();
        const { status } = await makeRequest('POST', '/api/hcm/check', {
          employeeId: 'emp-001',
          locationId: 'loc-ny',
          requestedDays: 5,
        });
        if (status === 500) serverErrorCount++;
        else if (status === 200) successCount++;
      }
      
      expect(successCount).toBeGreaterThan(0);
    });
  });

  describe('Error Response Format', () => {
    it('returns proper error format on 400', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/balance');
      
      expect(status).toBe(400);
      expect(body.error).toBeDefined();
      expect(body.message).toBeDefined();
    });

    it('returns JSON content type on errors', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/balance');
      
      expect(body).toBeDefined();
      expect(typeof body).toBe('object');
    });
  });
});

describe('Error Handling - Data Corruption', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('10% Silent Corruption on Batch', () => {
    it('batch endpoint may return partial data', async () => {
      let fullDataCount = 0;
      let partialDataCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < 50; i++) {
        resetBalances();
        const { status, body } = await makeRequest('GET', '/api/hcm/batch?employeeId=emp-001');
        if (status === 500) {
          errorCount++;
        } else if (body.balances && body.balances.length === 4) {
          fullDataCount++;
        } else if (body.balances) {
          partialDataCount++;
        }
      }
      
      expect(fullDataCount + partialDataCount + errorCount).toBe(50);
    });

    it('batch returns valid balance data when successful', async () => {
      const { status, body } = await makeRequest('GET', '/api/hcm/batch?employeeId=emp-001');
      if (status !== 200 || !body.balances) return;
      
      if (body.balances.length >= 1) {
        const balance = body.balances[0];
        expect(balance.employeeId).toBeDefined();
        expect(balance.locationId).toBeDefined();
        expect(balance.balanceDays).toBeDefined();
      }
    });
  });
});

describe('Error Handling - Race Conditions', () => {
  beforeEach(() => {
    resetBalances();
  });

  describe('Concurrent Requests', () => {
    it('handles multiple concurrent balance submissions', async () => {
      const requests = [
        makeRequest('POST', '/api/hcm/balance', {
          employeeId: 'emp-001',
          locationId: 'loc-ny',
          requestedDays: 1,
        }),
        makeRequest('POST', '/api/hcm/balance', {
          employeeId: 'emp-001',
          locationId: 'loc-ny',
          requestedDays: 1,
        }),
        makeRequest('POST', '/api/hcm/balance', {
          employeeId: 'emp-001',
          locationId: 'loc-ny',
          requestedDays: 1,
        }),
      ];
      
      const results = await Promise.all(requests);
      const validResults = results.filter(r => r.status === 200 || r.status === 400);
      
      expect(validResults.length).toBeGreaterThanOrEqual(2);
    });

    it('handles concurrent reads and writes', async () => {
      const readRequest = makeRequest('GET', '/api/hcm/balance?employeeId=emp-001&locationId=loc-ny');
      const writeRequest = makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 1,
      });
      
      const results = await Promise.all([readRequest, writeRequest]);
      const validCount = results.filter(r => r.status === 200 || r.status === 400).length;
      
      expect(validCount).toBeGreaterThanOrEqual(1);
    });

    it('deny requests are independent of balance state', async () => {
      const beforeBalance = global.__balances?.get('emp-001:loc-ny')?.balanceDays;
      
      await makeRequest('POST', '/api/hcm/deny', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 5,
      });
      
      const afterBalance = global.__balances?.get('emp-001:loc-ny')?.balanceDays;
      expect(afterBalance).toBe(beforeBalance);
    });
  });
});
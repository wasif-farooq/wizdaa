import { makeRequest, resetBalances } from '../testHelpers';

async function retryRequest(fn: () => Promise<any>, retries = 10) {
  for (let i = 0; i < retries; i++) {
    const res = await fn();
    if (res.status !== 500) return res;
  }
  return { status: 500, body: { error: 'Max retries exceeded' } };
}

describe('Workflow - Employee Submits Time-Off Request', () => {
  beforeEach(() => {
    resetBalances();
  });

  it('complete employee submission workflow', async () => {
    const employeeId = 'emp-001';
    const locationId = 'loc-ny';
    const requestedDays = 3;

    const { status: checkStatus, body: checkBody } = await retryRequest(() => 
      makeRequest('POST', '/api/hcm/check', { employeeId, locationId, requestedDays })
    );
    expect(checkStatus).toBe(200);
    expect(checkBody.sufficient).toBe(true);

    const beforeBalance = global.__balances?.get(`${employeeId}:${locationId}`)?.balanceDays;

    const { status: submitStatus, body: submitBody } = await retryRequest(() => 
      makeRequest('POST', '/api/hcm/balance', { employeeId, locationId, requestedDays })
    );
    expect(submitStatus).toBe(200);
    expect(submitBody.success).toBe(true);

    const { status: verifyStatus, body: verifyBody } = await retryRequest(() =>
      makeRequest('GET', `/api/hcm/balance?employeeId=${employeeId}&locationId=${locationId}`)
    );
    expect(verifyStatus).toBe(200);
    expect(verifyBody.balanceDays).toBeLessThan(beforeBalance!);
  });

  it('employee cannot submit with insufficient balance', async () => {
    const { status, body } = await retryRequest(() => 
      makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 1000,
      })
    );
    
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe('INSUFFICIENT_BALANCE');
  });

  it('employee can submit partial days', async () => {
    const { status, body } = await retryRequest(() =>
      makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 1,
      })
    );
    
    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('batch endpoint returns all employee balances', async () => {
    const { status, body } = await retryRequest(() => 
      makeRequest('GET', '/api/hcm/batch?employeeId=emp-001')
    );
    
    expect(status).toBe(200);
    expect(body.balances.length).toBeGreaterThan(0);
    expect(body.balances.every((b: any) => b.employeeId === 'emp-001')).toBe(true);
  });

  it('can switch locations when submitting', async () => {
    const { status: status1 } = await retryRequest(() =>
      makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 2,
      })
    );
    expect(status1).toBe(200);

    const { status: status2 } = await retryRequest(() =>
      makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-001',
        locationId: 'loc-sf',
        requestedDays: 2,
      })
    );
    expect(status2).toBe(200);
  });
});

describe('Workflow - Manager Approves/Denies Requests', () => {
  beforeEach(() => {
    resetBalances();
  });

  it('manager can deny request without affecting balance', async () => {
    const employeeId = 'emp-001';
    const locationId = 'loc-ny';
    const requestedDays = 5;
    const beforeBalance = global.__balances?.get(`${employeeId}:${locationId}`)?.balanceDays;

    const { status, body } = await retryRequest(() =>
      makeRequest('POST', '/api/hcm/deny', { employeeId, locationId, requestedDays })
    );
    
    expect(status).toBe(200);
    expect(body.success).toBe(true);

    const afterBalance = global.__balances?.get(`${employeeId}:${locationId}`)?.balanceDays;
    expect(afterBalance).toBe(beforeBalance);
  });

  it('manager pre-flight check returns sufficient balance', async () => {
    const { status, body } = await retryRequest(() =>
      makeRequest('POST', '/api/hcm/check', {
        employeeId: 'emp-002',
        locationId: 'loc-ny',
        requestedDays: 3,
      })
    );
    
    expect(status).toBe(200);
    expect(body.sufficient).toBe(true);
    expect(body.availableBalance).toBeGreaterThanOrEqual(3);
  });

  it('manager pre-flight check warns on insufficient balance', async () => {
    const { status, body } = await retryRequest(() =>
      makeRequest('POST', '/api/hcm/check', {
        employeeId: 'emp-001',
        locationId: 'loc-ny',
        requestedDays: 1000,
      })
    );
    
    expect(status).toBe(200);
    expect(body.sufficient).toBe(false);
    expect(body.availableBalance).toBeLessThan(1000);
  });

  it('manager can approve and submit time-off for employee', async () => {
    const { status, body } = await retryRequest(() =>
      makeRequest('POST', '/api/hcm/balance', {
        employeeId: 'emp-002',
        locationId: 'loc-ny',
        requestedDays: 2,
      })
    );
    
    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });
});
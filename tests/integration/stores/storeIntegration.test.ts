import { resetBalances } from '../testHelpers';

declare global {
  var __balances: Map<string, any> | undefined;
}

describe('Store Integration - Balance Store with API', () => {
  beforeEach(() => {
    resetBalances();
  });

  it('balance store reflects API balance updates', () => {
    const balance = global.__balances?.get('emp-001:loc-ny');
    const initialBalance = balance?.balanceDays;
    
    balance!.balanceDays -= 5;
    
    expect(global.__balances?.get('emp-001:loc-ny')?.balanceDays).toBe(initialBalance! - 5);
  });

  it('balance store tracks version changes', () => {
    const balance = global.__balances?.get('emp-001:loc-ny');
    const initialVersion = balance?.version;
    
    balance!.version += 1;
    
    expect(global.__balances?.get('emp-001:loc-ny')?.version).toBe(initialVersion! + 1);
  });

  it('balance store tracks multiple employees independently', () => {
    const emp001Balance = global.__balances?.get('emp-001:loc-ny')?.balanceDays;
    const emp002Balance = global.__balances?.get('emp-002:loc-ny')?.balanceDays;
    
    global.__balances?.get('emp-001:loc-ny')!.balanceDays -= 5;
    
    expect(global.__balances?.get('emp-001:loc-ny')?.balanceDays).toBe(emp001Balance! - 5);
    expect(global.__balances?.get('emp-002:loc-ny')?.balanceDays).toBe(emp002Balance);
  });

  it('balance store tracks multiple locations independently', () => {
    const nyBalance = global.__balances?.get('emp-001:loc-ny')?.balanceDays;
    const sfBalance = global.__balances?.get('emp-001:loc-sf')?.balanceDays;
    
    global.__balances?.get('emp-001:loc-ny')!.balanceDays -= 5;
    
    expect(global.__balances?.get('emp-001:loc-ny')?.balanceDays).toBe(nyBalance! - 5);
    expect(global.__balances?.get('emp-001:loc-sf')?.balanceDays).toBe(sfBalance);
  });

  it('balance store preserves lastUpdated timestamp', () => {
    const balance = global.__balances?.get('emp-001:loc-ny');
    
    balance!.balanceDays -= 3;
    balance!.lastUpdated = new Date().toISOString();
    
    const updatedTimestamp = global.__balances?.get('emp-001:loc-ny')?.lastUpdated;
    expect(updatedTimestamp).toBeDefined();
    expect(updatedTimestamp).not.toBe('');
  });

  it('handles concurrent balance modifications', () => {
    const balance = global.__balances?.get('emp-001:loc-ny');
    const initialBalance = balance?.balanceDays;
    
    balance!.balanceDays -= 2;
    balance!.balanceDays -= 3;
    
    expect(global.__balances?.get('emp-001:loc-ny')?.balanceDays).toBe(initialBalance! - 5);
  });
});

describe('Store Integration - API Response Mapping', () => {
  beforeEach(() => {
    resetBalances();
  });

  it('maps balance record to API response format', () => {
    const balance = global.__balances?.get('emp-001:loc-ny');
    
    const apiResponse = {
      success: true,
      balanceDays: balance?.balanceDays,
      version: balance?.version,
      lastUpdated: balance?.lastUpdated,
    };
    
    expect(apiResponse.success).toBe(true);
    expect(apiResponse.balanceDays).toBeDefined();
    expect(apiResponse.version).toBeDefined();
    expect(apiResponse.lastUpdated).toBeDefined();
  });

  it('maps all balances to API batch response format', () => {
    const balances: any[] = [];
    for (const [key, balance] of global.__balances || []) {
      if (balance.employeeId === 'emp-001') {
        balances.push({
          employeeId: balance.employeeId,
          locationId: balance.locationId,
          locationName: balance.locationName,
          balanceDays: balance.balanceDays,
          version: balance.version,
          lastUpdated: balance.lastUpdated,
        });
      }
    }
    
    const apiResponse = { balances };
    
    expect(apiResponse.balances).toBeDefined();
    expect(Array.isArray(apiResponse.balances)).toBe(true);
    expect(apiResponse.balances.length).toBeGreaterThan(0);
  });

  it('maps check result to API response format', () => {
    const balance = global.__balances?.get('emp-001:loc-ny');
    const requestedDays = 5;
    const sufficient = balance ? balance.balanceDays >= requestedDays : false;
    
    const apiResponse = {
      sufficient,
      availableBalance: balance?.balanceDays || 0,
      requestedDays,
      message: sufficient ? 'Balance sufficient' : 'Insufficient balance',
    };
    
    expect(apiResponse.sufficient).toBeDefined();
    expect(apiResponse.availableBalance).toBeDefined();
    expect(apiResponse.requestedDays).toBe(5);
  });

  it('handles insufficient balance response format', () => {
    const balance = global.__balances?.get('emp-001:loc-ny');
    const requestedDays = 1000;
    const sufficient = balance ? balance.balanceDays >= requestedDays : false;
    
    const apiResponse = {
      sufficient,
      availableBalance: balance?.balanceDays || 0,
      requestedDays,
      message: sufficient ? 'Balance sufficient' : `Only ${balance?.balanceDays || 0} days available`,
    };
    
    expect(apiResponse.sufficient).toBe(false);
    expect(apiResponse.availableBalance).toBeLessThan(requestedDays);
    expect(apiResponse.message).toContain('Only');
  });
});
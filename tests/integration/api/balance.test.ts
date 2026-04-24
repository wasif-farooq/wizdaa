import {
  getBalanceRecord,
  getAllBalances,
  updateBalance,
} from '../../../src/lib/hcmStore';

declare global {
  var __balances: Map<string, any> | undefined;
}

describe('HCM API - Balance Operations', () => {
  beforeEach(() => {
    global.__balances = undefined;
  });

  describe('getBalanceRecord', () => {
    it('returns balance for valid employee and location', () => {
      const balance = getBalanceRecord('emp-001', 'loc-ny');
      expect(balance).not.toBeNull();
      expect(balance?.employeeId).toBe('emp-001');
      expect(balance?.balanceDays).toBeGreaterThanOrEqual(10);
    });

    it('returns null for invalid employee', () => {
      expect(getBalanceRecord('emp-invalid', 'loc-ny')).toBeNull();
    });

    it('returns balance with all fields', () => {
      const balance = getBalanceRecord('emp-001', 'loc-ny');
      expect(balance?.locationName).toBeDefined();
      expect(balance?.version).toBeDefined();
      expect(balance?.lastUpdated).toBeDefined();
    });
  });

  describe('getAllBalances', () => {
    it('returns all balances for an employee', () => {
      const balances = getAllBalances('emp-001');
      expect(balances).toHaveLength(4);
    });

    it('each balance has required fields', () => {
      const balances = getAllBalances('emp-001');
      balances.forEach((balance) => {
        expect(balance.employeeId).toBe('emp-001');
        expect(balance.locationId).toBeDefined();
      });
    });

    it('returns empty array for invalid employee', () => {
      expect(getAllBalances('emp-invalid')).toEqual([]);
    });
  });

  describe('updateBalance', () => {
    it('deducts balance when sufficient', () => {
      const result = updateBalance('emp-001', 'loc-ny', 2);
      expect(result.success).toBe(true);
    });

    it('returns insufficient balance when not enough days', () => {
      const result = updateBalance('emp-001', 'loc-ny', 1000);
      expect(result.success).toBe(false);
      expect(result.error).toBe('INSUFFICIENT_BALANCE');
    });

    it('returns not found for invalid employee', () => {
      const result = updateBalance('emp-invalid', 'loc-ny', 1);
      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });
  });
});
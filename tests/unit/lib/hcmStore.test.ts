import {
  getBalanceRecord,
  getAllBalances,
  updateBalance,
  checkBalance,
  denyRequest,
  triggerAnniversaryBonus,
  EMPLOYEES,
  LOCATIONS,
} from '../../../src/lib/hcmStore';

declare global {
  var __balances: Map<string, any> | undefined;
}

describe('HCM Store', () => {
  beforeEach(() => {
    global.__balances = undefined;
  });

  describe('getBalanceRecord', () => {
    it('returns balance record for valid employee and location', () => {
      const balance = getBalanceRecord('emp-001', 'loc-ny');
      expect(balance).not.toBeNull();
      expect(balance?.employeeId).toBe('emp-001');
      expect(balance?.locationId).toBe('loc-ny');
      expect(balance?.balanceDays).toBeGreaterThanOrEqual(10);
    });

    it('returns null for invalid employee', () => {
      expect(getBalanceRecord('emp-invalid', 'loc-ny')).toBeNull();
    });

    it('returns null for invalid location', () => {
      expect(getBalanceRecord('emp-001', 'loc-invalid')).toBeNull();
    });

    it('returns balance with all required fields', () => {
      const balance = getBalanceRecord('emp-001', 'loc-ny');
      expect(balance).not.toBeNull();
      expect(balance?.locationName).toBeDefined();
      expect(balance?.version).toBeDefined();
      expect(balance?.lastUpdated).toBeDefined();
    });
  });

  describe('getAllBalances', () => {
    it('returns all balances for an employee', () => {
      const balances = getAllBalances('emp-001');
      expect(balances).toHaveLength(LOCATIONS.length);
      expect(balances.every((b) => b.employeeId === 'emp-001')).toBe(true);
    });

    it('returns empty array for invalid employee', () => {
      expect(getAllBalances('emp-invalid')).toHaveLength(0);
    });

    it('returns balances for all employees', () => {
      EMPLOYEES.forEach((emp) => {
        const balances = getAllBalances(emp.id);
        expect(balances.length).toBe(LOCATIONS.length);
      });
    });
  });

  describe('updateBalance', () => {
    it('deducts days from balance when sufficient', () => {
      const initialBalance = getBalanceRecord('emp-001', 'loc-ny');
      const initialDays = initialBalance!.balanceDays;
      const result = updateBalance('emp-001', 'loc-ny', 2);
      expect(result.success).toBe(true);
    });

    it('returns INSUFFICIENT_BALANCE when not enough days', () => {
      const result = updateBalance('emp-001', 'loc-ny', 1000);
      expect(result.success).toBe(false);
      expect(result.error).toBe('INSUFFICIENT_BALANCE');
    });

    it('returns NOT_FOUND for invalid employee', () => {
      const result = updateBalance('emp-invalid', 'loc-ny', 1);
      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('returns NOT_FOUND for invalid location', () => {
      const result = updateBalance('emp-001', 'loc-invalid', 1);
      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('returns version and lastUpdated on success', () => {
      const result = updateBalance('emp-003', 'loc-chi', 1);
      expect(result.success).toBe(true);
      expect(result.version).toBeDefined();
      expect(result.lastUpdated).toBeDefined();
    });
  });

  describe('checkBalance', () => {
    it('returns sufficient: true when balance is enough', () => {
      const result = checkBalance('emp-001', 'loc-ny', 5);
      expect(result.sufficient).toBe(true);
      expect(result.availableBalance).toBeGreaterThanOrEqual(5);
    });

    it('returns sufficient: false when balance is not enough', () => {
      const result = checkBalance('emp-001', 'loc-ny', 1000);
      expect(result.sufficient).toBe(false);
      expect(result.message).toContain('Only');
    });

    it('returns NOT_FOUND for invalid employee/location', () => {
      const result = checkBalance('emp-invalid', 'loc-ny', 5);
      expect(result.sufficient).toBe(false);
      expect(result.message).toBe('Balance record not found');
    });
  });

  describe('denyRequest', () => {
    it('returns success', () => {
      const result = denyRequest('emp-001', 'loc-ny', 5);
      expect(result.success).toBe(true);
    });

    it('returns denial message', () => {
      const result = denyRequest('emp-001', 'loc-ny', 5);
      expect(result.message).toBe('Request has been denied');
    });
  });

  describe('triggerAnniversaryBonus', () => {
    it('adds 5 days to a random employee', () => {
      const result = triggerAnniversaryBonus();
      expect(result.success).toBe(true);
      expect(result.bonusDays).toBe(5);
      expect(result.employeeId).toBeDefined();
      expect(result.locationId).toBeDefined();
    });

    it('returns valid employee and location IDs', () => {
      const result = triggerAnniversaryBonus();
      const validEmployeeIds = EMPLOYEES.map((e) => e.id);
      const validLocationIds = LOCATIONS.map((l) => l.id);
      expect(validEmployeeIds).toContain(result.employeeId);
      expect(validLocationIds).toContain(result.locationId);
    });
  });

  describe('EMPLOYEES and LOCATIONS exports', () => {
    it('exports all employees', () => {
      expect(EMPLOYEES.length).toBe(10);
      expect(EMPLOYEES[0].id).toBe('emp-001');
    });

    it('exports all locations', () => {
      expect(LOCATIONS.length).toBe(4);
      expect(LOCATIONS[0].id).toBe('loc-ny');
    });
  });
});
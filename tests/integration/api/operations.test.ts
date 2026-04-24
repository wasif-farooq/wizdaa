import {
  checkBalance,
  denyRequest,
  triggerAnniversaryBonus,
} from '../../../src/lib/hcmStore';

describe('HCM API - Additional Operations', () => {
  beforeEach(() => {
    global.__balances = undefined;
  });

  describe('checkBalance', () => {
    it('returns sufficient: true when balance is enough', () => {
      const result = checkBalance('emp-001', 'loc-ny', 5);
      expect(result.sufficient).toBe(true);
    });

    it('returns sufficient: false when balance is not enough', () => {
      const result = checkBalance('emp-001', 'loc-ny', 1000);
      expect(result.sufficient).toBe(false);
      expect(result.message).toContain('Only');
    });

    it('returns NOT_FOUND for invalid employee', () => {
      const result = checkBalance('emp-invalid', 'loc-ny', 5);
      expect(result.sufficient).toBe(false);
      expect(result.message).toBe('Balance record not found');
    });
  });

  describe('denyRequest', () => {
    it('returns success for valid denial', () => {
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

    it('can be called multiple times', () => {
      const result1 = triggerAnniversaryBonus();
      const result2 = triggerAnniversaryBonus();
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });
  });
});
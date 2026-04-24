import { useRoleStore } from '../../../src/stores/roleStore';

describe('roleStore', () => {
  beforeEach(() => {
    useRoleStore.setState({
      currentRole: 'employee',
      currentEmployeeId: 'emp-001',
    });
  });

  describe('initial state', () => {
    it('has employee as default role', () => {
      expect(useRoleStore.getState().currentRole).toBe('employee');
    });

    it('has emp-001 as default employee', () => {
      expect(useRoleStore.getState().currentEmployeeId).toBe('emp-001');
    });
  });

  describe('setRole', () => {
    it('sets role to manager', () => {
      useRoleStore.getState().setRole('manager');
      expect(useRoleStore.getState().currentRole).toBe('manager');
    });

    it('sets role to employee', () => {
      useRoleStore.getState().setRole('manager');
      useRoleStore.getState().setRole('employee');
      expect(useRoleStore.getState().currentRole).toBe('employee');
    });
  });

  describe('setEmployeeId', () => {
    it('sets current employee ID', () => {
      useRoleStore.getState().setEmployeeId('emp-005');
      expect(useRoleStore.getState().currentEmployeeId).toBe('emp-005');
    });
  });
});
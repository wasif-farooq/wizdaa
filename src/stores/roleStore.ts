import { create } from 'zustand';
import type { Role } from '../lib/types';

interface RoleState {
  currentRole: Role;
  currentEmployeeId: string;
  setRole: (role: Role) => void;
  setEmployeeId: (id: string) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  currentRole: 'employee',
  currentEmployeeId: 'emp-001',

  setRole: (currentRole) => set({ currentRole }),
  setEmployeeId: (currentEmployeeId) => set({ currentEmployeeId }),
}));
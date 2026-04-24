'use client';

import { useRoleStore } from '../../stores';

export function RoleToggle() {
  const { currentRole, setRole } = useRoleStore();
  
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="role" className="text-sm font-medium text-gray-700">
        View as:
      </label>
      <select
        id="role"
        value={currentRole}
        onChange={(e) => setRole(e.target.value as 'employee' | 'manager')}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-1.5 border"
      >
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
      </select>
    </div>
  );
}
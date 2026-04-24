import { render, screen, fireEvent } from '@testing-library/react';
import { RoleToggle } from '../../../../src/components/ui/RoleToggle';
import { useRoleStore } from '../../../../src/stores';

describe('RoleToggle', () => {
  beforeEach(() => {
    useRoleStore.getState().setRole('employee');
  });

  it('renders role toggle with label', () => {
    render(<RoleToggle />);
    
    expect(screen.getByText('View as:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders employee and manager options', () => {
    render(<RoleToggle />);
    
    expect(screen.getByRole('option', { name: 'Employee' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Manager' })).toBeInTheDocument();
  });

  it('shows current role', () => {
    render(<RoleToggle />);
    
    expect(screen.getByRole('combobox')).toHaveValue('employee');
  });

  it('changes role when selecting different option', () => {
    render(<RoleToggle />);
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'manager' } });
    
    expect(screen.getByRole('combobox')).toHaveValue('manager');
  });

  it('updates store when role changes', () => {
    render(<RoleToggle />);
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'manager' } });
    
    expect(useRoleStore.getState().currentRole).toBe('manager');
  });
});
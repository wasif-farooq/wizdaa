import type { Meta, StoryObj } from '@storybook/react';
import { RoleToggle } from '../components/ui/RoleToggle';

const meta: Meta<typeof RoleToggle> = {
  title: 'UI/RoleToggle',
  component: RoleToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RoleToggle>;

export const EmployeeView: Story = {
  args: {},
  parameters: {
    initialState: 'employee',
  },
};

export const ManagerView: Story = {
  args: {},
  parameters: {
    initialState: 'manager',
  },
};
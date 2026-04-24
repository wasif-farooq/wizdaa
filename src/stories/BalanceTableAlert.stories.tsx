import type { Meta, StoryObj } from '@storybook/react';
import { BalanceTableAlert } from '../components/shared/BalanceTableAlert';

const meta: Meta<typeof BalanceTableAlert> = {
  title: 'Shared/BalanceTableAlert',
  component: BalanceTableAlert,
};

export default meta;
type Story = StoryObj<typeof BalanceTableAlert>;

export const ErrorAlert: Story = {
  args: {
    type: 'error',
    message: 'Failed to fetch balances from HCM',
    currentCount: 0,
    expectedCount: 4,
  },
};

export const WarningAlert: Story = {
  args: {
    type: 'warning',
    message: '',
    currentCount: 2,
    expectedCount: 4,
  },
};

export const InfoAlert: Story = {
  args: {
    type: 'info',
    message: '',
    currentCount: 4,
    expectedCount: 4,
  },
};
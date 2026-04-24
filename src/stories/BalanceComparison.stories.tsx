import type { Meta, StoryObj } from '@storybook/react';
import { BalanceComparison } from '../components/shared/BalanceComparison';

const meta: Meta<typeof BalanceComparison> = {
  title: 'Shared/BalanceComparison',
  component: BalanceComparison,
};

export default meta;
type Story = StoryObj<typeof BalanceComparison>;

export const Unchanged: Story = {
  args: {
    submissionBalance: 15,
    currentBalance: 15,
  },
};

export const Changed: Story = {
  args: {
    submissionBalance: 15,
    currentBalance: 10,
  },
};

export const Increased: Story = {
  args: {
    submissionBalance: 15,
    currentBalance: 20,
  },
};

export const NullCurrent: Story = {
  args: {
    submissionBalance: 15,
    currentBalance: null,
  },
};
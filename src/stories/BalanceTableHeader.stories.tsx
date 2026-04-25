import type { Meta, StoryObj } from '@storybook/react';
import { BalanceTableHeader } from '../components/shared/BalanceTableHeader';

const meta: Meta<typeof BalanceTableHeader> = {
  title: 'Shared/BalanceTableHeader',
  component: BalanceTableHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BalanceTableHeader>;

export const Default: Story = {
  args: {
    title: 'Time-Off Balances',
    totalDays: 25,
  },
};

export const ZeroDays: Story = {
  args: {
    title: 'Time-Off Balances',
    totalDays: 0,
  },
};

export const ManyDays: Story = {
  args: {
    title: 'Time-Off Balances',
    totalDays: 50,
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '../components/shared/StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Shared/StatusBadge',
  component: StatusBadge,
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Optimistic: Story = {
  args: {
    status: 'optimistic',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Approved: Story = {
  args: {
    status: 'approved',
  },
};

export const Denied: Story = {
  args: {
    status: 'denied',
  },
};

export const HcmRejected: Story = {
  args: {
    status: 'hcmRejected',
  },
};

export const Idle: Story = {
  args: {
    status: 'idle',
  },
};
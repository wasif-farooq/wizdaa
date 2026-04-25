import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '../components/shared/EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Shared/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'Pending Requests',
    message: 'No pending requests at this time.',
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'No Data',
    message: 'There is no data available.',
    icon: '📭',
  },
};
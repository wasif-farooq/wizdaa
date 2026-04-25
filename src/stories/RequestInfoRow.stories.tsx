import type { Meta, StoryObj } from '@storybook/react';
import { RequestInfoRow } from '../components/shared/RequestInfoRow';

const meta: Meta<typeof RequestInfoRow> = {
  title: 'Shared/RequestInfoRow',
  component: RequestInfoRow,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RequestInfoRow>;

export const Default: Story = {
  args: {
    label: 'Location:',
    value: 'Vacation',
  },
};

export const WithNumber: Story = {
  args: {
    label: 'Days Requested:',
    value: 5,
  },
};

export const Highlighted: Story = {
  args: {
    label: 'Total:',
    value: '$500.00',
    highlighted: true,
  },
};

export const WithDate: Story = {
  args: {
    label: 'Submitted:',
    value: '2024-01-15 09:30:00',
  },
};
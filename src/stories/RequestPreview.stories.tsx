import type { Meta, StoryObj } from '@storybook/react';
import { RequestPreview } from '../components/shared/RequestPreview';

const meta: Meta<typeof RequestPreview> = {
  title: 'Shared/RequestPreview',
  component: RequestPreview,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RequestPreview>;

export const Default: Story = {
  args: {
    location: { id: 'vacation', name: 'Vacation', balanceDays: 15 },
    requestedDays: 5,
  },
};

export const AllDays: Story = {
  args: {
    location: { id: 'vacation', name: 'Vacation', balanceDays: 10 },
    requestedDays: 10,
  },
};

export const NoSelection: Story = {
  args: {
    location: undefined,
    requestedDays: 0,
  },
};

export const ZeroDays: Story = {
  args: {
    location: { id: 'vacation', name: 'Vacation', balanceDays: 15 },
    requestedDays: 0,
  },
};
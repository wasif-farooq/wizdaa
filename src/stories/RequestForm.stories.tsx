import type { Meta, StoryObj } from '@storybook/react';
import { RequestForm } from '../components/request/RequestForm';

const meta: Meta<typeof RequestForm> = {
  title: 'Request/RequestForm',
  component: RequestForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RequestForm>;

export const Idle: Story = {
  args: {
    locations: [
      { id: 'loc-ny', name: 'New York Office', balanceDays: 15 },
      { id: 'loc-sf', name: 'San Francisco Office', balanceDays: 10 },
    ],
    onSubmit: async () => {},
    isSubmitting: false,
    submitStatus: 'idle',
  },
};

export const Submitting: Story = {
  args: {
    locations: [
      { id: 'loc-ny', name: 'New York Office', balanceDays: 15 },
      { id: 'loc-sf', name: 'San Francisco Office', balanceDays: 10 },
    ],
    onSubmit: async () => {},
    isSubmitting: true,
    submitStatus: 'submitting',
  },
};

export const Success: Story = {
  args: {
    locations: [
      { id: 'loc-ny', name: 'New York Office', balanceDays: 15 },
      { id: 'loc-sf', name: 'San Francisco Office', balanceDays: 10 },
    ],
    onSubmit: async () => {},
    isSubmitting: false,
    submitStatus: 'success',
  },
};

export const Error: Story = {
  args: {
    locations: [
      { id: 'loc-ny', name: 'New York Office', balanceDays: 15 },
      { id: 'loc-sf', name: 'San Francisco Office', balanceDays: 10 },
    ],
    onSubmit: async () => {},
    isSubmitting: false,
    submitStatus: 'error',
    errorMessage: 'Insufficient balance: requested 10 days but only 5 available',
  },
};
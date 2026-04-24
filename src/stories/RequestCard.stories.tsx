import type { Meta, StoryObj } from '@storybook/react';
import { RequestCard } from '../components/manager/RequestCard';
import type { TimeOffRequest } from '../lib/types';

const meta: Meta<typeof RequestCard> = {
  title: 'Manager/RequestCard',
  component: RequestCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RequestCard>;

const baseRequest: TimeOffRequest = {
  id: 'req-001',
  employeeId: 'emp-001',
  employeeName: 'Alice Johnson',
  locationId: 'loc-ny',
  locationName: 'New York Office',
  requestedDays: 5,
  submittedAt: new Date().toISOString(),
  status: 'optimistic',
  balanceAtSubmission: 15,
};

export const Pending: Story = {
  args: {
    request: { ...baseRequest, status: 'optimistic' },
    onApprove: () => {},
    onDeny: () => {},
    isProcessing: false,
  },
};

export const Approved: Story = {
  args: {
    request: { ...baseRequest, status: 'approved' },
    onApprove: () => {},
    onDeny: () => {},
    isProcessing: false,
  },
};

export const Denied: Story = {
  args: {
    request: { ...baseRequest, status: 'denied' },
    onApprove: () => {},
    onDeny: () => {},
    isProcessing: false,
  },
};

export const HcmRejected: Story = {
  args: {
    request: { ...baseRequest, status: 'hcmRejected' },
    onApprove: () => {},
    onDeny: () => {},
    isProcessing: false,
  },
};

export const Processing: Story = {
  args: {
    request: baseRequest,
    onApprove: () => {},
    onDeny: () => {},
    isProcessing: true,
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { PendingRequestsList } from '../components/manager/PendingRequestsList';
import type { TimeOffRequest } from '../lib/types';

const meta: Meta<typeof PendingRequestsList> = {
  title: 'Manager/PendingRequestsList',
  component: PendingRequestsList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PendingRequestsList>;

const requests: TimeOffRequest[] = [
  {
    id: 'req-001',
    employeeId: 'emp-001',
    employeeName: 'Alice Johnson',
    locationId: 'loc-ny',
    locationName: 'New York Office',
    requestedDays: 5,
    submittedAt: new Date().toISOString(),
    status: 'optimistic',
    balanceAtSubmission: 15,
  },
  {
    id: 'req-002',
    employeeId: 'emp-002',
    employeeName: 'Bob Smith',
    locationId: 'loc-sf',
    locationName: 'San Francisco Office',
    requestedDays: 3,
    submittedAt: new Date().toISOString(),
    status: 'pending',
    balanceAtSubmission: 10,
  },
];

export const Default: Story = {
  args: {
    requests,
    onApprove: () => {},
    onDeny: () => {},
    isProcessing: false,
  },
};

export const Empty: Story = {
  args: {
    requests: [],
    onApprove: () => {},
    onDeny: () => {},
    isProcessing: false,
  },
};

export const Processing: Story = {
  args: {
    requests,
    onApprove: () => {},
    onDeny: () => {},
    isProcessing: true,
  },
};
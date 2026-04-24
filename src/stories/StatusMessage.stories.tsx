import type { Meta, StoryObj } from '@storybook/react';
import { StatusMessage } from '../components/shared/StatusMessage';

const meta: Meta<typeof StatusMessage> = {
  title: 'Shared/StatusMessage',
  component: StatusMessage,
};

export default meta;
type Story = StoryObj<typeof StatusMessage>;

export const Success: Story = {
  args: {
    type: 'success',
    text: 'Request submitted successfully!',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    text: 'Failed to submit request',
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    text: 'Submitting request...',
  },
};
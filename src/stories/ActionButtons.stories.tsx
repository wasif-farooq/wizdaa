import type { Meta, StoryObj } from '@storybook/react';
import { ActionButtons } from '../components/shared/ActionButtons';

const meta: Meta<typeof ActionButtons> = {
  title: 'Shared/ActionButtons',
  component: ActionButtons,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActionButtons>;

export const Default: Story = {
  args: {
    onApprove: () => console.log('approve'),
    onDeny: () => console.log('deny'),
    isProcessing: false,
    isDisabled: false,
  },
};

export const Processing: Story = {
  args: {
    onApprove: () => console.log('approve'),
    onDeny: () => console.log('deny'),
    isProcessing: true,
    isDisabled: false,
  },
};

export const Disabled: Story = {
  args: {
    onApprove: () => console.log('approve'),
    onDeny: () => console.log('deny'),
    isProcessing: false,
    isDisabled: true,
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import { DaysInput } from '../components/request/DaysInput';

const meta: Meta<typeof DaysInput> = {
  title: 'Request/DaysInput',
  component: DaysInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DaysInput>;

export const Default: Story = {
  args: {
    value: 1,
    onChange: () => {},
    maxDays: 15,
    disabled: false,
  },
};

export const WithValue: Story = {
  args: {
    value: 5,
    onChange: () => {},
    maxDays: 15,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: 3,
    onChange: () => {},
    maxDays: 15,
    disabled: true,
  },
};

export const MaxReached: Story = {
  args: {
    value: 15,
    onChange: () => {},
    maxDays: 15,
    disabled: false,
  },
};
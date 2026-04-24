import type { Meta, StoryObj } from '@storybook/react';
import { LocationSelect } from '../components/request/LocationSelect';

const meta: Meta<typeof LocationSelect> = {
  title: 'Request/LocationSelect',
  component: LocationSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LocationSelect>;

export const Idle: Story = {
  args: {
    locations: [
      { id: 'loc-ny', name: 'New York Office', balanceDays: 15 },
      { id: 'loc-sf', name: 'San Francisco Office', balanceDays: 10 },
      { id: 'loc-chi', name: 'Chicago Office', balanceDays: 5 },
    ],
    value: '',
    onChange: () => {},
    disabled: false,
  },
};

export const Filled: Story = {
  args: {
    locations: [
      { id: 'loc-ny', name: 'New York Office', balanceDays: 15 },
      { id: 'loc-sf', name: 'San Francisco Office', balanceDays: 10 },
    ],
    value: 'loc-ny',
    onChange: () => {},
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    locations: [
      { id: 'loc-ny', name: 'New York Office', balanceDays: 15 },
    ],
    value: 'loc-ny',
    onChange: () => {},
    disabled: true,
  },
};

export const AllZeroBalances: Story = {
  args: {
    locations: [
      { id: 'loc-ny', name: 'New York Office', balanceDays: 0 },
      { id: 'loc-sf', name: 'San Francisco Office', balanceDays: 0 },
    ],
    value: '',
    onChange: () => {},
    disabled: false,
  },
};
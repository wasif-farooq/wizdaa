import type { Meta, StoryObj } from '@storybook/react';
import { BalanceTable } from '../components/balance/BalanceTable';

const meta: Meta<typeof BalanceTable> = {
  title: 'Balance/BalanceTable',
  component: BalanceTable,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof BalanceTable>;

export const Default: Story = {
  args: {
    balances: [
      { locationId: 'loc-ny', locationName: 'New York Office', balanceDays: 15, lastUpdated: new Date().toISOString() },
      { locationId: 'loc-sf', locationName: 'San Francisco Office', balanceDays: 10, lastUpdated: new Date().toISOString() },
    ],
    optimisticDeductions: new Map(),
    staleLocations: new Set(),
    isLoading: false,
    expectedLocations: 4,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    balances: [],
    optimisticDeductions: new Map(),
    staleLocations: new Set(),
    isLoading: true,
    expectedLocations: 4,
    error: null,
  },
};

export const WithOptimistic: Story = {
  args: {
    balances: [
      { locationId: 'loc-ny', locationName: 'New York Office', balanceDays: 15, lastUpdated: new Date().toISOString() },
      { locationId: 'loc-sf', locationName: 'San Francisco Office', balanceDays: 10, lastUpdated: new Date().toISOString() },
    ],
    optimisticDeductions: new Map([['loc-ny', 5]]),
    staleLocations: new Set(),
    isLoading: false,
    expectedLocations: 4,
    error: null,
  },
};

export const WithStale: Story = {
  args: {
    balances: [
      { locationId: 'loc-ny', locationName: 'New York Office', balanceDays: 15, lastUpdated: new Date().toISOString() },
      { locationId: 'loc-sf', locationName: 'San Francisco Office', balanceDays: 10, lastUpdated: new Date().toISOString() },
    ],
    optimisticDeductions: new Map(),
    staleLocations: new Set(['loc-ny']),
    isLoading: false,
    expectedLocations: 4,
    error: null,
  },
};

export const WithError: Story = {
  args: {
    balances: [],
    optimisticDeductions: new Map(),
    staleLocations: new Set(),
    isLoading: false,
    expectedLocations: 4,
    error: 'Failed to fetch balances from HCM',
  },
};
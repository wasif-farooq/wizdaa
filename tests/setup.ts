import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const mockQueryClient = {
  clear: jest.fn(),
  cancelQueries: jest.fn(),
  invalidateQueries: jest.fn(),
  setQueriesData: jest.fn(),
  getQueryData: jest.fn(),
  setQueryData: jest.fn(),
  removeQueries: jest.fn(),
};

const mockQuery = {
  data: undefined,
  error: null,
  status: 'idle',
  isLoading: false,
  isSuccess: false,
  isError: false,
  isFetching: false,
  refetch: jest.fn(),
};

const mockMutation = {
  mutate: jest.fn(),
  mutateAsync: jest.fn(),
  reset: jest.fn(),
  status: 'idle',
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => mockQuery),
  useMutation: jest.fn(() => mockMutation),
  useQueryClient: jest.fn(() => mockQueryClient),
  QueryClient: class {
    constructor() {}
    clear() {}
    getQueryCache() {
      return { clear: jest.fn() };
    }
    getMutationCache() {
      return { clear: jest.fn() };
    }
  },
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  QueryCache: class {
    subscribe() {}
    clear() {}
  },
  MutationCache: class {
    subscribe() {}
    clear() {}
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockQuery.data = undefined;
  mockQuery.error = null;
  mockQuery.status = 'idle';
  mockQuery.isLoading = false;
  mockQuery.isSuccess = false;
  mockQuery.isError = false;
  mockQuery.isFetching = false;
  mockMutation.status = 'idle';
  mockMutation.isLoading = false;
  mockMutation.isSuccess = false;
  mockMutation.isError = false;
  mockMutation.error = null;
});
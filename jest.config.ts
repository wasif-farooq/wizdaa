import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/*.test.{ts,tsx}'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
    }],
  },
  collectCoverageFrom: [
    'src/lib/hcmStore.ts',
    'src/lib/types.ts',
    'src/stores/balanceStore.ts',
    'src/stores/requestStore.ts',
    'src/stores/roleStore.ts',
    'src/components/shared/*.tsx',
    'src/components/**/*.tsx',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'json', 'html'],
};

export default config;
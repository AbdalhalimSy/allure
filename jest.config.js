const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './'
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next/image$': '<rootDir>/src/tests/mocks/NextImageMock.tsx'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types/**',
    '!src/tests/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  // Initial threshold disabled until broader test coverage implemented.
};

module.exports = createJestConfig(customJestConfig);

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Path to the setup file
  testEnvironment: 'jsdom', // Required for React component tests
};

export default config;

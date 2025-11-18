// Jest setup file
// This file runs before all tests

// Mock environment variables for testing
process.env.GITHUB_TOKEN = 'test_github_token_1234567890';
process.env.GEMINI_API_KEY = 'test_gemini_key_1234567890';
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console output in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: console.error, // Keep errors visible
};

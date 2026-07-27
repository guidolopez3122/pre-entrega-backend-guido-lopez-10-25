// Jest configuration for ESM project
module.exports = {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/test/**/*.test.js'
  ],
  setupFiles: [
    './jest.setup.cjs'
  ],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json'],
  transformIgnorePatterns: [],
  testTimeout: 30000
};

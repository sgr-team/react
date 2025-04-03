/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/api-tickets-adapter-tests/tests/**/*.test.ts"],
  transform: {
    "^.+.ts$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  maxWorkers: 1,
  maxConcurrency: 1,
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupJest.ts'
  ]
};
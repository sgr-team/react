/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+.ts$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
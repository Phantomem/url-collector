/* eslint-disable no-undef */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

process.env.API_TIMEOUT=6000
process.env.CONCURRENT_REQUESTS=5
process.env.SERVER_TIMEOUT=120000
process.env.API_TIMEOUT=60000

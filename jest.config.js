const {defaults} = require('jest-config');

/** @type {import('jest').Config} */
const config = {
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts', 'cts'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^./sharefile$': '<rootDir>/sharefile.js',
    },
    isolatedModules: true,
};

module.exports = config;
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: '<rootDir>/tsconfig.json' }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/main.tsx',
        '!src/vite-env.d.ts'
    ],
    coverageReporters: ['lcov', 'text-summary'],
};

export default config;




// import type { Config } from 'jest';

// const config: Config = {
//     preset: 'ts-jest/presets/js-with-ts',
//     testEnvironment: 'jsdom',
//     transform: {
//         '^.+\\.(ts|tsx)$': 'ts-jest',
//     },
//     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
//     testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
//     setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
//     moduleNameMapper: {
//         '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
//     },
// };

// export default config;


// import type { Config } from 'jest';
//
//
// const config: Config = {
//     preset: 'ts-jest',
//     testEnvironment: 'jsdom',
//     transform: {
//         '^.+\\.(ts|tsx)$': 'ts-jest',
//     },
//     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
//     testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
//     setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
//     globals: {
//         'ts-jest': {
//             useESM: true,
//         },
//     },
// };
//
// export default config;
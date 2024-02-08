import type { Config } from 'jest'

const config: Config = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ['react-native'],
    },
    preset: 'ts-jest',
    moduleNameMapper: {
        '\\.scss$': 'identity-obj-proxy',
    },
}

export default config

const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslint],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            classes: true,
            modules: true,
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}

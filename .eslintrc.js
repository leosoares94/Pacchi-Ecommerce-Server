module.exports = {
    env: {
        commonjs: true,
        es2020: true,
        node: true
    },
    plugins: ['prettier'],
    extends: ['airbnb-base', 'prettier'],
    parserOptions: {
        ecmaVersion: 11
    },
    rules: {
        'prettier/prettier': 2,
        'no-unused-vars': 'off',
        'no-console': 'off',
        'consistent-return': 'off',
        'no-param-reassign': 'off',
        camelcase: 'off',
        'object-shorthand': 'off',
        'no-shadow': 'off',
        'no-path-concat': 'off',
        'prefer-template': 'off'
    }
};

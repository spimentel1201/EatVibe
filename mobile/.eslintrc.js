module.exports = {
    extends: ['expo', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'react-hooks/exhaustive-deps': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
};

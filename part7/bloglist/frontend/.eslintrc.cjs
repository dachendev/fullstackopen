module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    'vitest-globals/env': true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:vitest-globals/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: [
    'react-refresh',
    '@stylistic/eslint-plugin',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 0,
    '@stylistic/indent': ['error', 2],
    '@stylistic/linebreak-style': ['error', 'unix'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'never'],
    'eqeqeq': 'error',
    // 'no-trailing-spaces': 'error',
    // 'object-curly-spacing': ['error', 'always'],
    // 'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'no-console': 'off'
  },
}

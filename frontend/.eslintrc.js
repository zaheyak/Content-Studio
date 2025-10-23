module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};


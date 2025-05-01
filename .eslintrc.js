module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // prettier와 충돌 방지
  ],
  plugins: ['react', 'react-native', '@typescript-eslint'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'import/extensions': 'off',
    'react/react-in-jsx-scope': 'off', // React 17+
    'react-native/no-inline-styles': 'off', // 필요한 경우 꺼도 됨
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'react-native/sort-styles': 'off',
    'import/prefer-default-export': 'off',
    camelcase: 'off',
  },
};

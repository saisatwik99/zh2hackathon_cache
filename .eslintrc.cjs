module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false
  },
  plugins: [
    '@babel'
  ],
  extends: [
    'airbnb-base'
  ],
  rules: {
    'max-len': ['error', { code: 120 }],
    indent: ['error', 2],
    'comma-dangle': ['error', 'never'],
    'linebreak-style': 0,
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-console': 0,
    'import/extensions': [
      'error',
      'ignorePackages'
    ]
  }
};

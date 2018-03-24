module.exports = {
  root: true,
  // parser: 'babel-eslint',
  // parserOptions: {
  //   sourceType: 'module'
  // },
  extends: 'style-guide',
  plugins: [

  ],
  env: {
    node: true,
    mocha: true,
  },
  globals: {

  },
  settings: {

  },
  rules: {
    'wrap-iife': ['error', 'any'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // This rule warns the usage of `console`
    // 不禁用 console
    'no-console': 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-unused-vars': 'off',
    'global-require': 'off',
    'prefer-destructuring': 'off',
    // https://eslint.cn/docs/rules/guard-for-in
    'guard-for-in': 'off',
    // specify the maximum length of a line in your program
  },
};
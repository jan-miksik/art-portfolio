module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'prettier',
    'standard',
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-unused-vars': 1,
    'no-unused-vars': 1,
    'vue/html-self-closing': 0,
    'space-before-function-paren': 0,
    'vue/no-multiple-template-root': 0,
    'vue/html-indent': 0,
    'func-call-spacing': 0,
    semi: 1
  }
}

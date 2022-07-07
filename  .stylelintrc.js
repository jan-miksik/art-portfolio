module.exports = {
  root: true,
  plugins: ['stylelint-order'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue'
  ],
  overrides: [
    {
      files: [
        '**/*.vue'
      ],
      customSyntax: 'postcss-html'
    }
  ],
  rules: {
  }
}

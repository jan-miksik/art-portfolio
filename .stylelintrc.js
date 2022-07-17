module.exports = {
  extends: ["stylelint-config-recommended-vue", 'stylelint-config-standard-vue', "stylelint-stylus/standard"],
  "overrides": [
    {
        "files": ["*.vue", "**/*.vue"],
        "rules": {
            "unit-allowed-list": ["em", "rem", "s", "px", "%", "deg", "vh", "vw"],
            "selector-class-pattern": "^[a-zA-Z][\\w-]*$",
            "no-eol-whitespace": [ true, { "severity": "warning" }],
            "max-empty-lines": [2, { "severity": "warning" }],
            "max-line-length": 200
        }
    }
]
}

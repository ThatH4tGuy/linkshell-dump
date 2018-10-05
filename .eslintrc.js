module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-unused-vars": "error",
    "no-case-declarations": 0,
    "quotes": ["error", "double"],
    "no-undef": "error",
    "array-callback-return": "error",
    "block-scoped-var": "error",
    "curly": "error",
    "default-case": "error",
    "dot-location": ["error", "property"],
    "dot-notation": "error",
    "eqeqeq": "error",
    "no-alert": "error",
    "no-caller": "error",
    "no-else-return": "warn",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-invalid-this": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-multi-spaces": "error",
    "no-native-reassign": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-return-assign": "error",
    "no-throw-literal": "error",
    "no-unused-expressions": "warn",
    "no-useless-concat": "warn",
    "no-useless-escape": "warn",
    "no-void": "error",
    "no-warning-comments": [
      "warn", {
        "terms": ["todo", "fixme"], "location": "start"
      }
    ],
    "no-with": "error",
    "radix": "error",
    "no-shadow": "error",
    "no-shadow-restricted-names": "error",
    "no-use-before-define": "error",
    "array-bracket-spacing": ["error", "never"],
    "block-spacing": ["error", "never"],
    "brace-style": ["error", "1tbs"],
    "camelcase": [
      "error", {
        "properties": "always"
      }
    ],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "consistent-this": ["error", "that"],
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "key-spacing": ["error", {"beforeColon": false, "afterColon": true}],
    "new-cap": "error",
    "new-parens":"error",
    "newline-per-chained-call": ["error", {"ignoreChainWithDepth": 3}],
    "no-lonely-if": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-multiple-empty-lines": ["error", {"max": 2}],
    "no-spaced-func": "error",
    "no-trailing-spaces": "error",
    "no-whitespace-before-property": "error",
    "object-curly-spacing": ["error", "never"],
    "operator-linebreak": ["error", "before"],
    "padded-blocks": ["error", "never"],
    "require-jsdoc": "warn",
    "semi-spacing": "error",
    "space-before-blocks": ["warn", "always"],
    "space-before-function-paren": ["error", "never"],
    "space-in-parens": ["error", "never"],
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": ["error", "always"],
    "template-curly-spacing": ["error", "never"],
    "no-var": "error",
    "prefer-const": "warn"
  }
};

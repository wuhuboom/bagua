module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
  overrides: [
    {
      files: [
        "src/assets/font/iconfont.js",
        "src/directives/color.js",
        "src/directives/emoji.js",
        "src/directives/longpress.js",
        "src/plugins/bets.js",
      ],
      rules: {
        "no-self-assign": "off",
        "no-unused-vars": "off",
        "no-useless-escape": "off",
        "no-empty": "off",
        "vue/return-in-computed-property": "off",
      },
    },
  ],
};

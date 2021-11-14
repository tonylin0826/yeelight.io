module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ["standard", "prettier"],
  parserOptions: {
    ecmaVersion: 2015
  },
  rules: {
    camelcase: "error",
  }
};

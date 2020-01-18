module.exports = {
    parser: "babel-eslint",
    env: {
        browser: true,
        es6: true
    },
    extends: ["airbnb", "prettier"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ["react", "prettier"],
    rules: {
        quotes: [2, "double", {
            avoidEscape: true
        }],
        "react/jsx-filename-extension": [1, {
            extensions: [".js", ".jsx"]
        }],
        "jsx-a11y/anchor-is-valid": "off",
        "prettier/prettier": "error",
        "react/jsx-wrap-multilines": 0,
        "react/no-danger": 0,
        "react/jsx-props-no-spreading": 0
    }
};
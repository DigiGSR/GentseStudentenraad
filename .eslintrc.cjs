module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:svelte/prettier",
    ],
    overrides: [
        {
            files: ["*.svelte"],
            parser: "svelte-eslint-parser",
            // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
            parserOptions: {
                parser: "@typescript-eslint/parser",
            },
        },
        // ...
    ],
    plugins: ["svelte", "@typescript-eslint"],
    ignorePatterns: ["*.cjs"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
};

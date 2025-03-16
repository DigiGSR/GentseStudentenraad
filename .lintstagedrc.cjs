module.exports = {
    "*": "prettier --plugin-search-dir . --check --write",
    "*.{ts,js,svelte}": ["eslint"],
};

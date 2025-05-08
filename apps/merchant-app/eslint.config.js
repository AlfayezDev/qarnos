const { defineConfig } = require("eslint/config");
const reactCompiler = require("eslint-plugin-react-compiler");

module.exports = defineConfig([
	{
		ignores: ["dist/*", ".expo/*"],
		plugins: {
			"react-compiler": reactCompiler,
		},
		rules: {
			// Only enable React compiler rule
			"react-compiler/react-compiler": "error",

			// Disable all other rules
			"@typescript-eslint/no-unused-vars": "off",
			"react/jsx-uses-react": "off",
			"react/react-in-jsx-scope": "off",
			// All other rules disabled by default
		},
	},
]);

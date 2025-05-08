const { defineConfig } = require("eslint/config");
const reactCompiler = require("eslint-plugin-react-compiler");

module.exports = defineConfig([
	{
		ignores: ["dist/*", ".expo/*"],
		plugins: { "react-compiler": reactCompiler },
		rules: { "react-compiler/react-compiler": "error" },
	},
]);

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withMonorepoPaths(
	withNativeWind(getDefaultConfig(__dirname, {}), {
		input: "./theme/global.css",
		inlineRem: 16,
	}),
);

function withMonorepoPaths(config) {
	const projectRoot = __dirname;
	const workspaceRoot = path.resolve(projectRoot, "../..");

	// #1 - Watch all files in the monorepo
	config.watchFolders = [workspaceRoot];

	// #2 - Resolve modules within the project's `node_modules` first, then all monorepo modules
	config.resolver.nodeModulesPaths = [
		path.resolve(projectRoot, "node_modules"),
		path.resolve(workspaceRoot, "node_modules"),
	];

	return config;
}

module.exports = config;

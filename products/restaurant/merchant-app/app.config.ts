import type { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "qarn-merchant",
	slug: "qarn-merchant",
	version: "1.0.0",
	scheme: "qarn-merchant",
	web: {
		bundler: "metro",
		output: "static",
		favicon: "./assets/favicon.png",
	},
	plugins: ["expo-router"],
	experiments: {
		typedRoutes: true,
		tsconfigPaths: true,
	},

	orientation: "portrait",
	icon: "./assets/icon.png",
	userInterfaceStyle: "automatic",
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
		bundleIdentifier: "com.qarnos.restaurant.merchant.ios",
	},
	android: {
		package: "com.qarnos.restaurant.merchant.android",
		adaptiveIcon: {
			foregroundImage: "./assets/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
	},
});

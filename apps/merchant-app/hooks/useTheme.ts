import { useColorScheme } from "react-native";
import { theme, ThemeMode } from "@/constants/theme";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const useTheme = () => {
	const colorScheme = useColorScheme() || "light";
	const isDark = colorScheme === "dark";
	const mode: ThemeMode = isDark ? "dark" : "light";
	const navTheme = isDark ? DarkTheme : DefaultTheme;

	return {
		colors: theme.colors[mode],
		isDark,
		mode,
		spacing: theme.spacing,
		radius: theme.radius,
		sizes: theme.sizes,
		typography: theme.typography,
		shadows: theme.shadows,
		platform: theme.platform,
		navTheme: {
			...navTheme,
			colors: {
				...navTheme.colors,
				primary: theme.colors[mode].primary,
				background: theme.colors[mode].background,
				card: theme.colors[mode].card,
				text: theme.colors[mode].text,
				border: theme.colors[mode].divider,
				notification: theme.colors[mode].primary,
			},
		},
	};
};
export type AppTheme = ReturnType<typeof useTheme>;
export type SpacingToken = keyof typeof theme.spacing;
export type RadiusToken = keyof typeof theme.radius;
export type ColorToken = keyof typeof theme.colors.light;
export type SizeToken = keyof typeof theme.sizes;
export type ShadowToken = keyof typeof theme.shadows;
export type FontSizeVariant = keyof typeof theme.typography.sizes;
export type FontWeightVariant = keyof typeof theme.typography.weights;
export type LineHeightVariant = keyof typeof theme.typography.lineHeights;

export type ThemeTokens = {
	spacing: SpacingToken;
	radius: RadiusToken;
	colors: ColorToken;
	sizes: SizeToken;
	shadows: ShadowToken;
	typography: {
		sizes: FontSizeVariant;
		weights: FontWeightVariant;
		lineHeights: LineHeightVariant;
	};
};

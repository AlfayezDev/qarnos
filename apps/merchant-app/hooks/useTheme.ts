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
		shadows: theme.shadows, // Shadows might need mode-specific colors applied
		platform: theme.platform,
		navTheme: {
			// Integrate navigation theme colors
			...navTheme,
			colors: {
				...navTheme.colors,
				primary: theme.colors[mode].primary,
				background: theme.colors[mode].background,
				card: theme.colors[mode].card,
				text: theme.colors[mode].text,
				border: theme.colors[mode].divider,
				notification: theme.colors[mode].primary, // Or error/info
			},
		},
	};
};
export type AppTheme = ReturnType<typeof useTheme>;
export type SpacingToken = keyof AppTheme["spacing"];
export type RadiusToken = keyof AppTheme["radius"];
export type ColorToken = keyof AppTheme["colors"];
export type ThemeTokens = {
	spacing: SpacingToken;
	radius: RadiusToken;
	colors: ColorToken;
};
export type FontSizeVariant = keyof AppTheme["typography"]["sizes"];
export type FontWeightVariant = keyof AppTheme["typography"]["weights"];

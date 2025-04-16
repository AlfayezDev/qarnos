// apps/merchant-app/hooks/useTheme.ts
import { useColorScheme } from "react-native";
import { theme, ThemeMode } from "@/constants/theme";

/**
 * A custom hook that provides access to the current theme
 *
 * @returns An object containing:
 * - colors: Current theme colors based on device color scheme
 * - isDark: Boolean indicating if dark mode is active
 * - mode: Current theme mode ('light' or 'dark')
 * - spacing: Theme spacing values
 * - radius: Theme border radius values
 * - sizes: Theme sizing values
 * - typography: Theme typography values
 * - shadows: Theme shadow values for current mode
 */
export const useTheme = () => {
	const colorScheme = useColorScheme() || "light";
	const isDark = colorScheme === "dark";
	const mode: ThemeMode = isDark ? "dark" : "light";

	return {
		colors: theme.colors[mode],
		isDark,
		mode,
		spacing: theme.spacing,
		radius: theme.radius,
		sizes: theme.sizes,
		typography: theme.typography,
		shadows: theme.shadows[mode],
		platform: theme.platform,
	};
};

// Export type for component props
export type Theme = ReturnType<typeof useTheme>;

// Export token types derived from the Theme object
export type SpacingToken = keyof Theme["spacing"];
export type RadiusToken = keyof Theme["radius"];
export type ColorToken = keyof Theme["colors"];

// Consolidated token types
export type ThemeTokens = {
	spacing: SpacingToken;
	radius: RadiusToken;
	colors: ColorToken;
};

export type FontSizeVariant = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
export type FontWeightVariant =
	| "regular"
	| "medium"
	| "semibold"
	| "bold"
	| "extrabold";

import { theme } from "@/constants/theme";
declare global {
	type SpacingToken = keyof typeof theme.spacing;

	type RadiusToken = keyof typeof theme.radius;
	type ColorToken = keyof typeof theme.colors.light;
	type SizeToken = keyof typeof theme.sizes;
	type ShadowToken = keyof typeof theme.shadows;
	type FontSizeVariant = keyof typeof theme.typography.sizes;
	type FontWeightVariant = keyof typeof theme.typography.weights;
	type LineHeightVariant = keyof typeof theme.typography.lineHeights;

	type ThemeTokens = {
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
}

export {};

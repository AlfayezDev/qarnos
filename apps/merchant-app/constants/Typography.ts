/**
 * Qarn Typography and Shadow Tokens
 */

export const QarnTypography = {
	// Font sizes
	sizes: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		xxl: 24,
		xxxl: 30,
	},

	// Font weights
	weights: {
		regular: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
		extrabold: "800",
	} as const,

	// Line heights
	lineHeights: {
		tight: 1.2,
		normal: 1.5,
		loose: 1.8,
	},
};

export const QarnShadows = {
	light: {
		small: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 2,
			elevation: 1,
		},
		medium: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 2,
		},
		large: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.1,
			shadowRadius: 8,
			elevation: 4,
		},
	},
	dark: {
		small: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.3,
			shadowRadius: 2,
			elevation: 1,
		},
		medium: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.4,
			shadowRadius: 4,
			elevation: 2,
		},
		large: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.5,
			shadowRadius: 8,
			elevation: 4,
		},
	},
};

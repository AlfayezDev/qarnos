import { Platform } from "react-native";

const colorPalette = {
	green: {
		50: "#E5F6ED",
		100: "#CCEDE0",
		500: "#22C55E",
		700: "#15803D",
	},

	neutral: {
		0: "#FFFFFF",
		50: "#F8FAF8",
		100: "#F3F4F6",
		200: "#E5E7EB",
		300: "#9CA3AF",
		400: "#8E8E93",
		500: "#6B7280",
		600: "#636366",
		700: "#38383A",
		800: "#2C2C2E",
		900: "#1C1C1E",
		950: "#0C0C0C",
		1000: "#000000",
	},

	status: {
		success: "#22C55E",
		warning: "#FFD60A",
		info: "#3B82F6",
		error: "#EF4444",
	},
};

export const theme = {
	colors: {
		light: {
			primary: colorPalette.green[500],
			primaryDark: colorPalette.green[700],
			primaryLight: colorPalette.green[50],

			background: colorPalette.neutral[50],
			card: colorPalette.neutral[0],
			cardAlt: colorPalette.neutral[100],

			text: colorPalette.neutral[1000],
			textSecondary: colorPalette.neutral[500],
			textMuted: colorPalette.neutral[300],

			success: colorPalette.status.success,
			warning: colorPalette.status.warning,
			info: colorPalette.status.info,
			error: colorPalette.status.error,

			divider: colorPalette.neutral[200],
			overlay: "rgba(0,0,0,0.4)",
			shadow: "rgba(0,0,0,0.1)",

			tabBar: colorPalette.neutral[0],
			tabIconDefault: colorPalette.neutral[300],
			tabIconSelected: colorPalette.green[500],
		},
		dark: {
			primary: colorPalette.green[500],
			primaryDark: colorPalette.green[700],
			primaryLight: colorPalette.neutral[800],

			background: colorPalette.neutral[950],
			card: colorPalette.neutral[900],
			cardAlt: colorPalette.neutral[800],

			text: colorPalette.neutral[50],
			textSecondary: colorPalette.neutral[400],
			textMuted: colorPalette.neutral[600],

			success: colorPalette.status.success,
			warning: colorPalette.status.warning,
			info: colorPalette.status.info,
			error: colorPalette.status.error,

			divider: colorPalette.neutral[700],
			overlay: "rgba(0,0,0,0.6)",
			shadow: "rgba(0,0,0,0.3)",

			tabBar: colorPalette.neutral[900],
			tabIconDefault: colorPalette.neutral[400],
			tabIconSelected: colorPalette.green[500],
		},
	},

	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
		xxl: 48,

		screenPadding: 16,
		cardPadding: 16,
		itemSpacing: 12,
		sectionSpacing: 24,
	},

	radius: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 24,
		round: 999,

		button: 12,
		card: 16,
		input: 12,
		badge: 12,
	},

	sizes: {
		touchTarget: 44,
		smallTouchTarget: 36,

		iconXs: 16,
		iconSm: 20,
		iconMd: 24,
		iconLg: 32,

		buttonSm: 36,
		buttonMd: 44,
		buttonLg: 52,

		inputHeight: 48,

		headerHeight: 56,
		tabBarHeight: 49,

		avatarSm: 32,
		avatarMd: 44,
		avatarLg: 64,
	},

	typography: {
		sizes: {
			xs: 12,
			sm: 14,
			md: 16,
			lg: 18,
			xl: 20,
			xxl: 24,
			xxxl: 30,
		},

		weights: {
			regular: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800",
		} as const,

		lineHeights: {
			tight: 1.2,
			normal: 1.5,
			loose: 1.8,
		},
	},

	shadows: {
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
	},

	platform: {
		// Use exact iOS status bar height for iPhone with notch (44pt)
		topInset: Platform.OS === "ios" ? 44 : 16,
		bottomInset: Platform.OS === "ios" ? 34 : 16,
		isIOS: Platform.OS === "ios",
	},
};

export type ThemeColors = typeof theme.colors.light;
export type ThemeMode = "light" | "dark";

export const getThemedValue = (mode: ThemeMode) => theme.colors[mode];

export const spacing = theme.spacing;
export const radius = theme.radius;
export const sizes = theme.sizes;
export const typography = theme.typography;
export const shadows = theme.shadows;

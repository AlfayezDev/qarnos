import { Platform } from "react-native";

const colorPalette = {
	// Define your PRIMARY color palette (e.g., Teal or Blue or Violet)
	primary: {
		50: "#F0FDFA", // Lightest shade (used for light primaryLight)
		100: "#CCFBF1",
		200: "#99F6E4",
		300: "#5EEAD4",
		400: "#2DD4BF",
		500: "#14B8A6", // Your main primary color (used for dark primary)
		600: "#0D9488", // Darker shade (used for light primary, dark primaryDark)
		700: "#0F766E", // Even darker (used for light primaryDark)
		800: "#115E59",
		900: "#134E4A",
	},
	// Define your NEUTRAL palette (e.g., Slate or Gray)
	neutral: {
		0: "#FFFFFF", // Pure white
		50: "#F8FAFC", // Light background
		100: "#F1F5F9", // Light cardAlt / dark text
		200: "#E2E8F0", // Light divider
		300: "#CBD5E1", // Light textMuted
		400: "#94A3B8", // Light textSecondary / dark textSecondary
		500: "#64748B", // Light textMuted / dark textMuted
		600: "#475569", // Dark divider
		700: "#334155", // Dark cardAlt
		800: "#1E293B", // Dark card / tabBar
		900: "#0F172A", // Dark background
		950: "#0B111E", // Near black
		1000: "#000000", // Pure black
	},
	// Define STATUS colors - keep these consistent
	status: {
		success: "#22C55E",
		warning: "#F59E0B", // Amber/Orange often better contrast than pure yellow
		info: "#3B82F6",
		error: "#EF4444",
	},
};

// Helper for RGBA still useful for dark primaryLight
const getPrimaryLightRgba = (hex: string, alpha: number): string => {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const theme = {
	colors: {
		light: {
			primary: colorPalette.primary[600], // Consistent main accent hue
			primaryDark: colorPalette.primary[700],
			primaryLight: colorPalette.primary[50],
			background: colorPalette.neutral[50],
			card: colorPalette.neutral[0],
			cardAlt: colorPalette.neutral[100],
			text: colorPalette.neutral[900],
			textSecondary: colorPalette.neutral[500],
			textMuted: colorPalette.neutral[400],
			success: colorPalette.status.success, // Same hex
			warning: colorPalette.status.warning, // Same hex
			info: colorPalette.status.info, // Same hex
			error: colorPalette.status.error, // Same hex
			divider: colorPalette.neutral[200],
			overlay: "rgba(0,0,0,0.4)",
			shadow: "rgba(0,0,0,0.1)", // Base shadow color
			tabBar: colorPalette.neutral[0],
			tabIconDefault: colorPalette.neutral[400],
			tabIconSelected: colorPalette.primary[600], // Match primary
		},
		dark: {
			primary: colorPalette.primary[500], // Consistent main accent hue
			primaryDark: colorPalette.primary[600],
			primaryLight: getPrimaryLightRgba(colorPalette.primary[500], 0.1), // RGBA for subtle dark bg
			background: colorPalette.neutral[900],
			card: colorPalette.neutral[800],
			cardAlt: colorPalette.neutral[700],
			text: colorPalette.neutral[100],
			textSecondary: colorPalette.neutral[400],
			textMuted: colorPalette.neutral[500],
			success: colorPalette.status.success, // Same hex
			warning: colorPalette.status.warning, // Same hex
			info: colorPalette.status.info, // Same hex
			error: colorPalette.status.error, // Same hex
			divider: colorPalette.neutral[600],
			overlay: "rgba(0,0,0,0.7)",
			shadow: "rgba(0,0,0,0.5)", // Base shadow color
			tabBar: colorPalette.neutral[800],
			tabIconDefault: colorPalette.neutral[500],
			tabIconSelected: colorPalette.primary[500], // Match primary
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
		sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24, xxxl: 30 },
		weights: {
			regular: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800",
		} as const,
		lineHeights: { tight: 1.2, normal: 1.5, loose: 1.8 },
	},
	shadows: {
		light: {
			small: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.05,
				shadowRadius: 2,
				elevation: 1,
			},
			medium: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.07,
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
				shadowOpacity: 0.2,
				shadowRadius: 2,
				elevation: 1,
			},
			medium: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.3,
				shadowRadius: 4,
				elevation: 2,
			},
			large: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.4,
				shadowRadius: 8,
				elevation: 4,
			},
		},
	},
	platform: {
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

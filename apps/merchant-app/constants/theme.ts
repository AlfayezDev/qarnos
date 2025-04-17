import { Platform } from "react-native";
import { DefaultTheme } from "@react-navigation/native";
const colorPalette = {
	primary: {
		50: "#EBFFF9",
		100: "#C3FFF0",
		200: "#9BFFE6",
		300: "#5FF6D8",
		400: "#22E5C8",
		500: "#0AC5AB", // Primary brand color
		600: "#09A98F",
		700: "#07866F",
		800: "#056952",
		900: "#034C3A",
	},
	secondary: {
		50: "#F2EFFF",
		100: "#E4DFFF",
		200: "#CABFFF",
		300: "#A799FF",
		400: "#8E7AFF",
		500: "#7559FF", // Secondary accent
		600: "#6038FF",
		700: "#4E1AFF",
		800: "#3C00FB",
		900: "#2F00C2",
	},
	neutral: {
		0: "#FFFFFF",
		50: "#F9FAFB", // Lightest Background
		100: "#F1F5F9", // Light Background Alt / Card Alt
		200: "#E2E8F0", // Light Divider
		300: "#CBD5E1", // Light Text Muted (higher contrast)
		400: "#94A3B8", // Light Text Secondary / Icon Default
		500: "#64748B", // Dark Text Muted / Dark Icon Default
		600: "#475569", // Light Text Secondary (Darker) / Dark Text Secondary
		700: "#334155",
		800: "#1E293B", // Dark Card Alt / Dark Background Alt
		900: "#0F172A", // Light Text Primary / Dark Card
		950: "#0A0D14", // Darkest Background
		1000: "#000000",
	},
	semantic: {
		success: "#22C55E", // Keep consistent success green
		warning: "#FFBE0B", // Keep consistent warning yellow
		info: "#3B82F6", // Keep consistent info blue
		error: "#FF5E5B", // Keep consistent error red
	},
};
const getRgba = (hex: string, alpha: number) => {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export const theme = {
	colors: {
		light: {
			primary: colorPalette.primary[500],
			primaryDark: colorPalette.primary[600],
			primaryLight: getRgba(colorPalette.primary[500], 0.1), // Lighter shade for backgrounds
			secondary: colorPalette.secondary[500],
			secondaryLight: getRgba(colorPalette.secondary[500], 0.1),
			background: colorPalette.neutral[50],
			backgroundAlt: colorPalette.neutral[100],
			card: colorPalette.neutral[0],
			cardAlt: colorPalette.neutral[100],
			text: colorPalette.neutral[900],
			textSecondary: colorPalette.neutral[600],
			textMuted: colorPalette.neutral[400],
			success: colorPalette.semantic.success,
			warning: colorPalette.semantic.warning,
			info: colorPalette.semantic.info,
			error: colorPalette.semantic.error,
			divider: colorPalette.neutral[200],
			overlay: getRgba(colorPalette.neutral[950], 0.3),
			shadow: getRgba(colorPalette.neutral[900], 0.08), // Subtle shadow
			tabBar: colorPalette.neutral[0],
			tabIconDefault: colorPalette.neutral[400],
			tabIconSelected: colorPalette.primary[500],
		},
		dark: {
			primary: colorPalette.primary[400],
			primaryDark: colorPalette.primary[500],
			primaryLight: getRgba(colorPalette.primary[400], 0.15),
			secondary: colorPalette.secondary[400],
			secondaryLight: getRgba(colorPalette.secondary[400], 0.15),
			background: colorPalette.neutral[950], // Dark background
			backgroundAlt: colorPalette.neutral[800],
			card: colorPalette.neutral[900], // Darker card
			cardAlt: colorPalette.neutral[800],
			text: colorPalette.neutral[50],
			textSecondary: colorPalette.neutral[300], // Lighter secondary text for dark bg
			textMuted: colorPalette.neutral[500],
			success: colorPalette.semantic.success, // Use consistent semantic colors
			warning: colorPalette.semantic.warning,
			info: colorPalette.semantic.info,
			error: colorPalette.semantic.error,
			divider: getRgba(colorPalette.neutral[0], 0.1), // Subtle white divider
			overlay: getRgba(colorPalette.neutral[950], 0.6),
			shadow: getRgba(colorPalette.neutral[1000], 0.3), // Darker shadow
			tabBar: colorPalette.neutral[900],
			tabIconDefault: colorPalette.neutral[500],
			tabIconSelected: colorPalette.primary[400],
		},
	},
	spacing: {
		none: 0,
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
	} as const,
	radius: {
		none: 0,
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
	} as const,
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
		headerHeight: 56, // Example header height
		tabBarHeight: 49, // Standard tab bar height
		avatarSm: 32,
		avatarMd: 44,
		avatarLg: 64,
	} as const,
	typography: {
		sizes: {
			xs: 12,
			sm: 14,
			md: 16, // Base size
			lg: 18,
			xl: 20,
			xxl: 24,
			xxxl: 30,
		} as const,
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
		} as const,
	} as const,
	shadows: {
		// Consistent structure for light/dark if needed, but using color token now
		small: {
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.8, // Let color control intensity
			shadowRadius: 2,
			elevation: 2, // More pronounced elevation
		},
		medium: {
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.8,
			shadowRadius: 4,
			elevation: 4,
		},
		large: {
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.8,
			shadowRadius: 8,
			elevation: 8,
		},
	},
	platform: {
		topInset: Platform.OS === "ios" ? (DefaultTheme.dark ? 44 : 50) : 16, // Adjust based on actual device status bar
		bottomInset: Platform.OS === "ios" ? 34 : 16, // Standard safe area bottom
		isIOS: Platform.OS === "ios",
		isAndroid: Platform.OS === "android",
	},
};
export type ThemeColors = typeof theme.colors.light;
export type ThemeMode = "light" | "dark";

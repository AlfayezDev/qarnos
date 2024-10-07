// Base tokens
const tokens = {
	radius: {
		sm: 2,
		md: 4,
		lg: 8,
		full: 9999,
	} as const,
	sizes: {
		md: 38,
	} as const,
	space: {
		xxs: 4,
		xs: 8,
		sm: 12,
		md: 16,
		lg: 24,
		xl: 32,
		xxl: 48,
	} as const,
	fontSize: {
		xxs: 4,
		xs: 8,
		sm: 12,
		md: 16,
		lg: 24,
		xl: 32,
		xxl: 48,
	} as const,
	fontWeight: {
		thin: "100",
		extralight: "200",
		light: "300",
		normal: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
	} as const,
	leading: {
		tight: 1.25,
		normal: 1.5,
		relaxed: 1.75,
	} as const,
	tracking: {
		tighter: -0.8,
		tight: -0.4,
		normal: 0,
		wide: 0.4,
		wider: 0.8,
	} as const,
	shadows: {
		sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
		md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
		lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
		xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
	},
	opacity: {
		0: 0,
		25: 0.25,
		5: 0.5,
		75: 0.75,
		100: 1,
	} as const,
	breakpoints: {
		xs: 0,
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
		superLarge: 2000,
		tvLike: 4000,
	} as const,
};

// Light theme
export const lightTheme = {
	...tokens,
	colors: {
		background: "#ffffff",
		foreground: "#0c0c0d",
		card: "#ffffff",
		cardForeground: "#0c0c0d",
		popover: "#ffffff",
		popoverForeground: "#0c0c0d",
		primary: "#191919",
		primaryForeground: "#fafafa",
		secondary: "#f4f4f5",
		secondaryForeground: "#191919",
		muted: "#f4f4f5",
		mutedForeground: "#737373",
		accent: "#f4f4f5",
		accentForeground: "#191919",
		destructive: "#ef4444",
		destructiveForeground: "#fafafa",
		border: "#e5e5e5",
		input: "#e5e5e5",
		ring: "#191919",
	} as const,
};

// Dark theme
export const darkTheme = {
	...tokens,
	colors: {
		background: "#0c0c0d",
		foreground: "#fafafa",
		card: "#0c0c0d",
		cardForeground: "#fafafa",
		popover: "#0c0c0d",
		popoverForeground: "#fafafa",
		primary: "#fafafa",
		primaryForeground: "#191919",
		secondary: "#27272a",
		secondaryForeground: "#fafafa",
		muted: "#27272a",
		mutedForeground: "#a1a1aa",
		accent: "#27272a",
		accentForeground: "#fafafa",
		destructive: "#7f1d1d",
		destructiveForeground: "#fafafa",
		border: "#27272a",
		input: "#27272a",
		ring: "#d4d4d8",
	} as const,
};

// Export tokens for direct access if needed
export const {
	radius,
	space,
	fontSize,
	fontWeight,
	leading,
	tracking,
	shadows,
	opacity,
	breakpoints,
} = tokens;

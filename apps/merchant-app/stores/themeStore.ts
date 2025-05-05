import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { theme } from "@/constants/theme";
import { Appearance } from "react-native";

const storage = new MMKV();
export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
	mode: ThemeMode;
	setTheme: (mode: ThemeMode) => void;
}

const getSystemTheme = (): "light" | "dark" =>
	Appearance.getColorScheme() || "light";

export const useThemeStore = create<ThemeState>()((set) => {
	const savedMode = (storage.getString("theme") as ThemeMode) || "system";

	return {
		mode: savedMode,
		setTheme: (mode: ThemeMode) => {
			storage.set("theme", mode);
			set({ mode });

			if (mode !== "system") {
				Appearance.setColorScheme(mode === "dark" ? "dark" : "light");
			} else {
				Appearance.setColorScheme(null);
			}
		},
	};
});

// Updated hook to match existing useTheme pattern
export const useTheme = () => {
	const { mode } = useThemeStore();
	const systemColorScheme = getSystemTheme();

	const effectiveMode = mode === "system" ? systemColorScheme : mode;
	const isDark = effectiveMode === "dark";
	const navTheme = isDark ? DarkTheme : DefaultTheme;

	return {
		colors: theme.colors[effectiveMode],
		isDark,
		mode: effectiveMode,
		spacing: theme.spacing,
		radius: theme.radius,
		sizes: theme.sizes,
		typography: theme.typography,
		shadows: theme.shadows,
		platform: theme.platform,
		animations: theme.animations,
		navTheme: {
			...navTheme,
			colors: {
				...navTheme.colors,
				primary: theme.colors[effectiveMode].primary,
				background: theme.colors[effectiveMode].background,
				card: theme.colors[effectiveMode].card,
				text: theme.colors[effectiveMode].text,
				border: theme.colors[effectiveMode].divider,
				notification: theme.colors[effectiveMode].primary,
			} as const,
		} as const,
	} as const;
};

// Listen for system theme changes
Appearance.addChangeListener(() => {
	const currentMode = (storage.getString("theme") as ThemeMode) || "system";
	if (currentMode === "system") {
		// Force rerender components using useTheme
		useThemeStore.setState({});
	}
});

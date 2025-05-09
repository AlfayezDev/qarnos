import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/stores/themeStore";
import { ReanimatedScreenProvider } from "react-native-screens/reanimated";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { isDark, navTheme } = useTheme();

	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	// Handle font loading errors
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	// Hide splash screen when fonts loaded
	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	//Remove unused code

	if (!loaded) {
		return null;
	}

	return (
		<>
			<SafeAreaProvider>
				<ThemeProvider value={navTheme}>
					<ReanimatedScreenProvider>
						<Stack>
							<Stack.Screen
								name="(home)"
								options={{
									headerShown: false,
								}}
							/>
						</Stack>
					</ReanimatedScreenProvider>
				</ThemeProvider>
			</SafeAreaProvider>
			<StatusBar style={isDark ? "light" : "dark"} />
		</>
	);
}

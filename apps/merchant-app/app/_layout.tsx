import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
	"Sending `onAnimatedValueUpdate` with no listeners registered.",
]);
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	const { isDark, navTheme, colors } = useTheme();
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	useEffect(() => {
		if (error) throw error;
	}, [error]);
	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);
	if (!loaded) {
		return null;
	}
	return (
		<SafeAreaProvider>
			<ThemeProvider value={navTheme}>
				<Stack
					screenOptions={{
						headerShown: false, // Default to no header
						animation: "slide_from_right", // More native animation
						contentStyle: {
							backgroundColor: colors.background,
						},
					}}
				>
					<Stack.Screen name="index" />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style={isDark ? "light" : "dark"} />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}

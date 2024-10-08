import "@/theme/global.css";
import "expo-dev-client";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, useInitialAndroidBarSync } from "@/lib/useColorScheme";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "@/theme";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	useInitialAndroidBarSync();
	const { colorScheme, isDarkColorScheme } = useColorScheme();

	return (
		<>
			<StatusBar
				key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
				style={isDarkColorScheme ? "light" : "dark"}
			/>
			<KeyboardProvider statusBarTranslucent navigationBarTranslucent>
				<NavThemeProvider value={NAV_THEME[colorScheme]}>
					<Stack>
						<Stack.Screen
							name="index"
							options={{ headerShown: false }}
							redirect
						/>
						<Stack.Screen
							name="auth"
							options={{ headerShown: false }}
							redirect
						/>
						<Stack.Screen
							name="welcome-consent"
							options={{ headerShown: false }}
							redirect
						/>
						<Stack.Screen
							name="(settings)/settings"
							options={{ headerShown: false }}
						/>
					</Stack>
					<PortalHost />
				</NavThemeProvider>
			</KeyboardProvider>
		</>
	);
}

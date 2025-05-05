import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LogBox } from "react-native";
import { useTranslation } from "@/stores/translationStore";

LogBox.ignoreLogs([
	"Sending `onAnimatedValueUpdate` with no listeners registered.",
]);

export default function RootLayout() {
	const { isDark, navTheme, colors } = useTheme();
	const { t, translationCache } = useTranslation();

	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		translationCache;
		SplashScreen.preventAutoHideAsync();
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
				<Tabs
					screenOptions={{
						headerShown: false,
						tabBarActiveTintColor: colors.primary,
						tabBarInactiveTintColor: colors.textMuted,
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							title: t("common.dashboard"),
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="home-outline" size={size} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="meals"
						options={{
							title: t("common.meals"),
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="restaurant-outline" size={size} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="settings"
						options={{
							title: t("common.settings"),
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="settings-outline" size={size} color={color} />
							),
						}}
					/>
				</Tabs>
				<StatusBar style={isDark ? "light" : "dark"} />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}

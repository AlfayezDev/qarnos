import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";
import { useTranslation } from "@/stores/translationStore";
import { useTheme } from "@/stores/themeStore";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import {
	FloatingTabBarLayout,
	TabButton,
} from "@/components/navigation/FloatingTabBar";

// Ignore specific warnings
LogBox.ignoreLogs([
	"Sending `onAnimatedValueUpdate` with no listeners registered.",
]);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { isDark, navTheme, colors } = useTheme();
	const { t } = useTranslation();

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
					<Tabs asChild>
						<TabSlot style={{ backgroundColor: colors.background }} />
						<TabList asChild>
							<FloatingTabBarLayout>
								<TabTrigger name="home" href="/" asChild>
									<TabButton
										icon="home-outline"
										label={t("common.dashboard")}
										route="/"
									/>
								</TabTrigger>
								<TabTrigger name="menu" href="/meals" asChild>
									<TabButton
										icon="restaurant-outline"
										label={t("common.meals")}
										route="/meals"
									/>
								</TabTrigger>
								<TabTrigger name="settings" href="/settings" asChild>
									<TabButton
										icon="settings-outline"
										label={t("common.settings")}
										route="/settings"
									/>
								</TabTrigger>
							</FloatingTabBarLayout>
						</TabList>
					</Tabs>
				</ThemeProvider>
			</SafeAreaProvider>
			<StatusBar style={isDark ? "light" : "dark"} />
		</>
	);
}

import { Tabs } from "expo-router";
import React from "react";
import { Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSizes } from "@/constants/Spacing";
import { QarnTypography } from "@/constants/Typography";

export default function TabLayout(): React.ReactElement {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const colors = QarnColors[isDark ? "dark" : "light"];

	// Get device info to determine if it has a home indicator
	const { height } = Dimensions.get("window");
	const isIphoneWithNotch = Platform.OS === "ios" && height > 800;

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.tabIconDefault,
				headerShown: false,
				tabBarStyle: {
					backgroundColor: colors.tabBar,
					height: QarnSizes.tabBarHeight + (isIphoneWithNotch ? 20 : 0),
					paddingBottom:
						Platform.OS === "ios" ? (isIphoneWithNotch ? 36 : 24) : 8,
				},
				tabBarLabelStyle: {
					fontSize: QarnTypography.sizes.xs,
					fontWeight: QarnTypography.weights.medium,
					marginTop: 0,
				},
			}}
		>
			<Tabs.Screen
				name="(home)/index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<Ionicons name="home" size={QarnSizes.iconMd} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="meals"
				options={{
					title: "Meal Plans",
					tabBarIcon: ({ color }) => (
						<Ionicons name="restaurant" size={QarnSizes.iconMd} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<Ionicons name="person" size={QarnSizes.iconMd} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}

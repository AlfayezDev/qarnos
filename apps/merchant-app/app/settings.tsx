import React, { useCallback } from "react";
import {
	TouchableOpacity,
	View,
	StyleSheet,
	Appearance,
	ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { Text, Box, AnimatedBox } from "@/components/ui";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SafeAreaView } from "react-native-safe-area-context";
import { FadeInUp } from "react-native-reanimated";

export default function SettingsScreen() {
	const theme = useTheme();
	const { t, isRTL } = useTranslation();

	const handleBack = () => {
		router.back();
	};

	const handleThemeChange = useCallback((newTheme: "light" | "dark") => {
		Appearance.setColorScheme(newTheme);
		console.log("Theme changed to:", newTheme);
	}, []);

	const getThemeOptionStyle = (option: "light" | "dark") => {
		const isSelected = theme.mode === option;
		return {
			flex: 1,
			marginHorizontal: theme.spacing.xs,
			paddingVertical: theme.spacing.sm,
			paddingHorizontal: theme.spacing.sm,
			borderRadius: theme.radius.md,
			borderWidth: 1.5,
			borderColor: isSelected ? theme.colors.primary : theme.colors.divider,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: isSelected
				? theme.colors.primaryLight
				: theme.colors.backgroundAlt,
			opacity: isSelected ? 1 : 0.8,
			minHeight: theme.sizes.buttonLg + theme.spacing.md,
		};
	};

	const getThemeIconColor = (option: "light" | "dark") => {
		const isSelected = theme.mode === option;
		return isSelected ? theme.colors.primary : theme.colors.textSecondary;
	};
	const getThemeTextColor = (option: "light" | "dark") => {
		const isSelected = theme.mode === option;
		return isSelected ? theme.colors.primary : theme.colors.textSecondary;
	};

	const themeOptions = [
		{ key: "light", icon: "sunny-outline", label: t("settings.lightMode") },
		{ key: "dark", icon: "moon-outline", label: t("settings.darkMode") },
	] as const;

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
			}}
		>
			<Stack.Screen options={{ headerShown: false }} />

			<Box
				row
				alignItems="center"
				paddingHorizontal="md"
				paddingVertical="sm"
				style={{
					borderBottomWidth: StyleSheet.hairlineWidth,
					borderBottomColor: theme.colors.divider,
					height: theme.sizes.headerHeight,
				}}
			>
				<View
					style={{ width: theme.sizes.touchTarget, alignItems: "flex-start" }}
				>
					<TouchableOpacity
						onPress={handleBack}
						style={{
							width: theme.sizes.touchTarget,
							height: theme.sizes.touchTarget,
							borderRadius: theme.radius.round,
							alignItems: "center",
							justifyContent: "center",
						}}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					>
						<Ionicons
							name={isRTL ? "chevron-forward" : "chevron-back"}
							size={theme.sizes.iconMd}
							color={theme.colors.text}
						/>
					</TouchableOpacity>
				</View>

				<Text
					variant="xl"
					weight="semibold"
					style={{
						flex: 1,
						textAlign: "center",
					}}
					numberOfLines={1}
				>
					{t("common.settings")}
				</Text>

				<View style={{ width: theme.sizes.touchTarget }} />
			</Box>

			<ScrollView
				contentContainerStyle={{
					padding: theme.spacing.md,
					paddingBottom: theme.spacing.xl,
				}}
				showsVerticalScrollIndicator={false}
			>
				<AnimatedBox
					entering={FadeInUp.delay(100).duration(400).springify().damping(15)}
					padding="md"
					marginBottom="lg"
					elevation="small"
					bg="card"
					rounded="lg"
				>
					<LanguageSelector />
				</AnimatedBox>

				<AnimatedBox
					entering={FadeInUp.delay(200).duration(400).springify().damping(15)}
					padding="md"
					marginBottom="lg"
					elevation="small"
					bg="card"
					rounded="lg"
				>
					<Text align="auto" variant="md" weight="semibold" marginBottom="md">
						{t("settings.theme")}
					</Text>

					<View
						style={{
							flexDirection: "row",
							marginHorizontal: -theme.spacing.xs,
						}}
					>
						{themeOptions.map((option) => (
							<TouchableOpacity
								key={option.key}
								style={getThemeOptionStyle(option.key)}
								onPress={() => handleThemeChange(option.key)}
								accessible={true}
								accessibilityRole="button"
								accessibilityLabel={`Set theme to ${option.label}`}
								accessibilityState={{ selected: theme.mode === option.key }}
							>
								<Ionicons
									name={option.icon as any}
									size={theme.sizes.iconMd}
									color={getThemeIconColor(option.key)}
									style={{ marginBottom: theme.spacing.xs }}
								/>
								<Text
									variant="sm"
									weight="medium"
									color={getThemeTextColor(option.key)}
								>
									{option.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</AnimatedBox>

				<AnimatedBox
					entering={FadeInUp.delay(300).duration(400).springify().damping(15)}
					padding={"md"}
					alignItems="center"
					justifyContent="space-between"
					row
					elevation="small"
					bg="card"
					rounded="lg"
				>
					<Text variant="md" weight="semibold">
						{t("common.version")}
					</Text>
					<Text variant="sm" color="textSecondary">
						v1.0.0
					</Text>
				</AnimatedBox>
			</ScrollView>
		</SafeAreaView>
	);
}

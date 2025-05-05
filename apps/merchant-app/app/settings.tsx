import React, { useCallback } from "react";
import {
	Appearance,
	Pressable,
	ScrollView,
	TouchableOpacity,
	View,
} from "react-native";
import { Stack } from "expo-router";
import Animated, {
	FadeInUp,
	FadeOutDown,
	LinearTransition,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AnimatedBox, Avatar, Box, Text } from "@/components/ui";

import { useMemoizedCallback } from "@/hooks/useMemoizedCallback";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SettingsScreen = React.memo(() => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();
	const restaurantName = "The Gourmet Spot";

	const handleThemeChange = useMemoizedCallback(
		(newTheme: "light" | "dark") => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			Appearance.setColorScheme(newTheme);
			console.log("Theme changed to:", newTheme);
		},
		[],
	);

	const ThemeOption = React.memo(
		({
			option,
		}: {
			option: { key: "light" | "dark"; icon: string; label: string };
		}) => {
			const theme = useTheme();
			const isSelected = theme.mode === option.key;

			const animatedStyle = useAnimatedStyle(() => ({
				backgroundColor: withTiming(
					isSelected ? theme.colors.primaryLight : theme.colors.backgroundAlt,
					{ duration: 200 },
				),
				borderColor: withTiming(
					isSelected ? theme.colors.primary : theme.colors.divider,
					{ duration: 200 },
				),
				transform: [
					{ scale: withTiming(isSelected ? 1.0 : 0.98, { duration: 150 }) },
				],
				opacity: withTiming(isSelected ? 1 : 0.8, { duration: 200 }),
			}));

			const iconColor = isSelected
				? theme.colors.primary
				: theme.colors.textSecondary;
			const textColor = isSelected
				? theme.colors.primary
				: theme.colors.textSecondary;

			return (
				<AnimatedPressable
					key={option.key}
					style={[
						{
							flex: 1,
							marginHorizontal: theme.spacing.xs,
							paddingVertical: theme.spacing.md,
							paddingHorizontal: theme.spacing.sm,
							borderRadius: theme.radius.lg,
							borderWidth: 2,
							alignItems: "center",
							justifyContent: "center",
							minHeight: theme.sizes.buttonLg * 1.8,
						},
						animatedStyle,
					]}
					onPress={() => handleThemeChange(option.key)}
					accessible={true}
					accessibilityRole="button"
					accessibilityLabel={`Set theme to ${option.label}`}
					accessibilityState={{ selected: isSelected }}
				>
					<Ionicons
						name={option.icon as any}
						size={theme.sizes.iconLg}
						color={iconColor}
						style={{ marginBottom: theme.spacing.sm }}
					/>
					<Text variant="sm" weight="semibold" color={textColor}>
						{option.label}
					</Text>
				</AnimatedPressable>
			);
		},
	);

	const themeOptions = [
		{ key: "light", icon: "sunny-outline", label: t("settings.lightMode") },
		{ key: "dark", icon: "moon-outline", label: t("settings.darkMode") },
	] as const;

	const SettingsSection = useCallback(
		({
			title,
			icon,
			children,
		}: {
			title: string;
			icon: any;
			children: React.ReactNode;
		}) => (
			<AnimatedBox
				entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
					.duration(theme.animations.duration.extraSlow)
					.springify()
					.damping(theme.animations.spring.damping.light)}
				exiting={FadeOutDown.duration(theme.animations.duration.medium)}
				layout={LinearTransition.duration(300)}
				padding="lg"
				marginBottom="lg"
				bg="card"
				rounded="xl"
				style={{
					borderWidth: 1,
					borderColor: theme.colors.divider,
				}}
			>
				<Box row alignCenter marginBottom="md">
					<Ionicons
						name={icon}
						size={theme.sizes.iconSm}
						color={theme.colors.primary}
						style={{ marginEnd: theme.spacing.sm }}
					/>
					<Text variant="lg" weight="semibold" color="textSecondary">
						{title}
					</Text>
				</Box>
				{children}
			</AnimatedBox>
		),
		[theme],
	);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<Stack.Screen options={{ headerShown: false }} />
			<Box
				row
				alignItems="center"
				paddingHorizontal="md"
				paddingVertical="sm"
				style={{
					height: theme.sizes.headerHeight,
				}}
			>
				<Text variant="xl" weight="semibold" numberOfLines={1}>
					{t("common.settings")}
				</Text>
			</Box>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: theme.spacing.md,
					paddingBottom: theme.spacing.md,
				}}
				showsVerticalScrollIndicator={false}
			>
				<AnimatedBox
					entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
						.duration(theme.animations.duration.extraSlow)
						.springify()
						.damping(theme.animations.spring.damping.light)}
					exiting={FadeOutDown.duration(theme.animations.duration.medium)}
					row
					alignCenter
					bg="card"
					padding="md"
					rounded="xl"
					marginBottom="lg"
					style={{ borderWidth: 1, borderColor: theme.colors.divider }}
				>
					<Avatar
						text={restaurantName.charAt(0)}
						size="md"
						style={{ marginEnd: theme.spacing.md }}
					/>
					<Box alignItems="flex-start" flex={1}>
						<Text variant="sm" color="textSecondary">
							{t("settings.signedInAs") ?? "Signed in as"}
						</Text>
						<Text variant="lg" weight="semibold" numberOfLines={1}>
							{restaurantName}
						</Text>
					</Box>
					<Ionicons
						name="person-circle-outline"
						size={theme.sizes.iconLg}
						color={theme.colors.textMuted}
					/>
				</AnimatedBox>

				<SettingsSection title={t("settings.language")} icon="language-outline">
					<LanguageSelector />
				</SettingsSection>

				<SettingsSection
					title={t("settings.theme")}
					icon="color-palette-outline"
				>
					<View
						style={{
							flexDirection: "row",
							marginHorizontal: -theme.spacing.xs,
						}}
					>
						{themeOptions.map((option) => (
							<ThemeOption key={option.key} option={option} />
						))}
					</View>
				</SettingsSection>

				<SettingsSection
					title={t("settings.appInfo")}
					icon="information-circle-outline"
				>
					<Box row justifyContent="space-between" alignItems="center">
						<Text variant="md" weight="medium" color="textSecondary">
							{t("common.version")}
						</Text>
						<Text variant="md" weight="medium" color="textMuted">
							v1.0.0
						</Text>
					</Box>
				</SettingsSection>

				<AnimatedBox
					entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
						.duration(theme.animations.duration.extraSlow)
						.springify()
						.damping(theme.animations.spring.damping.light)}
					exiting={FadeOutDown.duration(theme.animations.duration.medium)}
				>
					<TouchableOpacity
						style={{
							marginTop: theme.spacing.lg,
							padding: theme.spacing.md,
							borderRadius: theme.radius.lg,
							backgroundColor: theme.colors.cardAlt,
							borderWidth: 1,
							borderColor: theme.colors.error,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
						onPress={() => {
							Haptics.notificationAsync(
								Haptics.NotificationFeedbackType.Warning,
							);
							console.log("Logout Pressed");
						}}
					>
						<Ionicons
							name="log-out-outline"
							size={theme.sizes.iconMd}
							color={theme.colors.error}
							style={{ marginEnd: theme.spacing.sm }}
						/>
						<Text variant="md" weight="semibold" color="error">
							{t("settings.logout")}
						</Text>
					</TouchableOpacity>
				</AnimatedBox>
			</ScrollView>
		</View>
	);
});

export default SettingsScreen;

import React, { useCallback } from "react";
import {
	TouchableOpacity,
	View,
	Appearance,
	ScrollView,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { Text, Box, AnimatedBox, Avatar } from "@/components/ui";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import Animated, {
	FadeInUp,
	useAnimatedStyle,
	withTiming,
	LinearTransition,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SettingsScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t, isRTL } = useTranslation();

	const restaurantName = "The Gourmet Spot";

	const handleBack = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.back();
	};

	const handleThemeChange = useCallback((newTheme: "light" | "dark") => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		Appearance.setColorScheme(newTheme);
		console.log("Theme changed to:", newTheme);
	}, []);

	const ThemeOption = ({
		option,
	}: { option: { key: "light" | "dark"; icon: string; label: string } }) => {
		const isSelected = theme.mode === option.key;

		const animatedStyle = useAnimatedStyle(() => {
			return {
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
			};
		});

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
						alignItems: "center" as const,
						justifyContent: "center" as const,
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
	};

	const themeOptions = [
		{ key: "light", icon: "sunny-outline", label: t("settings.lightMode") },
		{ key: "dark", icon: "moon-outline", label: t("settings.darkMode") },
	] as const;

	const SettingsSection = ({
		title,
		icon,
		children,
		delay,
	}: {
		title: string;
		icon: any;
		children: React.ReactNode;
		delay: number;
	}) => (
		<AnimatedBox
			entering={FadeInUp.delay(delay).duration(500).springify().damping(18)}
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
				<Box width={theme.sizes.touchTarget * 1.5} alignItems="flex-start">
					<TouchableOpacity
						onPress={handleBack}
						style={{
							width: theme.sizes.buttonMd,
							height: theme.sizes.buttonMd,
							borderRadius: theme.radius.md,
							backgroundColor: theme.colors.backgroundAlt,
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
				</Box>

				<Text
					variant="xl"
					weight="semibold"
					style={{ flex: 1, textAlign: "center" }}
					numberOfLines={1}
				>
					{t("common.settings")}
				</Text>

				<Box width={theme.sizes.touchTarget * 1.5} />
			</Box>

			<ScrollView
				contentContainerStyle={{
					padding: theme.spacing.md,
					paddingTop: theme.spacing.sm,
					paddingBottom: theme.spacing.xl,
				}}
				showsVerticalScrollIndicator={false}
			>
				<AnimatedBox
					entering={FadeInUp.delay(100).duration(500).springify().damping(18)}
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

				<SettingsSection
					title={t("settings.language")}
					icon="language-outline"
					delay={200}
				>
					<LanguageSelector />
				</SettingsSection>

				<SettingsSection
					title={t("settings.theme")}
					icon="color-palette-outline"
					delay={300}
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
					delay={400}
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
					entering={FadeInUp.delay(500).duration(500).springify().damping(18)}
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
}

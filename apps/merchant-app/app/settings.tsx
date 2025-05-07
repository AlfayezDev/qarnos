import React, { useCallback, useMemo } from "react";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { Stack } from "expo-router";
import Animated, {
	useAnimatedRef,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AnimatedText, Avatar, Box, Text } from "@/components/ui";
import { useTheme, useThemeStore } from "@/stores/themeStore";
import { useTranslation } from "@/stores/translationStore";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SettingsScreen = () => {
	const theme = useTheme();
	const { setTheme, mode } = useThemeStore();
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();
	const restaurantName = "The Gourmet Spot";

	const handleThemeChange = useCallback(
		(newTheme: "light" | "dark") => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			setTheme(newTheme);
		},
		[setTheme],
	);

	const themeOptions = useMemo(
		() => [
			{
				key: "light" as const,
				icon: "sunny-outline",
				label: t("settings.lightMode"),
			},
			{
				key: "dark" as const,
				icon: "moon-outline",
				label: t("settings.darkMode"),
			},
		],
		[t],
	);

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
			<Box
				padding="lg"
				marginBottom="lg"
				bg="card"
				rounded="xs"
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
			</Box>
		),
		[theme],
	);

	const scrollRef = useAnimatedRef<Animated.ScrollView>();

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<Animated.ScrollView
				ref={scrollRef}
				contentContainerStyle={{
					paddingBottom: insets.bottom + theme.spacing.xxl * 1.5,
					paddingTop: insets.top,
					paddingHorizontal: theme.spacing.xs,
					backgroundColor: theme.colors.background,
					gap: theme.spacing.xs,
				}}
				showsVerticalScrollIndicator={false}
			>
				<ScrollView
					contentContainerStyle={{
						paddingHorizontal: theme.spacing.md,
						paddingBottom: theme.spacing.md,
					}}
					showsVerticalScrollIndicator={false}
				>
					<Box
						row
						alignCenter
						bg="card"
						padding="md"
						rounded="xs"
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
					</Box>

					<SettingsSection
						title={t("settings.language")}
						icon="language-outline"
					>
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
								<ThemeOption
									key={option.key}
									option={option}
									currentTheme={mode}
									onPress={handleThemeChange}
								/>
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

					<Box>
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
								gap: theme.spacing.sm,
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
							/>
							<Text variant="md" weight="semibold" color="error">
								{t("settings.logout")}
							</Text>
						</TouchableOpacity>
					</Box>
				</ScrollView>
			</Animated.ScrollView>
		</>
	);
};

interface ThemeOptionProps {
	option: {
		key: "light" | "dark";
		icon: string;
		label: string;
	};
	currentTheme: string;
	onPress: (theme: "light" | "dark") => void;
}

const ThemeOption = React.memo(
	({ option, currentTheme, onPress }: ThemeOptionProps) => {
		const theme = useTheme();
		const isSelected = currentTheme === option.key;

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

		const animatedTextColor = useAnimatedStyle(() => ({
			color: withTiming(
				isSelected ? theme.colors.primary : theme.colors.textSecondary,
			),
		}));

		const handlePress = useCallback(() => {
			onPress(option.key);
		}, [option.key, onPress]);

		return (
			<AnimatedPressable
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
				onPress={handlePress}
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
				<AnimatedText variant="sm" weight="semibold" style={animatedTextColor}>
					{option.label}
				</AnimatedText>
			</AnimatedPressable>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.option.key === nextProps.option.key &&
			prevProps.currentTheme === nextProps.currentTheme &&
			prevProps.option.label === nextProps.option.label
		);
	},
);

export default SettingsScreen;

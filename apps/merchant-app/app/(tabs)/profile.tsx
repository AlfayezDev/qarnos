import React, { useState, useRef, useEffect } from "react";
import { Switch, Animated, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "@/hooks/useTheme";
import { Box, Text, Badge } from "@/components/ui";

interface ProfileSetting {
	id: string;
	title: string;
	subtitle?: string;
	icon: string;
	rightElement?: "arrow" | "switch" | "badge";
	badgeText?: string;
	switchValue?: boolean;
	onPress: () => void;
	onToggle?: (value: boolean) => void;
}

interface ProfileSection {
	title: string;
	data: ProfileSetting[];
}

const ProfileScreen: React.FC = () => {
	const theme = useTheme();

	// Profile data
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [darkModeEnabled, setDarkModeEnabled] = useState(theme.isDark);

	// Animation values
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scrollY = useRef(new Animated.Value(0)).current;
	const headerTranslate = scrollY.interpolate({
		inputRange: [0, 100],
		outputRange: [0, -25],
		extrapolate: "clamp",
	});

	// Run animations when component mounts
	useEffect(() => {
		animateElements();
	}, []);

	// Reset animations when tab is focused
	useFocusEffect(
		React.useCallback(() => {
			animateElements();
			return () => {};
		}, []),
	);

	const animateElements = () => {
		// Reset animation values
		fadeAnim.setValue(0);

		// Animate content fade in
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 600,
			useNativeDriver: true,
		}).start();
	};

	// Handle scroll events for header parallax
	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { y: scrollY } } }],
		{ useNativeDriver: true },
	);

	// Sample profile sections
	const profileSections: ProfileSection[] = [
		{
			title: "Account",
			data: [
				{
					id: "personal-info",
					title: "Personal Information",
					icon: "person-outline",
					rightElement: "arrow",
					onPress: () => console.log("Personal info pressed"),
				},
				{
					id: "restaurants",
					title: "My Restaurants",
					subtitle: "Manage your restaurant profiles",
					icon: "restaurant-outline",
					rightElement: "badge",
					badgeText: "2",
					onPress: () => console.log("Restaurants pressed"),
				},
				{
					id: "payment",
					title: "Payment Methods",
					icon: "card-outline",
					rightElement: "arrow",
					onPress: () => console.log("Payment methods pressed"),
				},
			],
		},
		{
			title: "Preferences",
			data: [
				{
					id: "notifications",
					title: "Notifications",
					icon: "notifications-outline",
					rightElement: "switch",
					switchValue: notificationsEnabled,
					onPress: () => console.log("Notifications pressed"),
					onToggle: (value) => setNotificationsEnabled(value),
				},
				{
					id: "dark-mode",
					title: "Dark Mode",
					icon: "moon-outline",
					rightElement: "switch",
					switchValue: darkModeEnabled,
					onPress: () => console.log("Dark mode pressed"),
					onToggle: (value) => setDarkModeEnabled(value),
				},
				{
					id: "language",
					title: "Language",
					subtitle: "English (US)",
					icon: "language-outline",
					rightElement: "arrow",
					onPress: () => console.log("Language pressed"),
				},
			],
		},
		{
			title: "Support",
			data: [
				{
					id: "help",
					title: "Help Center",
					icon: "help-circle-outline",
					rightElement: "arrow",
					onPress: () => console.log("Help pressed"),
				},
				{
					id: "contact",
					title: "Contact Support",
					icon: "mail-outline",
					rightElement: "arrow",
					onPress: () => console.log("Contact pressed"),
				},
				{
					id: "feedback",
					title: "Give Feedback",
					icon: "chatbubble-outline",
					rightElement: "arrow",
					onPress: () => console.log("Feedback pressed"),
				},
			],
		},
		{
			title: "",
			data: [
				{
					id: "logout",
					title: "Log Out",
					icon: "log-out-outline",
					onPress: () => console.log("Logout pressed"),
				},
			],
		},
	];

	// Profile Header Component with parallax effect
	const ProfileHeader = () => {
		const scaleAnim = scrollY.interpolate({
			inputRange: [-100, 0, 100],
			outputRange: [1.2, 1, 0.9],
			extrapolate: "clamp",
		});

		const opacityAnim = scrollY.interpolate({
			inputRange: [0, 60, 120],
			outputRange: [1, 0.8, 0.6],
			extrapolate: "clamp",
		});

		return (
			<Animated.View
				style={{
					backgroundColor: theme.colors.primary,
					paddingTop: theme.platform.topInset,
					paddingBottom: theme.spacing.xl,
					alignItems: "center",
					transform: [{ translateY: headerTranslate }],
					opacity: opacityAnim,
				}}
			>
				{/* Avatar - scales on pull down */}
				<Animated.View
					style={{
						transform: [{ scale: scaleAnim }],
						width: theme.sizes.avatarLg + 20,
						height: theme.sizes.avatarLg + 20,
						borderRadius: (theme.sizes.avatarLg + 20) / 2,
						backgroundColor: "rgba(255,255,255,0.2)",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: theme.spacing.md,
					}}
				>
					<Text
						color="white"
						style={{
							fontSize: theme.typography.sizes.xxxl,
							fontWeight: theme.typography.weights.bold,
						}}
					>
						G
					</Text>
				</Animated.View>

				{/* Name and Email */}
				<Text variant="xl" weight="bold" color="white" marginBottom="xs">
					Green Kitchen
				</Text>

				<Text variant="md" color="rgba(255,255,255,0.8)">
					contact@greenkitchen.com
				</Text>

				{/* Edit Profile Button */}
				<Pressable
					style={({ pressed }) => ({
						flexDirection: "row",
						backgroundColor: "rgba(255,255,255,0.2)",
						paddingHorizontal: theme.spacing.md,
						paddingVertical: theme.spacing.sm,
						borderRadius: theme.radius.round,
						alignItems: "center",
						marginTop: theme.spacing.md,
						opacity: pressed ? 0.8 : 1,
					})}
					onPress={() => console.log("Edit profile")}
					android_ripple={{ color: "rgba(255,255,255,0.2)" }}
				>
					<Ionicons name="pencil" size={theme.sizes.iconSm} color="white" />
					<Text color="white" weight="medium" marginLeft="xs">
						Edit Profile
					</Text>
				</Pressable>
			</Animated.View>
		);
	};

	// Setting Item Component with animation
	const SettingItem = ({
		item,
	}: {
		item: ProfileSetting;
	}) => {
		const isLogout = item.id === "logout";

		const itemTranslateY = fadeAnim.interpolate({
			inputRange: [0, 1],
			outputRange: [30, 0],
		});

		const renderRightElement = () => {
			switch (item.rightElement) {
				case "arrow":
					return (
						<Ionicons
							name="chevron-forward"
							size={theme.sizes.iconMd}
							color={theme.colors.textSecondary}
						/>
					);
				case "switch":
					return (
						<Switch
							value={item.switchValue}
							onValueChange={(value) => item.onToggle?.(value)}
							trackColor={{
								false: theme.colors.cardAlt,
								true: theme.colors.primary,
							}}
							thumbColor="white"
						/>
					);
				case "badge":
					return <Badge text={item.badgeText || ""} variant="primary" />;
				default:
					return null;
			}
		};

		return (
			<Animated.View
				style={{
					opacity: fadeAnim,
					transform: [{ translateY: itemTranslateY }],
				}}
			>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: theme.colors.card,
							paddingVertical: theme.spacing.md,
							paddingHorizontal: theme.spacing.md,
							marginBottom: 1,
							borderRadius: isLogout ? theme.radius.md : undefined,
							opacity: pressed ? 0.9 : 1,
						},
						theme.shadows.small,
					]}
					onPress={item.onPress}
					android_ripple={{
						color: isLogout ? `${theme.colors.error}20` : theme.colors.cardAlt,
					}}
				>
					<Box row alignCenter>
						<Box
							width={theme.sizes.avatarSm}
							height={theme.sizes.avatarSm}
							rounded="round"
							bg={isLogout ? `${theme.colors.error}20` : "primaryLight"}
							center
							marginRight="md"
						>
							<Ionicons
								name={item.icon as any}
								size={theme.sizes.iconSm}
								color={isLogout ? theme.colors.error : theme.colors.primary}
							/>
						</Box>

						<Box flex={1}>
							<Text
								variant="md"
								weight={isLogout ? "semibold" : "medium"}
								color={isLogout ? "error" : "text"}
							>
								{item.title}
							</Text>

							{item.subtitle && (
								<Text variant="sm" color="textSecondary" marginTop={2}>
									{item.subtitle}
								</Text>
							)}
						</Box>

						{renderRightElement()}
					</Box>
				</Pressable>
			</Animated.View>
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<ProfileHeader />

			<Animated.ScrollView
				style={{
					marginTop: -theme.radius.xl,
					borderTopLeftRadius: theme.radius.xl,
					borderTopRightRadius: theme.radius.xl,
					backgroundColor: theme.colors.background,
					paddingTop: theme.spacing.md,
				}}
				contentContainerStyle={{
					paddingBottom: theme.spacing.xl + 20,
					paddingHorizontal: theme.spacing.md,
				}}
				showsVerticalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				bounces={true}
			>
				{profileSections.map((section, sectionIndex) => (
					<Animated.View
						key={sectionIndex.toString()}
						style={{
							marginBottom: theme.spacing.lg,
							opacity: fadeAnim,
							transform: [
								{
									translateY: fadeAnim.interpolate({
										inputRange: [0, 1],
										outputRange: [20, 0],
									}),
								},
							],
						}}
					>
						{section.title && (
							<Text
								variant="md"
								weight="semibold"
								marginBottom="sm"
								marginLeft="xs"
							>
								{section.title}
							</Text>
						)}

						<Box
							style={{
								borderRadius: theme.radius.md,
								overflow: "hidden",
							}}
						>
							{section.data.map((item) => (
								<SettingItem key={item.id} item={item} />
							))}
						</Box>
					</Animated.View>
				))}

				{/* App Version */}
				<Animated.View
					style={{
						opacity: fadeAnim,
						transform: [
							{
								translateY: fadeAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [10, 0],
								}),
							},
						],
					}}
				>
					<Text variant="sm" color="textSecondary" center marginTop="md">
						Version 1.0.0
					</Text>
				</Animated.View>
			</Animated.ScrollView>
		</View>
	);
};

export default ProfileScreen;

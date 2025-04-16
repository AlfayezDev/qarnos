import { QarnColors } from "@/constants/Colors";
import { QarnRadius, QarnSizes, QarnSpacing } from "@/constants/Spacing";
import { QarnShadows, QarnTypography } from "@/constants/Typography";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "expo-router/build/views/Screen";
import React, { useState } from "react";
import {
	Platform,
	ScrollView,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

// Define types for our profile data
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
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];

	// Profile data
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);

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

	const renderRightElement = (item: ProfileSetting) => {
		switch (item.rightElement) {
			case "arrow":
				return (
					<Ionicons
						name="chevron-forward"
						size={QarnSizes.iconMd}
						color={tokens.textSecondary}
					/>
				);
			case "switch":
				return (
					<Switch
						value={item.switchValue}
						onValueChange={(value) => item.onToggle?.(value)}
						trackColor={{ false: tokens.cardAlt, true: tokens.primary }}
						thumbColor="white"
					/>
				);
			case "badge":
				return (
					<View
						style={{
							backgroundColor: tokens.primary,
							paddingHorizontal: QarnSpacing.sm,
							paddingVertical: QarnSpacing.xs / 2,
							borderRadius: QarnRadius.round,
							minWidth: 24,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: "white",
								fontSize: QarnTypography.sizes.xs,
								fontWeight: QarnTypography.weights.medium,
							}}
						>
							{item.badgeText}
						</Text>
					</View>
				);
			default:
				return null;
		}
	};

	const renderProfileItem = (item: ProfileSetting) => {
		const isLogout = item.id === "logout";

		return (
			<TouchableOpacity
				key={item.id}
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: tokens.card,
					paddingVertical: QarnSpacing.md,
					paddingHorizontal: QarnSpacing.md,
					marginBottom: 1,
					borderRadius: item.id === "logout" ? QarnRadius.md : undefined,
					...shadows.small,
				}}
				onPress={item.onPress}
				activeOpacity={0.7}
			>
				<View
					style={{
						width: QarnSizes.avatarSm,
						height: QarnSizes.avatarSm,
						borderRadius: QarnSizes.avatarSm / 2,
						backgroundColor: isLogout
							? `${tokens.error}20`
							: tokens.primaryLight,
						alignItems: "center",
						justifyContent: "center",
						marginRight: QarnSpacing.md,
					}}
				>
					<Ionicons
						name={item.icon as any}
						size={QarnSizes.iconSm}
						color={isLogout ? tokens.error : tokens.primary}
					/>
				</View>

				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontSize: QarnTypography.sizes.md,
							fontWeight: isLogout
								? QarnTypography.weights.semibold
								: QarnTypography.weights.medium,
							color: isLogout ? tokens.error : tokens.text,
						}}
					>
						{item.title}
					</Text>

					{item.subtitle && (
						<Text
							style={{
								fontSize: QarnTypography.sizes.sm,
								color: tokens.textSecondary,
								marginTop: 2,
							}}
						>
							{item.subtitle}
						</Text>
					)}
				</View>

				{renderRightElement(item)}
			</TouchableOpacity>
		);
	};

	return (
		<>
			<Screen options={{ headerShown: false }} />
			<View
				style={{
					flex: 1,
					backgroundColor: tokens.background,
				}}
			>
				{/* Profile Header */}
				<View
					style={{
						backgroundColor: tokens.primary,
						paddingTop: Platform.OS === "ios" ? 60 : 30,
						paddingBottom: QarnSpacing.xl,
						alignItems: "center",
					}}
				>
					{/* Avatar */}
					<View
						style={{
							width: QarnSizes.avatarLg + 20,
							height: QarnSizes.avatarLg + 20,
							borderRadius: (QarnSizes.avatarLg + 20) / 2,
							backgroundColor: "rgba(255,255,255,0.2)",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: QarnSpacing.md,
						}}
					>
						<Text
							style={{
								color: "white",
								fontSize: QarnTypography.sizes.xxxl,
								fontWeight: QarnTypography.weights.bold,
							}}
						>
							G
						</Text>
					</View>

					{/* Name and Email */}
					<Text
						style={{
							fontSize: QarnTypography.sizes.xl,
							fontWeight: QarnTypography.weights.bold,
							color: "white",
							marginBottom: QarnSpacing.xs,
						}}
					>
						Green Kitchen
					</Text>

					<Text
						style={{
							fontSize: QarnTypography.sizes.md,
							color: "rgba(255,255,255,0.8)",
						}}
					>
						contact@greenkitchen.com
					</Text>

					{/* Edit Profile Button */}
					<TouchableOpacity
						style={{
							flexDirection: "row",
							backgroundColor: "rgba(255,255,255,0.2)",
							paddingHorizontal: QarnSpacing.md,
							paddingVertical: QarnSpacing.sm,
							borderRadius: QarnRadius.round,
							alignItems: "center",
							marginTop: QarnSpacing.md,
						}}
						onPress={() => console.log("Edit profile")}
					>
						<Ionicons name="pencil" size={QarnSizes.iconSm} color="white" />
						<Text
							style={{
								color: "white",
								marginLeft: QarnSpacing.xs,
								fontWeight: QarnTypography.weights.medium,
							}}
						>
							Edit Profile
						</Text>
					</TouchableOpacity>
				</View>

				{/* Profile Content */}
				<ScrollView
					style={{
						flex: 1,
						marginTop: -QarnRadius.xl,
						borderTopLeftRadius: QarnRadius.xl,
						borderTopRightRadius: QarnRadius.xl,
						backgroundColor: tokens.background,
						paddingTop: QarnSpacing.md,
					}}
					contentContainerStyle={{
						paddingBottom: QarnSpacing.xl,
						paddingHorizontal: QarnSpacing.md,
					}}
					showsVerticalScrollIndicator={false}
				>
					{profileSections.map((section, index) => (
						<View
							key={index.toString()}
							style={{ marginBottom: QarnSpacing.lg }}
						>
							{section.title && (
								<Text
									style={{
										fontSize: QarnTypography.sizes.md,
										fontWeight: QarnTypography.weights.semibold,
										color: tokens.text,
										marginBottom: QarnSpacing.sm,
										marginLeft: QarnSpacing.xs,
									}}
								>
									{section.title}
								</Text>
							)}

							<View
								style={{
									borderRadius: QarnRadius.md,
									overflow: "hidden",
								}}
							>
								{section.data.map((item) => renderProfileItem(item))}
							</View>
						</View>
					))}

					{/* App Version */}
					<Text
						style={{
							textAlign: "center",
							color: tokens.textSecondary,
							fontSize: QarnTypography.sizes.sm,
							marginTop: QarnSpacing.md,
						}}
					>
						Version 1.0.0
					</Text>
				</ScrollView>
			</View>
		</>
	);
};

export default ProfileScreen;

import React, { useRef, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Platform,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography } from "@/constants/Typography";

interface HeaderSectionProps {
	restaurantName: string;
	restaurantLogo?: string; // Optional URL for the logo image
	onLogoPress?: () => void;
	onNotificationPress?: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
	restaurantName,
	restaurantLogo,
	onLogoPress,
	onNotificationPress,
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const searchRef = useRef<TextInput>(null);
	const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

	// Get the first letter of restaurant name for the fallback logo
	const firstLetter = restaurantName ? restaurantName.charAt(0) : "Q";

	return (
		<>
			{/* Header */}
			<View
				style={{
					backgroundColor: tokens.primary,
					paddingTop: Platform.OS === "ios" ? 50 : 16,
					paddingBottom: 8,
					paddingHorizontal: QarnSpacing.md,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity
						style={{
							backgroundColor: "rgba(255,255,255,0.2)",
							height: QarnSizes.avatarMd,
							width: QarnSizes.avatarMd,
							borderRadius: QarnRadius.md,
							alignItems: "center",
							justifyContent: "center",
							marginRight: QarnSpacing.sm,
							overflow: "hidden",
						}}
						onPress={onLogoPress}
					>
						{restaurantLogo ? (
							<Image
								source={{ uri: restaurantLogo }}
								style={{
									width: QarnSizes.avatarMd,
									height: QarnSizes.avatarMd,
								}}
								resizeMode="cover"
							/>
						) : (
							<Text
								style={{
									color: "white",
									fontWeight: QarnTypography.weights.bold,
									fontSize: QarnTypography.sizes.lg,
								}}
							>
								{firstLetter}
							</Text>
						)}
					</TouchableOpacity>

					<Text
						style={{
							color: "white",
							fontWeight: QarnTypography.weights.bold,
							fontSize: QarnTypography.sizes.lg,
						}}
					>
						{restaurantName}
					</Text>
				</View>

				<TouchableOpacity
					style={{
						height: QarnSizes.touchTarget,
						width: QarnSizes.touchTarget,
						borderRadius: QarnSizes.touchTarget / 2,
						backgroundColor: "rgba(255,255,255,0.2)",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
					}}
					hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
					onPress={onNotificationPress}
				>
					<Ionicons
						name="notifications-outline"
						size={QarnSizes.iconMd}
						color="white"
					/>
					<View
						style={{
							position: "absolute",
							top: 10,
							right: 10,
							width: 8,
							height: 8,
							borderRadius: 4,
							backgroundColor: tokens.warning,
						}}
					/>
				</TouchableOpacity>
			</View>

			{/* Search Section */}
			<View
				style={{
					backgroundColor: tokens.primary,
					paddingHorizontal: QarnSpacing.md,
					paddingBottom: QarnSpacing.xl - 6,
					borderBottomLeftRadius: QarnRadius.xl,
					borderBottomRightRadius: QarnRadius.xl,
				}}
			>
				<TouchableOpacity
					style={{
						backgroundColor: "rgba(255,255,255,0.15)",
						borderRadius: QarnRadius.md,
						flexDirection: "row",
						alignItems: "center",
						paddingHorizontal: QarnSpacing.md,
						height: QarnSizes.inputHeight,
						justifyContent: "flex-start",
					}}
					onPress={() => searchRef.current?.focus()}
					activeOpacity={0.8}
				>
					<Ionicons
						name="search"
						size={QarnSizes.iconMd}
						color="rgba(255,255,255,0.9)"
						style={{ marginRight: QarnSpacing.sm }}
					/>

					<TextInput
						ref={searchRef}
						placeholder="Search meal plans or restaurants"
						placeholderTextColor="rgba(255,255,255,0.7)"
						style={{
							flex: 1,
							fontSize: QarnTypography.sizes.md,
							color: "#FFFFFF",
							height: QarnSizes.inputHeight,
						}}
						onFocus={() => setIsSearchFocused(true)}
						onBlur={() => setIsSearchFocused(false)}
					/>

					{isSearchFocused && (
						<TouchableOpacity
							onPress={() => {
								searchRef.current?.blur();
								searchRef.current?.clear();
							}}
							style={{
								padding: QarnSpacing.xs,
								height: QarnSizes.touchTarget,
								width: QarnSizes.touchTarget,
								alignItems: "center",
								justifyContent: "center",
							}}
							hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
						>
							<Ionicons
								name="close-circle"
								size={QarnSizes.iconMd}
								color="rgba(255,255,255,0.9)"
							/>
						</TouchableOpacity>
					)}
				</TouchableOpacity>
			</View>
		</>
	);
};

export default HeaderSection;

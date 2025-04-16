import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
interface ProgressStatusCardProps {
	restaurantName: string;
	completedTasks: number;
	totalTasks: number;
	onAnalytics: () => void;
	onFinish: () => void;
	progressAnim?: Animated.Value;
}
const ProgressStatusCard = ({
	restaurantName,
	completedTasks,
	totalTasks,
	onAnalytics,
	onFinish,
	progressAnim,
}: ProgressStatusCardProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];

	const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

	return (
		<View
			style={{
				backgroundColor: tokens.card,
				borderRadius: QarnRadius.lg,
				padding: QarnSpacing.md,
				...shadows.large,
				marginHorizontal: QarnSpacing.md,
				marginTop: -20,
				marginBottom: QarnSpacing.md,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View>
					<Text
						style={{
							fontSize: QarnTypography.sizes.lg,
							fontWeight: QarnTypography.weights.bold,
							color: tokens.text,
							marginBottom: 4,
						}}
					>
						{restaurantName}
					</Text>
					<Text
						style={{
							fontSize: QarnTypography.sizes.sm,
							color: tokens.textSecondary,
						}}
					>
						{completedTasks} of {totalTasks} tasks completed
					</Text>
				</View>

				<View
					style={{
						backgroundColor: tokens.primaryLight,
						height: QarnSizes.avatarMd + 6,
						width: QarnSizes.avatarMd + 6,
						borderRadius: (QarnSizes.avatarMd + 6) / 2,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							fontSize: QarnTypography.sizes.lg,
							fontWeight: QarnTypography.weights.bold,
							color: tokens.primary,
						}}
					>
						{progressPercentage}%
					</Text>
				</View>
			</View>

			<View
				style={{
					height: 6,
					backgroundColor: tokens.primaryLight,
					borderRadius: 3,
					marginTop: QarnSpacing.md,
					marginBottom: QarnSpacing.md + 4,
					overflow: "hidden",
				}}
			>
				<Animated.View
					style={{
						width: progressAnim
							? progressAnim.interpolate({
									inputRange: [0, 1],
									outputRange: ["0%", "100%"],
								})
							: `${progressPercentage}%`,
						height: "100%",
						backgroundColor: tokens.primary,
						borderRadius: 3,
					}}
				/>
			</View>

			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<TouchableOpacity
					style={{
						backgroundColor: tokens.cardAlt,
						height: QarnSizes.buttonMd,
						paddingHorizontal: QarnSpacing.md,
						borderRadius: QarnRadius.button,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						minWidth: 120,
					}}
					onPress={onAnalytics}
					activeOpacity={0.7}
				>
					<Ionicons
						name="stats-chart"
						size={QarnSizes.iconSm}
						color={tokens.text}
					/>
					<Text
						style={{
							color: tokens.text,
							fontWeight: QarnTypography.weights.medium,
							marginLeft: QarnSpacing.xs,
							fontSize: QarnTypography.sizes.sm,
						}}
					>
						Analytics
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						backgroundColor: tokens.primary,
						height: QarnSizes.buttonMd,
						paddingHorizontal: QarnSpacing.md,
						borderRadius: QarnRadius.button,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						minWidth: 130,
					}}
					onPress={onFinish}
					activeOpacity={0.7}
				>
					<Text
						style={{
							color: "white",
							fontWeight: QarnTypography.weights.semibold,
							fontSize: QarnTypography.sizes.sm,
						}}
					>
						Finish Setup
					</Text>
					<Ionicons
						name="arrow-forward"
						size={QarnSizes.iconSm}
						color="white"
						style={{ marginLeft: QarnSpacing.xs }}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProgressStatusCard;

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
interface TaskCardProps {
	title: string;
	details: string;
	completed: boolean;
	icon: string;
	onPress: () => void;
}
const TaskCard = ({
	title,
	details,
	completed,
	icon,
	onPress,
}: TaskCardProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];

	return (
		<TouchableOpacity
			style={{
				backgroundColor: tokens.card,
				borderRadius: QarnRadius.md,
				padding: QarnSpacing.md,
				...shadows.small,
				minHeight: 130,
			}}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View
					style={{
						width: QarnSizes.avatarSm,
						height: QarnSizes.avatarSm,
						borderRadius: QarnSizes.avatarSm / 2,
						backgroundColor: completed ? tokens.primary : tokens.primaryLight,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{completed ? (
						<Ionicons name="checkmark" size={QarnSizes.iconSm} color="white" />
					) : (
						<Ionicons
							name={icon as any}
							size={QarnSizes.iconSm - 2}
							color={tokens.primary}
						/>
					)}
				</View>

				{!completed && (
					<View
						style={{
							width: 8,
							height: 8,
							borderRadius: 4,
							backgroundColor: tokens.primary,
						}}
					/>
				)}
			</View>

			<Text
				style={{
					marginTop: QarnSpacing.sm,
					fontWeight: QarnTypography.weights.semibold,
					fontSize: QarnTypography.sizes.md,
					color: tokens.text,
				}}
			>
				{title}
			</Text>

			<Text
				style={{
					marginTop: 4,
					fontSize: QarnTypography.sizes.sm,
					color: tokens.textSecondary,
					marginBottom: completed ? QarnSpacing.md : QarnSpacing.sm,
				}}
				numberOfLines={2}
			>
				{details}
			</Text>

			{!completed && (
				<TouchableOpacity
					style={{
						backgroundColor: tokens.primaryLight,
						height: QarnSizes.buttonMd,
						borderRadius: QarnRadius.button,
						alignItems: "center",
						justifyContent: "center",
						marginTop: "auto",
					}}
					activeOpacity={0.7}
				>
					<Text
						style={{
							color: tokens.primary,
							fontWeight: QarnTypography.weights.medium,
							fontSize: QarnTypography.sizes.sm,
						}}
					>
						Complete
					</Text>
				</TouchableOpacity>
			)}
		</TouchableOpacity>
	);
};

export default TaskCard;

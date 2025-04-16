import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
interface RestaurantCardProps {
	name: string;
	items: number;
	onPress: () => void;
}
const RestaurantCard = ({ name, items, onPress }: RestaurantCardProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];

	return (
		<TouchableOpacity
			style={{
				borderRadius: QarnRadius.md,
				overflow: "hidden",
				backgroundColor: tokens.card,
				marginBottom: QarnSpacing.sm,
				...shadows.small,
				minHeight: QarnSizes.touchTarget + 16,
			}}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					paddingVertical: QarnSpacing.md,
					paddingHorizontal: QarnSpacing.md,
				}}
			>
				<View
					style={{
						width: QarnSizes.avatarMd,
						height: QarnSizes.avatarMd,
						borderRadius: QarnSizes.avatarMd / 2,
						backgroundColor: tokens.primaryLight,
						alignItems: "center",
						justifyContent: "center",
						marginRight: QarnSpacing.md,
					}}
				>
					<Text
						style={{
							fontSize: QarnTypography.sizes.md,
							fontWeight: QarnTypography.weights.extrabold,
							color: tokens.primary,
						}}
					>
						{name.charAt(0)}
					</Text>
				</View>

				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontWeight: QarnTypography.weights.semibold,
							fontSize: QarnTypography.sizes.md,
							color: tokens.text,
							marginBottom: 2,
						}}
						numberOfLines={1}
					>
						{name}
					</Text>
					<Text
						style={{
							fontSize: QarnTypography.sizes.sm,
							color: tokens.textSecondary,
						}}
					>
						{items} active meal plans
					</Text>
				</View>

				<View style={{ paddingLeft: QarnSpacing.sm }}>
					<TouchableOpacity
						style={{
							height: QarnSizes.touchTarget,
							width: QarnSizes.touchTarget,
							alignItems: "center",
							justifyContent: "center",
						}}
						hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
					>
						<Ionicons
							name="chevron-forward"
							size={QarnSizes.iconMd}
							color={tokens.textSecondary}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default RestaurantCard;

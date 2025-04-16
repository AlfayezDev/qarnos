import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
interface MealPlanCardProps {
	title: string;
	price: string;
	calories: string;
	image: string;
	meals: string;
	diet: string;
	onPress: () => void;
}
const MealPlanCard = ({
	title,
	price,
	calories,
	image,
	meals,
	diet,
	onPress,
}: MealPlanCardProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];

	return (
		<TouchableOpacity
			style={{
				height: 160,
				borderRadius: QarnRadius.card,
				marginRight: QarnSpacing.md,
				width: 260,
				overflow: "hidden",
				backgroundColor: tokens.card,
				...shadows.medium,
			}}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View
				style={{
					height: 100,
					backgroundColor: isDark ? tokens.cardAlt : "#EFEFEF",
					justifyContent: "flex-end",
				}}
			>
				<View
					style={{
						backgroundColor: tokens.primary,
						position: "absolute",
						top: QarnSpacing.sm,
						left: QarnSpacing.sm,
						paddingHorizontal: QarnSpacing.sm,
						paddingVertical: QarnSpacing.xs,
						borderRadius: QarnRadius.badge,
						zIndex: 10,
						minHeight: 24,
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							color: "white",
							fontWeight: QarnTypography.weights.semibold,
							fontSize: QarnTypography.sizes.xs,
						}}
					>
						{diet}
					</Text>
				</View>

				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Ionicons
						name={image as any}
						size={QarnSizes.iconLg + 12}
						color={tokens.primary}
					/>
				</View>

				<View
					style={{
						backgroundColor: isDark
							? "rgba(0,0,0,0.7)"
							: "rgba(255,255,255,0.8)",
						borderTopLeftRadius: QarnRadius.sm,
						paddingVertical: QarnSpacing.xs,
						paddingHorizontal: QarnSpacing.sm,
						alignSelf: "flex-start",
						margin: QarnSpacing.sm,
						flexDirection: "row",
						alignItems: "center",
						minHeight: 28,
					}}
				>
					<Ionicons name="flame" size={QarnSizes.iconXs} color="#FF9500" />
					<Text
						style={{
							fontWeight: QarnTypography.weights.medium,
							fontSize: QarnTypography.sizes.xs,
							color: isDark ? tokens.text : tokens.text,
							marginLeft: 4,
						}}
					>
						{calories} cal
					</Text>
				</View>
			</View>

			<View style={{ padding: QarnSpacing.md }}>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<Text
						style={{
							fontWeight: QarnTypography.weights.semibold,
							fontSize: QarnTypography.sizes.md,
							color: tokens.text,
							flex: 1,
						}}
						numberOfLines={1}
					>
						{title}
					</Text>
					<Text
						style={{
							fontWeight: QarnTypography.weights.bold,
							fontSize: QarnTypography.sizes.md,
							color: tokens.primary,
						}}
					>
						${price}
					</Text>
				</View>

				<View
					style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
				>
					<Ionicons
						name="calendar-outline"
						size={QarnSizes.iconXs}
						color={tokens.textSecondary}
					/>
					<Text
						style={{
							marginLeft: 4,
							fontSize: QarnTypography.sizes.sm,
							color: tokens.textSecondary,
						}}
					>
						{meals} meals weekly
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default MealPlanCard;

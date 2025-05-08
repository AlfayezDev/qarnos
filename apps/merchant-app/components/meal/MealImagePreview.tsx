import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Box, Text, AnimatedBox } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/stores/themeStore";
import { FadeInUp } from "react-native-reanimated";
import { useTranslation } from "@/stores/translationStore";

interface MealImagePreviewProps {
	image?: string;
	name?: string;
	nameAr?: string;
	calories?: number;
	prepTime?: number;
	onSelectImage?: () => void;
}

export const MealImagePreview: React.FC<MealImagePreviewProps> = ({
	image,
	name,
	nameAr,
	calories,
	prepTime,
	onSelectImage,
}) => {
	const theme = useTheme();
	const { t, language } = useTranslation();
	const isArabic = language === "ar";
	return (
		<AnimatedBox
			entering={FadeInUp.delay(100).duration(
				theme.animations.duration.extraSlow,
			)}
			style={{
				borderRadius: theme.radius.lg,
				overflow: "hidden",
				height: theme.sizes.mealImageHeight,
			}}
		>
			{image ? (
				<Box style={{ height: "100%", width: "100%", position: "relative" }}>
					<Image
						source={{ uri: image }}
						style={{ width: "100%", height: "100%" }}
						resizeMode="cover"
						accessibilityLabel={
							isArabic && nameAr ? nameAr : name || t("meals.mealName")
						}
					/>
					<Box
						style={{
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
							height: theme.sizes.mealImageOverlayHeight,
							backgroundColor: theme.colors.overlayLight,
							padding: theme.spacing.md,
							justifyContent: "flex-end",
						}}
					>
						<Text variant="lg" weight="semibold" color="#fff" numberOfLines={1}>
							{isArabic && nameAr ? nameAr : name || t("meals.mealName")}
						</Text>
						<Box row alignItems="center" marginTop="xs">
							<Ionicons
								name="flame-outline"
								size={theme.sizes.iconSm}
								color="#fff"
								style={{ marginEnd: theme.spacing.xs }}
							/>
							<Text variant="sm" color="#fff">
								{calories ? `${calories} cal` : "0 cal"}
							</Text>
							<Text
								variant="sm"
								color="#fff"
								style={{ marginHorizontal: theme.spacing.xs }}
							>
								•
							</Text>
							<Ionicons
								name="time-outline"
								size={theme.sizes.iconSm}
								color="#fff"
								style={{ marginEnd: theme.spacing.xs }}
							/>
							<Text variant="sm" color="#fff">
								{prepTime ? `${prepTime} min` : "0 min"}
							</Text>
						</Box>
					</Box>
					<TouchableOpacity
						style={{
							position: "absolute",
							top: theme.spacing.sm,
							right: theme.spacing.sm,
							backgroundColor: theme.colors.overlayMedium,
							borderRadius: theme.radius.round,
							padding: theme.spacing.xs,
						}}
						onPress={onSelectImage}
						accessibilityLabel={t("meals.addImage")}
						accessibilityRole="button"
					>
						<Ionicons
							name="camera-outline"
							size={theme.sizes.iconMd}
							color="#fff"
						/>
					</TouchableOpacity>
				</Box>
			) : (
				<TouchableOpacity
					style={{
						height: "100%",
						width: "100%",
						backgroundColor: theme.colors.cardAlt,
						alignItems: "center",
						justifyContent: "center",
					}}
					onPress={onSelectImage}
					accessibilityLabel={t("meals.addImage")}
					accessibilityRole="button"
				>
					<Ionicons
						name="camera-outline"
						size={theme.sizes.iconLg}
						color={theme.colors.primary}
						style={{ marginBottom: theme.spacing.sm }}
					/>
					<Text variant="md" weight="semibold" color="primary">
						{t("meals.addImage")}
					</Text>
				</TouchableOpacity>
			)}
		</AnimatedBox>
	);
};

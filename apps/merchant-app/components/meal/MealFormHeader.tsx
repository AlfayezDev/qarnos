import React from "react";
import { useRouter } from "expo-router";
import { Box, AnimatedBox, Text, Button, Badge } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { FadeIn } from "react-native-reanimated";

interface MealFormHeaderProps {
	title: string;
	isEdit: boolean;
	mealName?: string;
	mealNameAr?: string;
	available?: boolean;
	onDelete: () => void;
}

export const MealFormHeader: React.FC<MealFormHeaderProps> = ({
	title,
	isEdit,
	mealName,
	mealNameAr,
	available,
	onDelete,
}) => {
	const theme = useTheme();
	const router = useRouter();
	const { t, language, isRTL } = useTranslation();
	const isArabic = language === "ar";

	return (
		<AnimatedBox
			row
			alignItems="center"
			justifyContent="space-between"
			paddingHorizontal="md"
			paddingVertical="sm"
			style={{
				height: theme.sizes.headerHeight,
				borderBottomWidth: 1,
				borderBottomColor: theme.colors.divider,
			}}
			entering={FadeIn.duration(300)}
		>
			<Box row alignItems="center">
				<Button
					title=""
					variant="ghost"
					leftIcon={isRTL ? "chevron-forward" : "chevron-back"}
					size="sm"
					onPress={() => router.back()}
					style={{ marginEnd: theme.spacing.sm }}
					accessibilityLabel={t("common.back")}
					accessibilityRole="button"
				/>
				<Text variant="xl" weight="semibold" numberOfLines={1}>
					{isEdit ? (isArabic && mealNameAr ? mealNameAr : mealName) : title}
				</Text>
				{isEdit && available !== undefined && (
					<Badge
						text={t(available ? "meals.available" : "meals.unavailable")}
						variant={available ? "success" : "warning"}
						size="sm"
						style={{ marginStart: theme.spacing.sm }}
					/>
				)}
			</Box>
			{isEdit && (
				<Button
					title=""
					variant="ghost"
					leftIcon="trash-outline"
					size="sm"
					onPress={onDelete}
					textColor={theme.colors.error}
					accessibilityLabel={t("common.delete")}
					accessibilityRole="button"
				/>
			)}
		</AnimatedBox>
	);
};

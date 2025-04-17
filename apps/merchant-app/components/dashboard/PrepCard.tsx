import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text, Badge } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { MealPrepSummary } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface TodayPrepCardProps {
	summary: MealPrepSummary;
	theme: AppTheme;
	onPress: () => void;
}

const MAX_MEALS_TO_SHOW = 3;
const PREP_CARD_WIDTH = 180;

export const TodayPrepCard: React.FC<TodayPrepCardProps> = React.memo(
	({ summary, theme, onPress }) => {
		const { t } = useTranslation();

		const periodIcons = {
			Breakfast: "cafe-outline",
			Lunch: "restaurant-outline",
			Dinner: "fast-food-outline",
		};

		const periodColors: Record<
			"Breakfast" | "Lunch" | "Dinner",
			"info" | "primary" | "error"
		> = { Breakfast: "info", Lunch: "primary", Dinner: "error" };

		const translatedPeriod = t(`periods.${summary.period.toLowerCase()}`);

		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					localStyles.prepCardContainer,
					{ borderRadius: theme.radius.lg },
					pressed && { opacity: 0.8 },
				]}
				android_ripple={{ color: theme.colors.overlay }}
			>
				<Box
					style={[
						localStyles.prepCard,
						{
							backgroundColor: theme.colors.card,
							borderRadius: theme.radius.lg,
							shadowColor: theme.colors.shadow,
						},
					]}
					elevation="small"
				>
					<Box
						row
						alignCenter
						marginBottom="sm"
						style={{ flexDirection: "row" }}
					>
						<Ionicons
							name={periodIcons[summary.period] as any}
							size={theme.sizes.iconSm}
							color={theme.colors[periodColors[summary.period]]}
							style={{
								marginEnd: theme.spacing.sm,
							}}
						/>
						<Text variant="md" weight="semibold">
							{translatedPeriod}
						</Text>
					</Box>
					<Text
						variant="sm"
						weight="medium"
						color="textSecondary"
						marginBottom="xs"
						style={{ alignSelf: "flex-start" }}
					>
						{t("dashboard.prepList")}
					</Text>
					<Box style={localStyles.prepListContainer}>
						{summary.mealsToPrep.slice(0, MAX_MEALS_TO_SHOW).map((meal) => (
							<Box
								key={meal.id}
								row
								justifyContent="space-between"
								paddingVertical={theme.spacing.xs / 1.5}
								style={{ flexDirection: "row" }}
							>
								<Text
									variant="sm"
									numberOfLines={1}
									style={{
										flexShrink: 1,
										marginEnd: theme.spacing.sm,
									}}
								>
									{meal.name}
								</Text>
								<Text variant="sm" weight="medium" color="textSecondary">
									{meal.count}
								</Text>
							</Box>
						))}
					</Box>
					<Box
						row
						justifyContent="space-between"
						alignItems="flex-end"
						paddingTop="sm"
						style={{ flexDirection: "row" }}
					>
						<Badge
							text={`${summary.totalMeals} ${t("common.total")}`}
							variant={periodColors[summary.period]}
							size="sm"
						/>
					</Box>
				</Box>
			</Pressable>
		);
	},
);

const localStyles = StyleSheet.create({
	prepCardContainer: { width: PREP_CARD_WIDTH },
	prepCard: { padding: 16, minHeight: 170, justifyContent: "space-between" },
	prepListContainer: { marginTop: 4, flexGrow: 1 },
});

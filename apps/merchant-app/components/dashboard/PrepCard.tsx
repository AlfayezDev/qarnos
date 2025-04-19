import React, { useCallback } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
	Extrapolation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Box, Text, Badge } from "@/components/ui";
import { MealPrepSummary } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

interface TodayPrepCardProps {
	summary: MealPrepSummary;
	onPress: () => void;
}

const PREP_CARD_WIDTH = 180;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TodayPrepCard = React.memo(
	({ summary, onPress }: TodayPrepCardProps) => {
		const theme = useTheme();
		const { t } = useTranslation();
		const pressed = useSharedValue(0);
		const hovered = useSharedValue(0);

		const periodIcons = {
			Breakfast: "cafe-outline",
			Lunch: "restaurant-outline",
			Dinner: "fast-food-outline",
		};

		const periodColors: Record<
			"Breakfast" | "Lunch" | "Dinner",
			"info" | "primary" | "error"
		> = {
			Breakfast: "info",
			Lunch: "primary",
			Dinner: "error",
		};

		const translatedPeriod = t(`periods.${summary.period.toLowerCase()}`);

		const handlePressIn = useCallback(() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			pressed.value = withTiming(1, { duration: 100 });
		}, []);

		const handlePressOut = useCallback(() => {
			pressed.value = withTiming(0, { duration: 200 });
		}, []);

		const handleHoverIn = useCallback(() => {
			hovered.value = withTiming(1, { duration: 300 });
		}, []);

		const handleHoverOut = useCallback(() => {
			hovered.value = withTiming(0, { duration: 300 });
		}, []);

		const handlePress = useCallback(() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			onPress();
		}, [onPress]);

		const animatedCardStyle = useAnimatedStyle(() => {
			const scale = interpolate(
				pressed.value,
				[0, 1],
				[1, 0.95],
				Extrapolation.CLAMP,
			);
			const opacity = interpolate(
				pressed.value,
				[0, 1],
				[1, 0.5],
				Extrapolation.CLAMP,
			);
			return {
				transform: [{ scale }],
				opacity,
			};
		});

		return (
			<AnimatedPressable
				onPress={handlePress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onHoverIn={handleHoverIn}
				onHoverOut={handleHoverOut}
				style={[
					{
						width: PREP_CARD_WIDTH,
						margin: theme.spacing.xs / 2,
						borderRadius: theme.radius.lg,
					},
					animatedCardStyle,
				]}
			>
				<Box
					card
					rounded="lg"
					padding="md"
					elevation="small"
					style={{
						minHeight: theme.sizes.buttonLg * 4,
					}}
				>
					<Box row alignCenter marginBottom="sm">
						<Ionicons
							name={
								periodIcons[summary.period as keyof typeof periodIcons] as any
							}
							size={theme.sizes.iconSm}
							color={
								theme.colors[
									periodColors[summary.period as keyof typeof periodColors]
								]
							}
							style={{ marginEnd: theme.spacing.sm }}
						/>
						<Text variant="md" weight="semibold">
							{translatedPeriod}
						</Text>
					</Box>
					<Box marginTop="xs" flex={1} gap="sm">
						{summary.mealsToPrep.slice(0, 3).map((meal) => (
							<Box
								key={meal.id}
								row
								justifyContent="space-between"
								paddingVertical={theme.spacing.xs / 1.5}
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
					>
						<Badge
							text={`${summary.totalMeals} ${t("common.total")}`}
							variant={
								periodColors[summary.period as keyof typeof periodColors]
							}
							size="sm"
						/>
					</Box>
				</Box>
			</AnimatedPressable>
		);
	},
);

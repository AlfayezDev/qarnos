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
import { Box, Text } from "@/components/ui";
import { MealPrepSummary } from "@/types";
import { useTheme } from "@/stores/themeStore";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/stores/translationStore";

interface TodayPrepCardProps {
	summary: MealPrepSummary;
	onPress: () => void;
	variant?:
		| "sage"
		| "peach"
		| "lavender"
		| "coral"
		| "mint"
		| "cream"
		| "sky"
		| "rose";
}

const PREP_CARD_WIDTH = 200;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const TodayPrepCard = React.memo(
	({ summary, onPress, variant = "cream" }: TodayPrepCardProps) => {
		const theme = useTheme();
		const { t } = useTranslation();
		const pressed = useSharedValue(0);
		const hovered = useSharedValue(0);
		const periodIcons = {
			Breakfast: "cafe-outline",
			Lunch: "restaurant-outline",
			Dinner: "fast-food-outline",
		};
		const translatedPeriod = t(`periods.${summary.period.toLowerCase()}`);

		const handlePressIn = useCallback(() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			pressed.value = withTiming(1, {
				duration: theme.animations.duration.medium,
			});
		}, []);

		const handlePressOut = useCallback(() => {
			pressed.value = withTiming(0, {
				duration: theme.animations.duration.slow,
			});
		}, []);

		const handleHoverIn = useCallback(() => {
			hovered.value = withTiming(1, {
				duration: theme.animations.duration.medium,
			});
		}, []);

		const handleHoverOut = useCallback(() => {
			hovered.value = withTiming(0, {
				duration: theme.animations.duration.medium,
			});
		}, []);

		const handlePress = useCallback(() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			onPress();
		}, [onPress]);

		const animatedCardStyle = useAnimatedStyle(() => {
			const scale = interpolate(
				pressed.value,
				[0, 1],
				[1, 0.98],
				Extrapolation.CLAMP,
			);
			return { transform: [{ scale }] };
		});

		return (
			<AnimatedPressable
				onPress={handlePress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onHoverIn={handleHoverIn}
				onHoverOut={handleHoverOut}
				style={[{ width: PREP_CARD_WIDTH }, animatedCardStyle]}
			>
				<Card
					variant={variant}
					rounded="sm"
					padding="md"
					elevation="small"
					style={{
						minHeight: theme.sizes.buttonLg * 3.5,
						borderWidth: 1,
						borderColor: theme.colors.divider,
					}}
					gap="xs"
				>
					<Box row alignCenter gap={"xs"}>
						<Box
							width={32}
							height={32}
							rounded="xs"
							alignItems="center"
							bg="primaryLight"
							justifyContent="center"
						>
							<Ionicons
								name={
									periodIcons[summary.period as keyof typeof periodIcons] as any
								}
								size={theme.sizes.iconSm}
								color={theme.colors.primary}
							/>
						</Box>
						<Text variant="md" weight="semibold" color="primary">
							{translatedPeriod}
						</Text>
					</Box>

					<Box flex={1} gap="xs" justifyContent="space-between">
						{summary.mealsToPrep.slice(0, 3).map((meal, index) => (
							<Box
								key={meal.id}
								height={45}
								alignCenter
								row
								justifyContent="space-between"
								borderColor="divider"
								style={{
									borderBottomWidth: index === 2 ? 0 : 0.5,
								}}
							>
								<Text
									variant="sm"
									weight="medium"
									numberOfLines={1}
									style={{ flexShrink: 1 }}
								>
									{meal.name}
								</Text>
								<Text variant="md" weight="semibold">
									{meal.count}
								</Text>
							</Box>
						))}
					</Box>
				</Card>
			</AnimatedPressable>
		);
	},
);

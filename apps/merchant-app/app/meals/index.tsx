import React, { useState, useCallback, useMemo } from "react";
import { FlatList, View, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	FadeIn,
	FadeInUp,
	LinearTransition,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { AnimatedBox, Box, Card, Text } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { MEALS } from "@/data";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Meal } from "@/types";
import { Link } from "expo-router";

const MealScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [selectedPeriod, setSelectedPeriod] = useState<string>("Breakfast");
	const insets = useSafeAreaInsets();
	const [meals] = useState<Meal[]>(MEALS);

	const periods = useMemo(() => ["Breakfast", "Lunch", "Dinner"], []);

	const filteredMeals = useMemo(() => {
		return meals.filter((meal) => meal.period === selectedPeriod);
	}, [meals, selectedPeriod]);

	const handleSelectPeriod = useCallback(
		(period: string) => {
			if (period !== selectedPeriod) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				setSelectedPeriod(period);
			}
		},
		[selectedPeriod],
	);

	function renderEmptyList() {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					padding: theme.spacing.xl,
				}}
			>
				<Ionicons
					name="restaurant-outline"
					size={theme.sizes.iconLg}
					color={theme.colors.textMuted}
					style={{ marginBottom: theme.spacing.md }}
				/>
				<Text variant="lg" weight="semibold" color="textSecondary" center>
					{t("meals.noMeals")}
				</Text>
				<Text variant="md" color="textMuted" center marginTop="xs">
					{t("meals.addFirstMeal")}
				</Text>
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<Box
				row
				alignItems="center"
				paddingHorizontal="md"
				paddingVertical="sm"
				style={{
					height: theme.sizes.headerHeight,
				}}
			>
				<Text variant="xl" weight="semibold" numberOfLines={1}>
					{t("meals.title")}
				</Text>
			</Box>

			<AnimatedBox
				marginHorizontal="md"
				gap="lg"
				entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
			>
				<Tabs
					tabs={periods}
					selectedTab={selectedPeriod}
					onSelectTab={handleSelectPeriod}
					labelRender={(tab) => t(`periods.${tab.toLowerCase()}`)}
				/>
			</AnimatedBox>
			<Animated.View layout={LinearTransition.springify()} style={{ flex: 1 }}>
				{filteredMeals.length > 0 ? (
					<FlatList
						data={filteredMeals}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <MealCard item={item} />}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							padding: theme.spacing.md,
							paddingBottom: theme.spacing.xxl,
						}}
					/>
				) : (
					renderEmptyList()
				)}
			</Animated.View>
		</View>
	);
};

const MealCard = (props: { item: Meal }) => {
	const { item } = props;
	const { language } = useTranslation();
	const theme = useTheme();
	const isArabic = language === "ar";
	return (
		<Animated.View
			layout={LinearTransition.springify().damping(
				theme.animations.spring.damping.light,
			)}
			entering={FadeIn.duration(theme.animations.duration.slow)}
			style={{ marginBottom: theme.spacing.md }}
		>
			<Link asChild href={`/meals/${item.id}`}>
				<Pressable
					onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
					style={({ pressed }) => ({
						opacity: pressed ? theme.animations.scale.pressedSmall : 1,
						transform: [
							{ scale: pressed ? theme.animations.scale.pressed : 1 },
						],
					})}
				>
					<Card padding="none" elevation="small">
						{item.image && (
							<Image
								source={{ uri: item.image }}
								style={{
									height: theme.sizes.mealCardImageHeight,
									width: "100%",
									borderTopLeftRadius: theme.radius.card,
									borderTopRightRadius: theme.radius.card,
								}}
								resizeMode="cover"
							/>
						)}
						<Box padding="md" gap={"sm"} alignItems="flex-start">
							<Text variant="lg" weight="semibold">
								{isArabic && item.name_ar ? item.name_ar : item.name}
							</Text>
							<Text
								variant="sm"
								color="textSecondary"
								marginBottom="md"
								numberOfLines={2}
							>
								{isArabic && item.description_ar
									? item.description_ar
									: item.description}
							</Text>
							<Box row marginBottom="sm">
								<Box row alignCenter>
									<Ionicons
										name="flame-outline"
										size={theme.sizes.iconSm}
										color={theme.colors.textSecondary}
										style={{ marginEnd: theme.spacing.xs }}
									/>
									<Text variant="sm" color="textSecondary">
										{item.calories} cal
									</Text>
								</Box>
							</Box>
						</Box>
					</Card>
				</Pressable>
			</Link>
		</Animated.View>
	);
};
export default MealScreen;

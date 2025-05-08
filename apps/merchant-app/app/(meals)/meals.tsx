import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { AnimatedBox, Box, Text } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MealCard from "@/components/meal/MealCard";
import { useMealStore } from "@/stores/mealStore";
import { useTheme } from "@/stores/themeStore";
import { useTranslation } from "@/stores/translationStore";

const MealScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [selectedPeriod, setSelectedPeriod] = useState<string>("Breakfast");
	const insets = useSafeAreaInsets();
	const { meals } = useMealStore();
	const periods = ["Breakfast", "Lunch", "Dinner"];

	const filteredMeals = meals.filter((meal) => meal.period === selectedPeriod);

	const handleSelectPeriod = (period: string) => {
		if (period !== selectedPeriod) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setSelectedPeriod(period);
		}
	};

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
			<Animated.View style={{ flex: 1 }}>
				{filteredMeals.length > 0 ? (
					<FlatList
						data={filteredMeals}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <MealCard item={item} />}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							padding: theme.spacing.md,
							paddingBottom: theme.spacing.xxl,
							gap: theme.spacing.md,
						}}
					/>
				) : (
					renderEmptyList()
				)}
			</Animated.View>
		</View>
	);
};

export default MealScreen;

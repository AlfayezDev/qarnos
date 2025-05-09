import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	FadeInUp,
	useAnimatedRef,
	useDerivedValue,
	useScrollViewOffset,
} from "react-native-reanimated";
import { Box, Text } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MealCard from "@/components/meal/MealCard";
import { useMealStore } from "@/stores/mealStore";
import { useTheme } from "@/stores/themeStore";
import { useTranslation } from "@/stores/translationStore";
const periods = ["Breakfast", "Lunch", "Dinner"];

const Header = ({
	selectedPeriod,
	setSelectedPeriod,
}: { selectedPeriod: string; setSelectedPeriod: (inp: string) => void }) => {
	const { t } = useTranslation();
	return (
		<Box
			gap="lg"
			width={"100%"}
			style={{
				position: "absolute",
				zIndex: 2,
			}}
		>
			<Tabs
				tabs={periods}
				selectedTab={selectedPeriod}
				onSelectTab={setSelectedPeriod}
				labelRender={(tab) => t(`periods.${tab.toLowerCase()}`)}
			/>
		</Box>
	);
};
const MealScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { meals } = useMealStore();
	const [selectedPeriod, setSelectedPeriod] = useState<string>("Breakfast");

	const filteredMeals = meals.filter((meal) => meal.period === selectedPeriod);

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
	const scrollRef2 = useAnimatedRef<Animated.ScrollView>();
	const scrollY = useScrollViewOffset(scrollRef2);
	useDerivedValue(() => {
		console.log(scrollY.value);
	});

	return (
		<>
			<Header
				setSelectedPeriod={setSelectedPeriod}
				selectedPeriod={selectedPeriod}
			/>
			<Animated.FlatList
				ref={scrollRef2 as any}
				entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
				key={"meals-list"}
				data={filteredMeals}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <MealCard item={item} />}
				showsVerticalScrollIndicator={false}
				style={{
					paddingHorizontal: theme.spacing.md,
					paddingTop: insets.top,
					paddingBottom: insets.bottom + theme.spacing.xxl,
					gap: theme.spacing.md,
				}}
				ListEmptyComponent={renderEmptyList}
			/>
		</>
	);
};

export default MealScreen;

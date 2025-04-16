import React, { useState, useCallback, useRef } from "react";
import {
	ScrollView,
	I18nManager,
	Animated,
	RefreshControl,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

// Import our components
import { useTheme } from "@/hooks/useTheme";
import { Box, Text } from "@/components/ui";
import { ScreenContainer } from "@/components/layout";
import SearchOverlay from "@/components/layout/SearchOverlay";
import CategoryFilters from "@/components/category-filters";
import MealPlanCard from "@/components/meal-plan-card";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types for meal plan data
interface MealPlan {
	id: number;
	title: string;
	price: string;
	calories: string;
	image: string;
	meals: string;
	diet: string;
	featured?: boolean;
	description?: string;
}

interface SearchResult {
	id: string | number;
	title: string;
	subtitle?: string;
	icon?: string;
}

const MealsScreen: React.FC = () => {
	const theme = useTheme();
	const isRTL = I18nManager.isRTL;
	const insets = useSafeAreaInsets();
	// State
	const [selectedType, setSelectedType] = useState<string>("All");
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [_, setSearchQuery] = useState<string>("");
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [recentSearches, setRecentSearches] = useState<string[]>([
		"keto meals",
		"vegan options",
		"low calorie",
	]);
	const [refreshing, setRefreshing] = useState(false);

	// Animation refs
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(20)).current;

	// Reset search when screen re-focuses
	useFocusEffect(
		useCallback(() => {
			setIsSearchVisible(false);
			animateElements();
			return () => {};
		}, []),
	);

	// Animation function
	const animateElements = () => {
		// Reset animation values
		fadeAnim.setValue(0);
		translateY.setValue(20);

		// Run animations
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 0,
				duration: 600,
				useNativeDriver: true,
			}),
		]).start();
	};

	// Handle refresh
	const handleRefresh = () => {
		setRefreshing(true);
		// Simulate API call
		setTimeout(() => {
			setRefreshing(false);
			animateElements();
		}, 1500);
	};

	// Sample meal plan categories
	const MEAL_TYPES: string[] = [
		"All",
		"Keto",
		"Vegan",
		"Paleo",
		"Low-carb",
		"Vegetarian",
	];

	// Sample meal plans
	const MEAL_PLANS: MealPlan[] = [
		{
			id: 1,
			title: "Keto Premium",
			price: "89",
			calories: "1,500",
			image: "nutrition-outline",
			meals: "5",
			diet: "Keto",
			featured: true,
			description: "High fat, low carb meals designed for ketosis",
		},
		{
			id: 2,
			title: "Plant Power",
			price: "79",
			calories: "1,200",
			image: "leaf-outline",
			meals: "7",
			diet: "Vegan",
			description: "100% plant-based meals rich in nutrients",
		},
		{
			id: 3,
			title: "Paleo Basics",
			price: "95",
			calories: "1,800",
			image: "barbell-outline",
			meals: "6",
			diet: "Paleo",
			featured: true,
			description: "Whole foods based on our ancestral diet",
		},
		{
			id: 4,
			title: "Vegetarian Delight",
			price: "75",
			calories: "1,400",
			image: "flower-outline",
			meals: "5",
			diet: "Vegetarian",
			description: "Meat-free meals with dairy and eggs",
		},
		{
			id: 5,
			title: "Low-Carb Classic",
			price: "85",
			calories: "1,600",
			image: "fitness-outline",
			meals: "5",
			diet: "Low-carb",
			description: "Reduced carb meals for steady energy",
		},
		{
			id: 6,
			title: "Keto Lite",
			price: "69",
			calories: "1,300",
			image: "nutrition-outline",
			meals: "4",
			diet: "Keto",
			description: "A lighter version of our keto plan",
		},
	];

	// Handler functions
	const handleMealPlanPress = (mealPlanId: number) => {
		console.log(`Meal plan ${mealPlanId} pressed`);
	};

	const handleAddMealPlan = () => {
		console.log("Add new meal plan");
	};

	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);

			if (!query.trim()) {
				setSearchResults([]);
				return;
			}

			// Filter meal plans based on search query
			const results = MEAL_PLANS.filter(
				(plan) =>
					plan.title.toLowerCase().includes(query.toLowerCase()) ||
					plan.diet.toLowerCase().includes(query.toLowerCase()) ||
					plan.description?.toLowerCase().includes(query.toLowerCase()),
			).map((plan) => ({
				id: plan.id,
				title: plan.title,
				subtitle: `${plan.diet} • ${plan.calories} cal • ${plan.meals} meals`,
				icon: plan.image,
			}));

			setSearchResults(results);

			// Save to recent searches when query has results
			if (
				query.trim() &&
				results.length > 0 &&
				!recentSearches.includes(query)
			) {
				setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
			}
		},
		[MEAL_PLANS, recentSearches],
	);

	const handleSearchResultPress = (result: SearchResult) => {
		// Find and handle the corresponding meal plan
		const plan = MEAL_PLANS.find((p) => p.id === result.id);
		if (plan) {
			handleMealPlanPress(plan.id);
			setIsSearchVisible(false);
		}
	};

	const filteredMealPlans = MEAL_PLANS.filter(
		(plan) => selectedType === "All" || plan.diet === selectedType,
	);

	const featuredMealPlans = filteredMealPlans.filter((plan) => plan.featured);
	const regularMealPlans = filteredMealPlans.filter((plan) => !plan.featured);

	const Header = () => (
		<Box bg="primary">
			<Box
				row
				justifyContent="space-between"
				alignItems="center"
				paddingTop={insets.top} // Use safe area inset for top padding
				paddingBottom="md"
				paddingHorizontal="md"
			>
				<Text variant="xl" weight="bold" color="white">
					Meal Plans
				</Text>
			</Box>

			{/* Search Bar Button */}
			<Box
				bg="rgba(255,255,255,0.15)"
				rounded="md"
				row={!isRTL}
				style={{
					flexDirection: isRTL ? "row-reverse" : "row",
					alignItems: "center",
					height: theme.sizes.inputHeight,
					marginHorizontal: theme.spacing.md,
					marginBottom: theme.spacing.lg,
				}}
				onPress={() => setIsSearchVisible(true)}
				activeOpacity={0.8}
			>
				<Box paddingHorizontal="md">
					<Ionicons name="search" size={22} color="rgba(255,255,255,0.9)" />
				</Box>

				<Text color="rgba(255,255,255,0.7)" style={{ fontSize: 16 }}>
					Search meal plans
				</Text>
			</Box>
		</Box>
	);

	// Stats Card component
	const StatsCard = () => (
		<Animated.View
			style={{
				opacity: fadeAnim,
				transform: [{ translateY }],
				marginHorizontal: theme.spacing.md,
				marginVertical: theme.spacing.sm,
			}}
		>
			<Box card rounded="lg" elevation="medium" padding={0}>
				<Box row>
					<Box
						flex={1}
						paddingVertical="md"
						alignCenter
						style={{
							borderRightWidth: 1,
							borderRightColor: theme.colors.divider,
						}}
					>
						<Text variant="lg" weight="bold" color="primary" marginBottom={4}>
							{filteredMealPlans.length}
						</Text>
						<Text variant="sm" color="textSecondary">
							Active Plans
						</Text>
					</Box>

					<Box
						flex={1}
						paddingVertical="md"
						alignItems="center"
						style={{
							borderRightWidth: 1,
							borderRightColor: theme.colors.divider,
						}}
					>
						<Text variant="lg" weight="bold" color="info" marginBottom={4}>
							12
						</Text>
						<Text variant="sm" color="textSecondary">
							Subscribers
						</Text>
					</Box>

					<Box flex={1} paddingVertical="md" alignItems="center">
						<Text variant="lg" weight="bold" color="success" marginBottom={4}>
							$968
						</Text>
						<Text variant="sm" color="textSecondary">
							Monthly
						</Text>
					</Box>
				</Box>
			</Box>
		</Animated.View>
	);

	// Floating Action Button
	const AddButton = () => (
		<Box
			style={{
				position: "absolute",
				bottom: theme.spacing.xl,
				right: isRTL ? undefined : theme.spacing.lg,
				left: isRTL ? theme.spacing.lg : undefined,
				backgroundColor: theme.colors.primary,
				height: 56,
				width: 56,
				borderRadius: 28,
				alignItems: "center",
				justifyContent: "center",
				elevation: 4,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.2,
				shadowRadius: 3.5,
			}}
			onPress={handleAddMealPlan}
		>
			<Ionicons name="add" size={28} color="white" />
		</Box>
	);

	// Featured Plans Section
	const FeaturedPlansSection = () =>
		featuredMealPlans.length > 0 ? (
			<Animated.View
				style={{
					opacity: fadeAnim,
					transform: [{ translateY }],
					marginTop: theme.spacing.sm,
				}}
			>
				<Text
					variant="lg"
					weight="semibold"
					margin="md"
					marginTop="sm"
					marginBottom="sm"
				>
					Featured Plans
				</Text>

				{featuredMealPlans.map((plan) => (
					<Box key={plan.id} marginHorizontal="md" marginBottom="md">
						<MealPlanCard
							title={plan.title}
							price={plan.price}
							calories={plan.calories}
							image={plan.image}
							meals={plan.meals}
							diet={plan.diet}
							onPress={() => handleMealPlanPress(plan.id)}
							featured={true}
						/>
					</Box>
				))}
			</Animated.View>
		) : null;

	// Regular Plans Section
	const RegularPlansSection = () => (
		<Animated.View
			style={{
				opacity: fadeAnim,
				transform: [{ translateY }],
			}}
		>
			<Text
				variant="lg"
				weight="semibold"
				margin="md"
				marginTop="md"
				marginBottom="sm"
			>
				All Meal Plans
			</Text>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingLeft: theme.spacing.md,
					paddingRight: theme.spacing.md,
					paddingBottom: theme.spacing.sm,
				}}
				snapToInterval={260 + theme.spacing.md}
				decelerationRate={Platform.OS === "ios" ? "fast" : 0.85}
			>
				{regularMealPlans.map((plan) => (
					<Box key={plan.id} marginBottom="sm" marginRight="sm">
						<MealPlanCard
							title={plan.title}
							price={plan.price}
							calories={plan.calories}
							image={plan.image}
							meals={plan.meals}
							diet={plan.diet}
							onPress={() => handleMealPlanPress(plan.id)}
						/>
					</Box>
				))}
			</ScrollView>
		</Animated.View>
	);

	return (
		<>
			<ScreenContainer header={<Header />} scrollable={false} padded={false}>
				<Animated.ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ paddingBottom: theme.spacing.xl + 40 }}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
							tintColor={theme.colors.primary}
							colors={[theme.colors.primary]}
							progressBackgroundColor={
								theme.isDark ? theme.colors.card : undefined
							}
						/>
					}
				>
					{/* Category Filters */}
					<Animated.View
						style={{
							opacity: fadeAnim,
							transform: [{ translateY: translateY }],
						}}
					>
						<CategoryFilters
							categories={MEAL_TYPES}
							selectedCategory={selectedType}
							onSelectCategory={setSelectedType}
						/>
					</Animated.View>

					{/* Stats Bar */}
					<StatsCard />

					{/* Featured Plans */}
					<FeaturedPlansSection />

					{/* All Meal Plans Grid */}
					<RegularPlansSection />
				</Animated.ScrollView>

				<AddButton />
			</ScreenContainer>

			{/* Search Overlay */}
			<SearchOverlay
				isVisible={isSearchVisible}
				onClose={() => setIsSearchVisible(false)}
				placeholder="Search meal plans"
				onSearch={handleSearch}
				results={searchResults}
				onResultPress={handleSearchResultPress}
				recentSearches={recentSearches}
				onClearRecents={() => setRecentSearches([])}
			/>
		</>
	);
};

export default MealsScreen;

import React, { useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	RefreshControl,
	I18nManager,
	Platform,
	LayoutAnimation,
	UIManager,
	View,
	ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	interpolate,
	Extrapolation,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Box, Text } from "@/components/ui";
import CategoryFilters from "@/components/category-filters";
import MealPlanCard from "@/components/meal-plan-card";
import RestaurantCard from "@/components/restaurant-card";
import TaskCard from "@/components/task-card";

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Task {
	id: number;
	title: string;
	details: string;
	completed: boolean;
	icon: string;
}

interface MealPlan {
	id: number;
	title: string;
	price: string;
	calories: string;
	image: string;
	meals: string;
	diet: string;
}

interface Restaurant {
	id: number;
	name: string;
	items: number;
}

// Sample data
const TASKS: Task[] = [
	{
		id: 1,
		title: "First meal plan",
		details: "Create your signature meals",
		completed: true,
		icon: "restaurant",
	},
	{
		id: 2,
		title: "Your domain",
		details: "Connect your web address",
		completed: true,
		icon: "globe",
	},
	{
		id: 3,
		title: "Branding",
		details: "Style your restaurant's look",
		completed: true,
		icon: "color-palette",
	},
	{
		id: 4,
		title: "Delivery zones",
		details: "Set where you'll deliver",
		completed: true,
		icon: "map",
	},
	{
		id: 5,
		title: "Nutrition facts",
		details: "Add health information",
		completed: true,
		icon: "fitness",
	},
	{
		id: 6,
		title: "Payments",
		details: "Set up subscription billing",
		completed: false,
		icon: "card",
	},
];

const MEAL_TYPES: string[] = ["All", "Keto", "Vegan", "Paleo", "Low-carb"];

const MEAL_PLANS: MealPlan[] = [
	{
		id: 1,
		title: "Keto Premium",
		price: "89",
		calories: "1,500",
		image: "nutrition-outline",
		meals: "5",
		diet: "Keto",
	},
	{
		id: 2,
		title: "Plant Power",
		price: "79",
		calories: "1,200",
		image: "leaf-outline",
		meals: "7",
		diet: "Vegan",
	},
	{
		id: 3,
		title: "Paleo Basics",
		price: "95",
		calories: "1,800",
		image: "barbell-outline",
		meals: "6",
		diet: "Paleo",
	},
];

const RESTAURANTS: Restaurant[] = [
	{ id: 1, name: "Green Kitchen", items: 8 },
	{ id: 2, name: "Harvest Table", items: 5 },
];

const HomeScreen: React.FC = () => {
	const theme = useTheme();
	const isRTL = I18nManager.isRTL;
	const [selectedType, setSelectedType] = useState<string>("All");
	const [refreshing, setRefreshing] = useState(false);
	const insets = useSafeAreaInsets(); // Get safe area insets

	// Animation values (using Reanimated shared values)
	const progressAnim = useSharedValue(5 / 6); // Start with progress visible
	const scrollY = useSharedValue(0);

	// Initial setup
	useFocusEffect(
		useCallback(() => {
			// Configure layout animation for smoother transitions
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			return () => {};
		}, []),
	);

	// Handle pull-to-refresh
	const handleRefresh = useCallback(() => {
		setRefreshing(true);

		// Simulate data fetch
		setTimeout(() => {
			setRefreshing(false);
		}, 1500);
	}, []);

	// Event handlers
	const handleAnalytics = () => console.log("Analytics pressed");
	const handleFinishSetup = () => console.log("Finish setup pressed");
	const handleTaskPress = (id: number) => console.log(`Task ${id} pressed`);
	const handleMealPlanPress = (id: number) =>
		console.log(`Meal plan ${id} pressed`);
	const handleRestaurantPress = (id: number) =>
		console.log(`Restaurant ${id} pressed`);
	const handleViewAllMealPlans = () => console.log("View all meal plans");
	const handleSearch = () => console.log("Search pressed");
	const handleNotifications = () => console.log("Notifications pressed");

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const translateYValue = interpolate(
			scrollY.value,
			[0, 100],
			[0, -8],
			Extrapolation.CLAMP,
		);

		const shadowOpacity = interpolate(
			scrollY.value,
			[0, 40],
			[0, 0.2],
			Extrapolation.CLAMP,
		);

		return {
			transform: [{ translateY: translateYValue }],
			shadowOpacity,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowRadius: 3,
			elevation: scrollY.value > 20 ? 4 : 0,
		};
	});

	const progressBarStyle = useAnimatedStyle(() => {
		return {
			width: `${progressAnim.value * 100}%`,
		};
	});

	const Header = () => (
		<Animated.View
			style={[
				{
					backgroundColor: theme.colors.primary,
					paddingTop: insets.top,
					zIndex: 10,
				},
				headerAnimatedStyle,
			]}
		>
			{/* Top bar with logo and notifications */}
			<Box
				row
				justifyContent="space-between"
				alignItems="center"
				paddingVertical={8}
				paddingHorizontal="md"
				style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
			>
				<Box
					row
					alignItems="center"
					style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
				>
					<Box
						bg="rgba(255,255,255,0.2)"
						width={theme.sizes.avatarMd}
						height={theme.sizes.avatarMd}
						rounded="md"
						center
						marginRight={isRTL ? 0 : "sm"}
						marginLeft={isRTL ? "sm" : 0}
						onPress={() => console.log("Logo pressed")}
					>
						<Text weight="bold" variant="lg" color="white">
							G
						</Text>
					</Box>

					<Text weight="bold" variant="lg" color="white">
						Green Kitchen
					</Text>
				</Box>

				<Box
					width={theme.sizes.touchTarget}
					height={theme.sizes.touchTarget}
					rounded="round"
					bg="rgba(255,255,255,0.2)"
					center
					onPress={handleNotifications}
				>
					<Ionicons
						name="notifications-outline"
						size={theme.sizes.iconMd}
						color="white"
					/>
					<Box
						width={8}
						height={8}
						rounded="round"
						bg="warning"
						style={{
							position: "absolute",
							top: 10,
							right: 10,
						}}
					/>
				</Box>
			</Box>

			{/* Search bar */}
			<Box
				paddingHorizontal="md"
				paddingBottom="xl"
				style={{
					borderBottomLeftRadius: theme.radius.xl,
					borderBottomRightRadius: theme.radius.xl,
				}}
			>
				<Box
					bg="rgba(255,255,255,0.15)"
					rounded="md"
					row
					alignItems="center"
					paddingHorizontal="md"
					height={theme.sizes.inputHeight}
					onPress={handleSearch}
					style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
				>
					<Ionicons
						name="search"
						size={theme.sizes.iconMd}
						color="rgba(255,255,255,0.9)"
						style={{
							marginRight: isRTL ? 0 : theme.spacing.sm,
							marginLeft: isRTL ? theme.spacing.sm : 0,
						}}
					/>

					<Text variant="md" color="rgba(255,255,255,0.7)" style={{ flex: 1 }}>
						Search meal plans or restaurants
					</Text>
				</Box>
			</Box>
		</Animated.View>
	);

	const ProgressCard = () => (
		<View
			style={{
				marginHorizontal: theme.spacing.md,
				marginTop: -20,
				marginBottom: theme.spacing.md,
			}}
		>
			<Box card elevation="large" padding="md" rounded="lg">
				<Box row alignItems="center" justifyContent="space-between">
					<Box>
						<Text variant="lg" weight="bold" marginBottom={4}>
							Green Kitchen
						</Text>
						<Text variant="sm" color="textSecondary">
							5 of 6 tasks completed
						</Text>
					</Box>

					<View
						style={{
							width: theme.sizes.avatarMd + 6,
							height: theme.sizes.avatarMd + 6,
							borderRadius: (theme.sizes.avatarMd + 6) / 2,
							backgroundColor: theme.colors.primaryLight,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text variant="lg" weight="bold" color="primary">
							83%
						</Text>
					</View>
				</Box>

				<Box
					height={6}
					bg="primaryLight"
					marginTop="md"
					marginBottom="lg"
					rounded="xs"
					style={{ overflow: "hidden" }}
				>
					<Animated.View
						style={[
							{
								height: "100%",
								backgroundColor: theme.colors.primary,
								borderRadius: theme.radius.xs,
							},
							progressBarStyle,
						]}
					/>
				</Box>

				<Box
					row
					justifyContent="space-between"
					style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
				>
					<Box
						bg="cardAlt"
						height={theme.sizes.buttonMd}
						paddingHorizontal="md"
						rounded="button"
						row
						alignItems="center"
						justifyContent="center"
						style={{
							minWidth: 120,
							flexDirection: isRTL ? "row-reverse" : "row",
						}}
						onPress={handleAnalytics}
					>
						<Ionicons
							name="stats-chart"
							size={theme.sizes.iconSm}
							color={theme.colors.text}
							style={{
								marginRight: isRTL ? 0 : theme.spacing.xs,
								marginLeft: isRTL ? theme.spacing.xs : 0,
							}}
						/>
						<Text variant="sm" weight="medium">
							Analytics
						</Text>
					</Box>

					<Box
						bg="primary"
						height={theme.sizes.buttonMd}
						paddingHorizontal="md"
						rounded="button"
						row
						alignItems="center"
						justifyContent="center"
						style={{
							minWidth: 130,
							flexDirection: isRTL ? "row-reverse" : "row",
						}}
						onPress={handleFinishSetup}
					>
						<Text
							variant="sm"
							weight="semibold"
							color="white"
							marginRight={isRTL ? 0 : "xs"}
							marginLeft={isRTL ? "xs" : 0}
						>
							Finish Setup
						</Text>
						<Ionicons
							name={isRTL ? "arrow-back" : "arrow-forward"}
							size={theme.sizes.iconSm}
							color="white"
						/>
					</Box>
				</Box>
			</Box>
		</View>
	);

	const TasksSection = () => (
		<Box marginTop="md" marginHorizontal="md">
			<Text variant="lg" weight="semibold" marginBottom="sm">
				Complete Your Setup
			</Text>

			<Box
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "space-between",
				}}
			>
				{TASKS.map((task) => (
					<View
						key={task.id}
						style={{
							width: "48.5%",
							marginBottom: theme.spacing.sm,
						}}
					>
						<TaskCard
							title={task.title}
							details={task.details}
							completed={task.completed}
							icon={task.icon}
							onPress={() => handleTaskPress(task.id)}
						/>
					</View>
				))}
			</Box>
		</Box>
	);

	const MealPlansSection = () => (
		<Box marginTop="lg">
			<Box
				row
				alignItems="center"
				justifyContent="space-between"
				marginHorizontal="md"
				marginBottom="sm"
				style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
			>
				<Text variant="lg" weight="semibold">
					Your Meal Plans
				</Text>

				<Box
					onPress={handleViewAllMealPlans}
					paddingVertical="xs"
					paddingHorizontal="sm"
				>
					<Text color="primary" weight="medium" variant="sm">
						View All
					</Text>
				</Box>
			</Box>
			<View>
				<CategoryFilters
					categories={MEAL_TYPES}
					selectedCategory={selectedType}
					onSelectCategory={setSelectedType}
				/>
			</View>
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
				{MEAL_PLANS.filter(
					(plan) => selectedType === "All" || plan.diet === selectedType,
				).map((plan) => (
					<Box key={plan.id}>
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
		</Box>
	);

	const RestaurantsSection = () => (
		<Box marginTop="lg" marginHorizontal="md" marginBottom="xl">
			<Text variant="lg" weight="semibold" marginBottom="sm">
				Active Restaurants
			</Text>

			{RESTAURANTS.map((restaurant) => (
				<View key={restaurant.id}>
					<RestaurantCard
						name={restaurant.name}
						items={restaurant.items}
						onPress={() => handleRestaurantPress(restaurant.id)}
					/>
				</View>
			))}
		</Box>
	);

	return (
		<Box flex={1} bg="background">
			<Header />
			<Animated.ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
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
				<ProgressCard />
				<TasksSection />
				<MealPlansSection />
				<RestaurantsSection />
			</Animated.ScrollView>
		</Box>
	);
};

export default HomeScreen;

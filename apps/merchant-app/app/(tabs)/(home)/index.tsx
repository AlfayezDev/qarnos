import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, Text, Animated } from "react-native";
import { Screen } from "expo-router/build/views/Screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing } from "@/constants/Spacing";

// Import our components
import HeaderSection from "@/components/header";
import ProgressStatusCard from "@/components/progress-status-card";
import TaskCard from "@/components/task-card";
import CategoryFilters from "@/components/category-filters";
import MealPlanCard from "@/components/meal-plan-card";
import RestaurantCard from "@/components/restaurant-card";

// Types for our data
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
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];

	const [selectedType, setSelectedType] = useState<string>("All");
	const progressAnim = useRef(new Animated.Value(0)).current;
	const opacityAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Animate progress
		Animated.timing(progressAnim, {
			toValue: 5 / 6, // 5 of 6 tasks completed
			duration: 1000,
			useNativeDriver: false,
		}).start();

		// Fade in card
		Animated.timing(opacityAnim, {
			toValue: 1,
			duration: 800,
			useNativeDriver: true,
		}).start();
	}, []);

	const handleAnalytics = (): void => {
		console.log("Analytics pressed");
	};

	const handleFinishSetup = (): void => {
		console.log("Finish setup pressed");
	};

	const handleTaskPress = (taskId: number): void => {
		console.log(`Task ${taskId} pressed`);
	};

	const handleRestaurantPress = (restaurantId: number): void => {
		console.log(`Restaurant ${restaurantId} pressed`);
	};

	const handleMealPlanPress = (mealPlanId: number): void => {
		console.log(`Meal plan ${mealPlanId} pressed`);
	};

	return (
		<>
			<Screen options={{ headerShown: false }} />
			<View style={{ flex: 1, backgroundColor: tokens.background }}>
				{/* Header with Search */}
				<HeaderSection
					restaurantName="Green Kitchen"
					restaurantLogo="https://example.com/logo.png" // Optional, will use first letter if not provided
					onLogoPress={() => console.log("Logo pressed")}
					onNotificationPress={() => console.log("Notifications pressed")}
				/>
				<ScrollView
					contentContainerStyle={{ paddingVertical: 30 }}
					showsVerticalScrollIndicator={false}
				>
					{/* Progress Status Card */}
					<Animated.View style={{ opacity: opacityAnim }}>
						<ProgressStatusCard
							restaurantName="Green Kitchen"
							completedTasks={5}
							totalTasks={6}
							onAnalytics={handleAnalytics}
							onFinish={handleFinishSetup}
							progressAnim={progressAnim}
						/>
					</Animated.View>

					{/* Tasks Section */}
					<View
						style={{
							marginTop: QarnSpacing.sm,
							marginHorizontal: QarnSpacing.md,
						}}
					>
						<Text
							style={{
								fontSize: 17,
								fontWeight: "600",
								color: tokens.text,
								marginBottom: QarnSpacing.sm,
							}}
						>
							Complete Your Setup
						</Text>

						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								justifyContent: "space-between",
							}}
						>
							{TASKS.map((task) => (
								<View
									key={task.id}
									style={{ width: "48.5%", marginBottom: QarnSpacing.sm }}
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
						</View>
					</View>

					{/* Meal Plans Section */}
					<View
						style={{ marginTop: QarnSpacing.sm, marginBottom: QarnSpacing.sm }}
					>
						<View
							style={{
								marginHorizontal: QarnSpacing.md,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text
								style={{
									fontSize: 17,
									fontWeight: "600",
									color: tokens.text,
								}}
							>
								Your Meal Plans
							</Text>
							<Text
								style={{
									color: tokens.primary,
									fontWeight: "500",
									fontSize: 14,
									padding: QarnSpacing.sm,
								}}
							>
								View All
							</Text>
						</View>

						{/* Category Filters */}
						<CategoryFilters
							categories={MEAL_TYPES}
							selectedCategory={selectedType}
							onSelectCategory={setSelectedType}
						/>

						{/* Meal Plan Cards */}
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								paddingLeft: QarnSpacing.md,
								paddingBottom: QarnSpacing.sm,
							}}
							snapToInterval={260 + QarnSpacing.md}
							decelerationRate="fast"
						>
							{MEAL_PLANS.filter(
								(plan) => selectedType === "All" || plan.diet === selectedType,
							).map((plan) => (
								<MealPlanCard
									key={plan.id}
									title={plan.title}
									price={plan.price}
									calories={plan.calories}
									image={plan.image}
									meals={plan.meals}
									diet={plan.diet}
									onPress={() => handleMealPlanPress(plan.id)}
								/>
							))}
						</ScrollView>
					</View>

					{/* Restaurants Section */}
					<View
						style={{
							marginTop: QarnSpacing.sm,
							marginHorizontal: QarnSpacing.md,
						}}
					>
						<Text
							style={{
								fontSize: 17,
								fontWeight: "600",
								color: tokens.text,
								marginBottom: QarnSpacing.sm,
							}}
						>
							Active Restaurants
						</Text>

						{RESTAURANTS.map((restaurant) => (
							<RestaurantCard
								key={restaurant.id}
								name={restaurant.name}
								items={restaurant.items}
								onPress={() => handleRestaurantPress(restaurant.id)}
							/>
						))}
					</View>
				</ScrollView>
			</View>
		</>
	);
};

export default HomeScreen;

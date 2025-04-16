import React, { useState } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Platform,
} from "react-native";
import { Screen } from "expo-router/build/views/Screen";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
import CategoryFilters from "@/components/category-filters";
import MealPlanCard from "@/components/meal-plan-card";

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

const MealsScreen: React.FC = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];

	const [selectedType, setSelectedType] = useState<string>("All");
	const [searchQuery, setSearchQuery] = useState<string>("");

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

	const handleMealPlanPress = (mealPlanId: number) => {
		console.log(`Meal plan ${mealPlanId} pressed`);
	};

	const handleAddMealPlan = () => {
		console.log("Add new meal plan");
	};

	const filteredMealPlans = MEAL_PLANS.filter(
		(plan) =>
			(selectedType === "All" || plan.diet === selectedType) &&
			(!searchQuery ||
				plan.title.toLowerCase().includes(searchQuery.toLowerCase())),
	);

	const featuredMealPlans = filteredMealPlans.filter((plan) => plan.featured);
	const regularMealPlans = filteredMealPlans.filter((plan) => !plan.featured);

	return (
		<>
			<Screen options={{ headerShown: false }} />
			<View style={{ flex: 1, backgroundColor: tokens.background }}>
				{/* Header */}
				<View
					style={{
						backgroundColor: tokens.primary,
						paddingTop: Platform.OS === "ios" ? 50 : 16,
						paddingBottom: QarnSpacing.lg,
						paddingHorizontal: QarnSpacing.md,
					}}
				>
					<View
						style={{
							marginBottom: QarnSpacing.md,
						}}
					>
						<Text
							style={{
								color: "white",
								fontWeight: QarnTypography.weights.bold,
								fontSize: QarnTypography.sizes.xl,
							}}
						>
							Meal Plans
						</Text>
					</View>

					{/* Search Bar */}
					<TouchableOpacity
						style={{
							backgroundColor: "rgba(255,255,255,0.15)",
							borderRadius: QarnRadius.md,
							flexDirection: "row",
							alignItems: "center",
							paddingHorizontal: QarnSpacing.md,
							height: QarnSizes.inputHeight,
						}}
						activeOpacity={0.8}
					>
						<Ionicons
							name="search"
							size={QarnSizes.iconMd}
							color="rgba(255,255,255,0.9)"
							style={{ marginRight: QarnSpacing.sm }}
						/>
						<TextInput
							placeholder="Search meal plans"
							placeholderTextColor="rgba(255,255,255,0.7)"
							style={{
								flex: 1,
								fontSize: QarnTypography.sizes.md,
								color: "#FFFFFF",
								height: QarnSizes.inputHeight,
							}}
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
						{searchQuery ? (
							<TouchableOpacity
								onPress={() => setSearchQuery("")}
								style={{
									padding: QarnSpacing.xs,
									height: QarnSizes.touchTarget,
									width: QarnSizes.touchTarget,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Ionicons
									name="close-circle"
									size={QarnSizes.iconMd}
									color="rgba(255,255,255,0.9)"
								/>
							</TouchableOpacity>
						) : null}
					</TouchableOpacity>
				</View>

				{/* Content */}
				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ paddingBottom: QarnSpacing.xl }}
					showsVerticalScrollIndicator={false}
				>
					{/* Category Filters */}
					<CategoryFilters
						categories={MEAL_TYPES}
						selectedCategory={selectedType}
						onSelectCategory={setSelectedType}
					/>

					{/* Stats Bar */}
					<View
						style={{
							flexDirection: "row",
							backgroundColor: tokens.card,
							margin: QarnSpacing.md,
							borderRadius: QarnRadius.lg,
							overflow: "hidden",
							...shadows.medium,
						}}
					>
						<View
							style={{
								flex: 1,
								paddingVertical: QarnSpacing.md,
								alignItems: "center",
								borderRightWidth: 1,
								borderRightColor: tokens.divider,
							}}
						>
							<Text
								style={{
									fontSize: QarnTypography.sizes.lg,
									fontWeight: QarnTypography.weights.bold,
									color: tokens.primary,
									marginBottom: 4,
								}}
							>
								{filteredMealPlans.length}
							</Text>
							<Text
								style={{
									fontSize: QarnTypography.sizes.sm,
									color: tokens.textSecondary,
								}}
							>
								Active Plans
							</Text>
						</View>

						<View
							style={{
								flex: 1,
								paddingVertical: QarnSpacing.md,
								alignItems: "center",
								borderRightWidth: 1,
								borderRightColor: tokens.divider,
							}}
						>
							<Text
								style={{
									fontSize: QarnTypography.sizes.lg,
									fontWeight: QarnTypography.weights.bold,
									color: tokens.info,
									marginBottom: 4,
								}}
							>
								12
							</Text>
							<Text
								style={{
									fontSize: QarnTypography.sizes.sm,
									color: tokens.textSecondary,
								}}
							>
								Subscribers
							</Text>
						</View>

						<View
							style={{
								flex: 1,
								paddingVertical: QarnSpacing.md,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									fontSize: QarnTypography.sizes.lg,
									fontWeight: QarnTypography.weights.bold,
									color: tokens.success,
									marginBottom: 4,
								}}
							>
								$968
							</Text>
							<Text
								style={{
									fontSize: QarnTypography.sizes.sm,
									color: tokens.textSecondary,
								}}
							>
								Monthly
							</Text>
						</View>
					</View>

					{/* Featured Plans */}
					{featuredMealPlans.length > 0 && (
						<View style={{ marginTop: QarnSpacing.sm }}>
							<Text
								style={{
									fontSize: QarnTypography.sizes.lg,
									fontWeight: QarnTypography.weights.semibold,
									color: tokens.text,
									marginHorizontal: QarnSpacing.md,
									marginBottom: QarnSpacing.sm,
								}}
							>
								Featured Plans
							</Text>

							{featuredMealPlans.map((plan) => (
								<View
									key={plan.id}
									style={{
										marginHorizontal: QarnSpacing.md,
										marginBottom: QarnSpacing.md,
									}}
								>
									{/* Using a custom style for featured plans - horizontal layout */}
									<TouchableOpacity
										style={{
											flexDirection: "row",
											backgroundColor: tokens.card,
											borderRadius: QarnRadius.lg,
											overflow: "hidden",
											...shadows.medium,
										}}
										onPress={() => handleMealPlanPress(plan.id)}
										activeOpacity={0.7}
									>
										<View
											style={{
												width: 120,
												backgroundColor: isDark ? tokens.cardAlt : "#EFEFEF",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Ionicons
												name={plan.image as any}
												size={QarnSizes.iconLg}
												color={tokens.primary}
											/>
										</View>

										<View
											style={{
												flex: 1,
												padding: QarnSpacing.md,
												justifyContent: "center",
											}}
										>
											<View
												style={{
													flexDirection: "row",
													justifyContent: "space-between",
													alignItems: "center",
													marginBottom: 4,
												}}
											>
												<Text
													style={{
														fontSize: QarnTypography.sizes.md,
														fontWeight: QarnTypography.weights.semibold,
														color: tokens.text,
													}}
												>
													{plan.title}
												</Text>

												<Text
													style={{
														fontSize: QarnTypography.sizes.md,
														fontWeight: QarnTypography.weights.bold,
														color: tokens.primary,
													}}
												>
													${plan.price}
												</Text>
											</View>

											<Text
												style={{
													fontSize: QarnTypography.sizes.sm,
													color: tokens.textSecondary,
													marginBottom: QarnSpacing.sm,
												}}
											>
												{plan.description}
											</Text>

											<View style={{ flexDirection: "row" }}>
												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
														marginEnd: QarnSpacing.md,
													}}
												>
													<Ionicons
														name="flame-outline"
														size={QarnSizes.iconXs}
														color={tokens.textSecondary}
													/>
													<Text
														style={{
															fontSize: QarnTypography.sizes.xs,
															color: tokens.textSecondary,
															marginLeft: 4,
														}}
													>
														{plan.calories} cal
													</Text>
												</View>

												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
													}}
												>
													<Ionicons
														name="restaurant-outline"
														size={QarnSizes.iconXs}
														color={tokens.textSecondary}
													/>
													<Text
														style={{
															fontSize: QarnTypography.sizes.xs,
															color: tokens.textSecondary,
															marginLeft: 4,
														}}
													>
														{plan.meals} meals
													</Text>
												</View>
											</View>
										</View>
									</TouchableOpacity>
								</View>
							))}
						</View>
					)}

					{/* All Meal Plans Grid */}
					<Text
						style={{
							fontSize: QarnTypography.sizes.lg,
							fontWeight: QarnTypography.weights.semibold,
							color: tokens.text,
							marginHorizontal: QarnSpacing.md,
							marginTop: QarnSpacing.md,
							marginBottom: QarnSpacing.sm,
						}}
					>
						All Meal Plans
					</Text>

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
						{regularMealPlans.map((plan) => (
							<View
								key={plan.id}
								style={{
									marginBottom: QarnSpacing.sm,
								}}
							>
								<MealPlanCard
									title={plan.title}
									price={plan.price}
									calories={plan.calories}
									image={plan.image}
									meals={plan.meals}
									diet={plan.diet}
									onPress={() => handleMealPlanPress(plan.id)}
								/>
							</View>
						))}
					</ScrollView>
				</ScrollView>

				<TouchableOpacity
					style={{
						position: "absolute",
						bottom: QarnSpacing.xl,
						end: QarnSpacing.lg,
						backgroundColor: tokens.primary,
						height: 60,
						width: 60,
						borderRadius: 30,
						alignItems: "center",
						justifyContent: "center",
						elevation: 5,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.25,
						shadowRadius: 3.84,
					}}
					onPress={handleAddMealPlan}
				>
					<Ionicons name="add" size={32} color="white" />
				</TouchableOpacity>
			</View>
		</>
	);
};

export default MealsScreen;

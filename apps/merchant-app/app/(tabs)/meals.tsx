import React, { useState, useRef } from "react";
import {
	View,
	ScrollView,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	interpolate,
	Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Text, Badge, Button } from "@/components/ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
	tags?: string[];
	subscriptions?: number;
}

interface DietType {
	id: string;
	name: string;
	icon: string;
}

const MealsScreen: React.FC = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);
	const [activeDiet, setActiveDiet] = useState<string>("all");
	const [activeTab, setActiveTab] = useState<"all" | "featured">("all");
	const scrollY = useSharedValue(0);
	const scrollRef = useRef<Animated.ScrollView>(null);

	// Diet types with icons
	const DIET_TYPES: DietType[] = [
		{ id: "all", name: "All Plans", icon: "restaurant-outline" },
		{ id: "keto", name: "Keto", icon: "nutrition-outline" },
		{ id: "vegan", name: "Vegan", icon: "leaf-outline" },
		{ id: "paleo", name: "Paleo", icon: "barbell-outline" },
		{ id: "lowcarb", name: "Low-Carb", icon: "fitness-outline" },
		{ id: "vegetarian", name: "Vegetarian", icon: "flower-outline" },
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
			diet: "keto",
			featured: true,
			description: "High fat, low carb meals designed for ketosis",
			tags: ["Gluten-Free", "High Protein"],
			subscriptions: 42,
		},
		{
			id: 2,
			title: "Plant Power",
			price: "79",
			calories: "1,200",
			image: "leaf-outline",
			meals: "7",
			diet: "vegan",
			description: "100% plant-based meals rich in nutrients",
			tags: ["Organic", "Plant-Based"],
			subscriptions: 28,
		},
		{
			id: 3,
			title: "Paleo Basics",
			price: "95",
			calories: "1,800",
			image: "barbell-outline",
			meals: "6",
			diet: "paleo",
			featured: true,
			description: "Whole foods based on our ancestral diet",
			tags: ["Grain-Free", "High Protein"],
			subscriptions: 35,
		},
		{
			id: 4,
			title: "Vegetarian Delight",
			price: "75",
			calories: "1,400",
			image: "flower-outline",
			meals: "5",
			diet: "vegetarian",
			description: "Meat-free meals with dairy and eggs",
			tags: ["Lacto-Ovo", "Plant-Forward"],
			subscriptions: 31,
		},
		{
			id: 5,
			title: "Low-Carb Classic",
			price: "85",
			calories: "1,600",
			image: "fitness-outline",
			meals: "5",
			diet: "lowcarb",
			description: "Reduced carb meals for steady energy",
			tags: ["Diabetes-Friendly", "Weight Loss"],
			subscriptions: 24,
		},
		{
			id: 6,
			title: "Keto Lite",
			price: "69",
			calories: "1,300",
			image: "nutrition-outline",
			meals: "4",
			diet: "keto",
			description: "A lighter version of our keto plan",
			tags: ["Beginner-Friendly", "Budget"],
			subscriptions: 19,
		},
	];

	const filteredMealPlans = MEAL_PLANS.filter(
		(plan) => activeDiet === "all" || plan.diet === activeDiet,
	).filter(
		(plan) =>
			activeTab === "all" || (activeTab === "featured" && plan.featured),
	);

	const featuredMealPlans = MEAL_PLANS.filter((plan) => plan.featured === true);

	// Handle refresh
	const handleRefresh = () => {
		setRefreshing(true);
		// Simulate API call
		setTimeout(() => {
			setRefreshing(false);
		}, 1500);
	};

	// Scroll handler for animations
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	// Header animations
	const headerStyle = useAnimatedStyle(() => {
		const height = interpolate(
			scrollY.value,
			[0, 120],
			[200, 120],
			Extrapolation.CLAMP,
		);

		const opacity = interpolate(
			scrollY.value,
			[60, 120],
			[1, 0],
			Extrapolation.CLAMP,
		);

		return {
			height,
			opacity,
		};
	});

	const headerTextStyle = useAnimatedStyle(() => {
		const scale = interpolate(
			scrollY.value,
			[0, 120],
			[1, 0.85],
			Extrapolation.CLAMP,
		);

		const translateY = interpolate(
			scrollY.value,
			[0, 120],
			[0, -10],
			Extrapolation.CLAMP,
		);

		return {
			transform: [{ scale }, { translateY }],
		};
	});

	const compactHeaderStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[100, 130],
			[0, 1],
			Extrapolation.CLAMP,
		);

		return {
			opacity,
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			zIndex: 100,
		};
	});

	// Diet type selector
	const DietTypeSelector = () => (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				paddingHorizontal: theme.spacing.md,
				paddingVertical: theme.spacing.sm,
				gap: theme.spacing.sm,
			}}
		>
			{DIET_TYPES.map((diet) => (
				<TouchableOpacity
					key={diet.id}
					style={{
						backgroundColor:
							activeDiet === diet.id
								? theme.colors.primary
								: theme.colors.cardAlt,
						borderRadius: theme.radius.lg,
						padding: theme.spacing.sm,
						paddingHorizontal: theme.spacing.md,
						flexDirection: "row",
						alignItems: "center",
						height: 40,
						minWidth: 100,
						justifyContent: "center",
					}}
					onPress={() => setActiveDiet(diet.id)}
					activeOpacity={0.7}
				>
					<Ionicons
						name={diet.icon as any}
						size={18}
						color={activeDiet === diet.id ? "white" : theme.colors.primary}
						style={{ marginRight: 8 }}
					/>
					<Text
						variant="sm"
						weight="medium"
						color={activeDiet === diet.id ? "white" : "text"}
					>
						{diet.name}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);

	// Tabs switcher
	const TabSwitcher = () => (
		<View
			style={{
				flexDirection: "row",
				paddingHorizontal: theme.spacing.md,
				marginTop: theme.spacing.md,
				marginBottom: theme.spacing.sm,
			}}
		>
			<TouchableOpacity
				style={{
					borderBottomWidth: 2,
					borderBottomColor:
						activeTab === "all" ? theme.colors.primary : "transparent",
					paddingBottom: theme.spacing.xs,
					marginRight: theme.spacing.lg,
				}}
				onPress={() => setActiveTab("all")}
			>
				<Text
					variant="md"
					weight={activeTab === "all" ? "semibold" : "medium"}
					color={activeTab === "all" ? "primary" : "textSecondary"}
				>
					All Plans
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					borderBottomWidth: 2,
					borderBottomColor:
						activeTab === "featured" ? theme.colors.primary : "transparent",
					paddingBottom: theme.spacing.xs,
				}}
				onPress={() => setActiveTab("featured")}
			>
				<Text
					variant="md"
					weight={activeTab === "featured" ? "semibold" : "medium"}
					color={activeTab === "featured" ? "primary" : "textSecondary"}
				>
					Featured
				</Text>
			</TouchableOpacity>
		</View>
	);

	// Enhanced Meal Plan Card
	const EnhancedMealPlanCard = ({ plan }: { plan: MealPlan }) => (
		<Pressable
			style={({ pressed }) => ({
				backgroundColor: theme.colors.card,
				borderRadius: theme.radius.lg,
				marginBottom: theme.spacing.md,
				overflow: "hidden",
				...theme.shadows.medium,
				opacity: pressed ? 0.9 : 1,
			})}
			onPress={() => console.log(`Meal plan ${plan.id} pressed`)}
		>
			{/* Top section with image and diet badge */}
			<View
				style={{
					height: 120,
					backgroundColor: theme.colors.primaryLight,
					justifyContent: "center",
					alignItems: "center",
					position: "relative",
				}}
			>
				<Ionicons
					name={plan.image as any}
					size={60}
					color={theme.colors.primary}
				/>

				{plan.featured && (
					<Badge
						text="Featured"
						variant="primary"
						style={{
							position: "absolute",
							top: theme.spacing.sm,
							right: theme.spacing.sm,
						}}
					/>
				)}

				<View
					style={{
						position: "absolute",
						bottom: theme.spacing.sm,
						left: theme.spacing.sm,
						backgroundColor: "rgba(255,255,255,0.9)",
						paddingHorizontal: theme.spacing.sm,
						paddingVertical: 4,
						borderRadius: theme.radius.sm,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Ionicons name="flame" size={14} color="#FF9500" />
					<Text variant="xs" weight="medium" style={{ marginLeft: 4 }}>
						{plan.calories} cal
					</Text>
				</View>
			</View>

			{/* Content section */}
			<View style={{ padding: theme.spacing.md }}>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<Text variant="lg" weight="semibold" style={{ flex: 1 }}>
						{plan.title}
					</Text>
					<Text variant="lg" weight="bold" color="primary">
						${plan.price}
					</Text>
				</View>

				<Text
					variant="sm"
					color="textSecondary"
					style={{ marginTop: 4, marginBottom: 8 }}
				>
					{plan.description}
				</Text>

				{/* Tags */}
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						marginBottom: 12,
						gap: 6,
					}}
				>
					{plan.tags?.map((tag) => (
						<View
							key={`plan-tag-${tag}`}
							style={{
								backgroundColor: theme.colors.cardAlt,
								paddingHorizontal: 8,
								paddingVertical: 4,
								borderRadius: theme.radius.sm,
							}}
						>
							<Text variant="xs" color="textSecondary">
								{tag}
							</Text>
						</View>
					))}
				</View>

				{/* Bottom stats */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons
							name="calendar-outline"
							size={16}
							color={theme.colors.textSecondary}
						/>
						<Text variant="sm" color="textSecondary" style={{ marginLeft: 4 }}>
							{plan.meals} meals weekly
						</Text>
					</View>

					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Ionicons
							name="people-outline"
							size={16}
							color={theme.colors.textSecondary}
						/>
						<Text variant="sm" color="textSecondary" style={{ marginLeft: 4 }}>
							{plan.subscriptions} subscribers
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);

	// Compact Header (appears when scrolling)
	const CompactHeader = () => (
		<Animated.View
			style={[
				{
					backgroundColor: theme.colors.background,
					paddingTop: insets.top,
					paddingHorizontal: theme.spacing.md,
					paddingBottom: theme.spacing.sm,
					borderBottomWidth: 1,
					borderBottomColor: theme.colors.divider,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				},
				compactHeaderStyle,
			]}
		>
			<Text variant="lg" weight="bold">
				Meal Plans
			</Text>

			<View style={{ flexDirection: "row", gap: 16 }}>
				<TouchableOpacity>
					<Ionicons name="search" size={24} color={theme.colors.text} />
				</TouchableOpacity>
				<TouchableOpacity>
					<Ionicons
						name="options-outline"
						size={24}
						color={theme.colors.text}
					/>
				</TouchableOpacity>
			</View>
		</Animated.View>
	);

	// Full Header (collapses when scrolling)
	const FullHeader = () => (
		<Animated.View
			style={[
				{
					backgroundColor: theme.colors.primary,
					paddingTop: insets.top + theme.spacing.sm,
					padding: theme.spacing.md,
					overflow: "hidden",
				},
				headerStyle,
			]}
		>
			<Animated.View style={headerTextStyle}>
				<Text
					variant="xxl"
					weight="bold"
					color="white"
					style={{ marginBottom: 8 }}
				>
					Meal Plans
				</Text>
				<Text
					variant="md"
					color="rgba(255,255,255,0.8)"
					style={{ marginBottom: 16 }}
				>
					Discover your perfect meal subscription
				</Text>

				<View
					style={{
						flexDirection: "row",
						backgroundColor: "rgba(255,255,255,0.15)",
						padding: 12,
						borderRadius: theme.radius.md,
						alignItems: "center",
						marginTop: theme.spacing.sm,
					}}
				>
					<Ionicons
						name="search"
						size={20}
						color="rgba(255,255,255,0.9)"
						style={{ marginRight: 8 }}
					/>
					<Text color="rgba(255,255,255,0.7)">Search meal plans...</Text>
				</View>
			</Animated.View>
		</Animated.View>
	);

	// Stats Card
	const StatsCard = () => (
		<View
			style={{
				marginHorizontal: theme.spacing.md,
				marginBottom: theme.spacing.md,
			}}
		>
			<View
				style={{
					backgroundColor: theme.colors.card,
					borderRadius: theme.radius.lg,
					padding: theme.spacing.sm,
					...theme.shadows.small,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 12,
					}}
				>
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: theme.colors.primaryLight,
							alignItems: "center",
							justifyContent: "center",
							marginRight: 12,
						}}
					>
						<Ionicons
							name="analytics-outline"
							size={22}
							color={theme.colors.primary}
						/>
					</View>
					<View>
						<Text variant="md" weight="semibold">
							Meal Plan Overview
						</Text>
						<Text variant="xs" color="textSecondary">
							Updated today
						</Text>
					</View>
				</View>

				<View style={{ flexDirection: "row" }}>
					<View
						style={{ flex: 1, alignItems: "center", padding: theme.spacing.sm }}
					>
						<Text variant="lg" weight="bold" color="primary">
							{MEAL_PLANS.length}
						</Text>
						<Text variant="xs" color="textSecondary">
							Total Plans
						</Text>
					</View>

					<View
						style={{
							flex: 1,
							alignItems: "center",
							padding: theme.spacing.sm,
							borderLeftWidth: 1,
							borderRightWidth: 1,
							borderColor: theme.colors.divider,
						}}
					>
						<Text variant="lg" weight="bold" color="success">
							145
						</Text>
						<Text variant="xs" color="textSecondary">
							Subscribers
						</Text>
					</View>

					<View
						style={{ flex: 1, alignItems: "center", padding: theme.spacing.sm }}
					>
						<Text variant="lg" weight="bold" color="info">
							$1.2k
						</Text>
						<Text variant="xs" color="textSecondary">
							Revenue
						</Text>
					</View>
				</View>
			</View>
		</View>
	);

	// Trending Section
	const TrendingSection = () => (
		<View style={{ marginBottom: theme.spacing.lg }}>
			<Text
				variant="lg"
				weight="semibold"
				style={{
					marginHorizontal: theme.spacing.md,
					marginBottom: theme.spacing.sm,
				}}
			>
				Trending Now
			</Text>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingLeft: theme.spacing.md,
					paddingRight: theme.spacing.md,
					gap: theme.spacing.md,
				}}
			>
				{featuredMealPlans.map((plan) => (
					<Pressable
						key={plan.id}
						style={({ pressed }) => ({
							width: SCREEN_WIDTH * 0.7,
							backgroundColor: theme.colors.card,
							borderRadius: theme.radius.lg,
							overflow: "hidden",
							...theme.shadows.small,
							opacity: pressed ? 0.9 : 1,
						})}
						onPress={() => console.log(`Featured plan ${plan.id} pressed`)}
					>
						<View
							style={{
								height: 100,
								backgroundColor: theme.colors.primaryLight,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Ionicons
								name={plan.image as any}
								size={40}
								color={theme.colors.primary}
							/>
						</View>

						<View style={{ padding: theme.spacing.md }}>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Badge
									text={
										DIET_TYPES.find((d) => d.id === plan.diet)?.name ||
										plan.diet
									}
									variant="primary"
								/>
								<Text variant="md" weight="bold" color="primary">
									${plan.price}
								</Text>
							</View>

							<Text variant="md" weight="semibold" style={{ marginTop: 8 }}>
								{plan.title}
							</Text>
							<Text
								variant="sm"
								color="textSecondary"
								style={{ marginTop: 2 }}
								numberOfLines={2}
							>
								{plan.description}
							</Text>

							<View
								style={{
									flexDirection: "row",
									marginTop: 12,
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Ionicons
										name="flame-outline"
										size={16}
										color={theme.colors.textSecondary}
									/>
									<Text
										variant="xs"
										color="textSecondary"
										style={{ marginLeft: 4 }}
									>
										{plan.calories} cal
									</Text>
								</View>

								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Ionicons
										name="calendar-outline"
										size={16}
										color={theme.colors.textSecondary}
									/>
									<Text
										variant="xs"
										color="textSecondary"
										style={{ marginLeft: 4 }}
									>
										{plan.meals} meals
									</Text>
								</View>
							</View>
						</View>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);

	// Content section with meal plans
	const MealPlansContent = () => (
		<>
			{filteredMealPlans.length === 0 ? (
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						padding: theme.spacing.xl,
						marginTop: theme.spacing.xl,
					}}
				>
					<Ionicons
						name="restaurant-outline"
						size={48}
						color={theme.colors.textSecondary}
						style={{ marginBottom: 16 }}
					/>
					<Text
						variant="md"
						weight="medium"
						color="textSecondary"
						style={{ textAlign: "center" }}
					>
						No meal plans found
					</Text>
					<Text
						variant="sm"
						color="textSecondary"
						style={{ textAlign: "center", marginTop: 8 }}
					>
						Try selecting a different diet type or create a new plan
					</Text>
					<Button
						title="Create Meal Plan"
						variant="primary"
						size="md"
						leftIcon="add"
						style={{ marginTop: 24 }}
					/>
				</View>
			) : (
				<View style={{ paddingHorizontal: theme.spacing.md }}>
					{filteredMealPlans.map((plan) => (
						<EnhancedMealPlanCard key={plan.id} plan={plan} />
					))}
				</View>
			)}
		</>
	);

	// Floating Action Button
	const FloatingActionButton = () => (
		<TouchableOpacity
			style={{
				position: "absolute",
				bottom: insets.bottom + theme.spacing.md,
				right: theme.spacing.md,
				width: 56,
				height: 56,
				borderRadius: 28,
				backgroundColor: theme.colors.primary,
				alignItems: "center",
				justifyContent: "center",
				elevation: 4,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.3,
				shadowRadius: 3,
			}}
			onPress={() => console.log("Add new meal plan")}
		>
			<Ionicons name="add" size={28} color="white" />
		</TouchableOpacity>
	);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<CompactHeader />

			<Animated.ScrollView
				ref={scrollRef}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
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
				<FullHeader />

				<StatsCard />

				<TrendingSection />

				<DietTypeSelector />

				<TabSwitcher />

				<MealPlansContent />
			</Animated.ScrollView>

			<FloatingActionButton />
		</View>
	);
};

export default MealsScreen;

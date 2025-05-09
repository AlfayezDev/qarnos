import React, { useState, useMemo } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	FadeInUp,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
	interpolate,
	Extrapolate,
} from "react-native-reanimated";
import { Text } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MealCard from "@/components/meal/MealCard";
import { useMealStore } from "@/stores/mealStore";
import { useTheme } from "@/stores/themeStore";
import { useTranslation } from "@/stores/translationStore";
import { BlurView } from "expo-blur";
import { Platform } from "react-native";

// Creates a simple noise texture overlay using multiple dot patterns
export const createNoiseTexture = (isDark: boolean) => {
	const androidOpacity = 0.4;
	const iosOpacity = 0.1;
	const baseOpacity = Platform.OS === "android" ? androidOpacity : iosOpacity;

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				opacity: baseOpacity, // Higher opacity for Android
			}}
		>
			{/* First layer of noise dots - larger */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "transparent",
					backgroundImage: isDark
						? `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`
						: `radial-gradient(rgba(0, 0, 0, 0.3) 1px, transparent 1px)`,
					backgroundSize: "16px 16px",
					backgroundPosition: "0 0",
				}}
			/>

			{/* Second layer of noise dots - medium */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "transparent",
					backgroundImage: isDark
						? `radial-gradient(rgba(255, 255, 255, 0.2) 0.75px, transparent 0.75px)`
						: `radial-gradient(rgba(0, 0, 0, 0.2) 0.75px, transparent 0.75px)`,
					backgroundSize: "12px 12px",
					backgroundPosition: "6px 6px",
				}}
			/>

			{/* Third layer of noise dots - small */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "transparent",
					backgroundImage: isDark
						? `radial-gradient(rgba(255, 255, 255, 0.1) 0.5px, transparent 0.5px)`
						: `radial-gradient(rgba(0, 0, 0, 0.1) 0.5px, transparent 0.5px)`,
					backgroundSize: "8px 8px",
					backgroundPosition: "4px 4px",
				}}
			/>
		</View>
	);
};

// Alternative implementation using a React component
export const NoiseTexture = ({ isDark }: { isDark: boolean }) => {
	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				opacity: 0.1,
			}}
		>
			{/* First layer of noise dots - larger */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "transparent",
					backgroundImage: isDark
						? `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`
						: `radial-gradient(rgba(0, 0, 0, 0.3) 1px, transparent 1px)`,
					backgroundSize: "16px 16px",
					backgroundPosition: "0 0",
				}}
			/>

			{/* Second layer of noise dots - medium */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "transparent",
					backgroundImage: isDark
						? `radial-gradient(rgba(255, 255, 255, 0.2) 0.75px, transparent 0.75px)`
						: `radial-gradient(rgba(0, 0, 0, 0.2) 0.75px, transparent 0.75px)`,
					backgroundSize: "12px 12px",
					backgroundPosition: "6px 6px",
				}}
			/>

			{/* Third layer of noise dots - small */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "transparent",
					backgroundImage: isDark
						? `radial-gradient(rgba(255, 255, 255, 0.1) 0.5px, transparent 0.5px)`
						: `radial-gradient(rgba(0, 0, 0, 0.1) 0.5px, transparent 0.5px)`,
					backgroundSize: "8px 8px",
					backgroundPosition: "4px 4px",
				}}
			/>
		</View>
	);
};

const periods = ["Breakfast", "Lunch", "Dinner"];

const MealScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { meals } = useMealStore();
	const [selectedPeriod, setSelectedPeriod] = useState<string>("Breakfast");

	const filteredMeals = meals.filter((meal) => meal.period === selectedPeriod);
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollY = useScrollViewOffset(scrollRef);

	// Header blur animation
	const headerBlurStyle = useAnimatedStyle(() => ({
		opacity: interpolate(scrollY.value, [-20, 20], [0, 1], Extrapolate.CLAMP),
	}));

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

	// Calculate padding
	const HEADER_HEIGHT = 44 + insets.top;

	return (
		<View style={{ flex: 1 }}>
			{/* Content */}
			<Animated.FlatList
				ref={scrollRef as any}
				entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
				key={"meals-list"}
				data={filteredMeals}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <MealCard item={item} />}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: theme.spacing.md,
					paddingTop: HEADER_HEIGHT + theme.spacing.md,
					paddingBottom: insets.bottom + theme.spacing.xxl,
					gap: theme.spacing.md,
				}}
				ListEmptyComponent={renderEmptyList}
				style={{ zIndex: 2 }}
			/>

			{/* Frosted header with noise */}
			<Animated.View
				style={[
					{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						height: HEADER_HEIGHT,
						zIndex: 10,
						overflow: "hidden",
					},
					headerBlurStyle,
				]}
			>
				{/* Base blur */}
				<BlurView
					experimentalBlurMethod="dimezisBlurView"
					intensity={25}
					tint={theme.isDark ? "dark" : "light"}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					}}
				/>

				{/* Noise overlay */}
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: theme.isDark
							? "rgba(30, 30, 35, 0.45)"
							: "rgba(245, 245, 247, 0.45)",
						opacity: 0.8,
					}}
				/>

				{/* Noise dots (works on native) */}
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					}}
				>
					{useMemo(() => createNoiseTexture(theme.isDark), [theme.isDark])}
				</View>

				{/* Subtle gradient */}
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.1,
						backgroundImage: theme.isDark
							? "linear-gradient(180deg, rgba(30, 30, 35, 0.7) 0%, rgba(25, 25, 30, 0.4) 100%)"
							: "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 245, 250, 0.5) 100%)",
					}}
				/>
			</Animated.View>

			{/* Tabs */}
			<View
				style={{
					position: "absolute",
					top: insets.top + 5, // Adding spacing from top
					left: 0,
					right: 0,
					paddingHorizontal: theme.spacing.md,
					zIndex: 20,
				}}
			>
				<Tabs
					tabs={periods}
					selectedTab={selectedPeriod}
					onSelectTab={setSelectedPeriod}
					labelRender={(tab) => t(`periods.${tab.toLowerCase()}`)}
				/>
			</View>
		</View>
	);
};

export default MealScreen;

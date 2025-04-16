import { Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback, useRef, useMemo } from "react";
import {
	FlatList,
	RefreshControl,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	interpolate,
	Extrapolation,
	FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodayPrepCard } from "@/components/dashboard/PrepCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { Tabs } from "@/components/ui/Tabs";
import { Alert, MealPrepSummary, OverviewStats, StatItem } from "@/types";

const TODAY_PREP_SUMMARY: MealPrepSummary[] = [
	{
		period: "Breakfast",
		totalMeals: 25,
		mealsToPrep: [
			{ id: "shashuka", name: "Shashuka", count: 15 },
			{ id: "oats", name: "Overnight Oats", count: 7 },
			{ id: "smoothie", name: "Green Smoothie", count: 3 },
		],
	},
	{
		period: "Lunch",
		totalMeals: 32,
		mealsToPrep: [
			{ id: "salad_x", name: "Quinoa Salad", count: 18 },
			{ id: "wrap_y", name: "Falafel Wrap", count: 10 },
			{ id: "soup_z", name: "Lentil Soup", count: 4 },
			{ id: "extra1", name: "Side Salad", count: 2 },
		],
	},
	{
		period: "Dinner",
		totalMeals: 28,
		mealsToPrep: [
			{ id: "salmon", name: "Grilled Salmon", count: 12 },
			{ id: "tofu_stirfry", name: "Tofu Stir-fry", count: 9 },
			{ id: "pasta_veg", name: "Veggie Pasta", count: 7 },
		],
	},
];
const getActivityStats = (tab: string): StatItem[] => {
	switch (tab) {
		case "Week":
			return [
				{ title: "Active Subs", value: 52, icon: "people-outline" },
				{ title: "New This Week", value: "+3", icon: "add-circle-outline" },
			];
		case "Month":
			return [
				{ title: "Active Subs", value: 52, icon: "people-outline" },
				{ title: "New This Month", value: "+12", icon: "add-circle-outline" },
			];
		default:
			return [
				{ title: "Active Subs", value: 52, icon: "people-outline" },
				{ title: "Meals Today", value: 85, icon: "restaurant-outline" },
			];
	}
};
const OVERVIEW_STATS: OverviewStats = {
	activeSubscriptions: 52,
	newThisWeek: 3,
};
const ALERTS: Alert[] = [
	{
		id: 1,
		type: "info",
		title: "New 'Keto Weekly' subscriber",
		icon: "person-add-outline",
		timestamp: "3h ago",
	},
	{
		id: 2,
		type: "warning",
		title: "Low inventory: Quinoa",
		icon: "cube-outline",
		timestamp: "1h ago",
	},
	{
		id: 3,
		type: "error",
		title: "Delivery issue Order #12345",
		icon: "car-sport-outline",
		timestamp: "Yesterday",
	},
];
const HEADER_HEIGHT = 65;
const PREP_CARD_WIDTH = 170;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const HomeScreen: React.FC = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);
	const [selectedTab, setSelectedTab] = useState("Today");
	const scrollY = useSharedValue(0);
	const scrollRef = useRef<Animated.ScrollView>(null);

	const tabItems = ["Today", "Week", "Month"];
	const currentStats = useMemo(
		() => getActivityStats(selectedTab),
		[selectedTab],
	);
	const currentDateString = useMemo(
		() =>
			new Date().toLocaleDateString(undefined, {
				weekday: "long",
				month: "short",
				day: "numeric",
			}),
		[],
	);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setTimeout(() => setRefreshing(false), 1200);
	}, []);

	const handleSelectTab = useCallback(
		(tab: string) => {
			if (tab !== selectedTab) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				setSelectedTab(tab);
			}
		},
		[selectedTab],
	);

	const handleViewSchedule = useCallback((period?: string) => {
		console.log("Navigate to Schedule Screen, Filter:", period || "Full");
	}, []);

	const handleViewAlert = useCallback((id: string | number) => {
		console.log("Navigate to Alert Details Screen, ID:", id);
	}, []);

	const handleSettingsPress = useCallback(() => {
		console.log("Navigate to Settings Screen");
	}, []);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const value = scrollY.value;
		const borderOpacity = interpolate(
			value,
			[0, 10],
			[0, 1],
			Extrapolation.CLAMP,
		);
		const shadowOpacity = interpolate(
			value,
			[0, 10],
			[0, theme.isDark ? 0.2 : 0.05],
			Extrapolation.CLAMP,
		);
		return {
			borderBottomColor: theme.colors.divider,
			borderBottomWidth: borderOpacity > 0 ? StyleSheet.hairlineWidth : 0,
			shadowOpacity: shadowOpacity,
			shadowColor: theme.colors.shadow,
			shadowOffset: { width: 0, height: 2 },
			shadowRadius: 3,
			elevation: borderOpacity > 0 ? 2 : 0,
		};
	});

	const renderPrepItem = useCallback(
		({ item }: { item: MealPrepSummary }) => (
			<TodayPrepCard
				summary={item}
				theme={theme}
				onPress={() => handleViewSchedule(item.period)}
			/>
		),
		[theme, handleViewSchedule],
	);
	const keyExtractorPrepItem = useCallback(
		(item: MealPrepSummary) => item.period,
		[],
	);
	return (
		<View style={[{ flex: 1, backgroundColor: theme.colors.background }]}>
			<DashboardHeader
				theme={theme}
				insets={insets}
				animatedStyle={headerAnimatedStyle}
				currentDateString={currentDateString}
				onSettingsPress={handleSettingsPress}
				headerHeight={HEADER_HEIGHT}
			/>
			<AnimatedScrollView
				ref={scrollRef}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingTop: HEADER_HEIGHT + insets.top + theme.spacing.md,
					paddingBottom: insets.bottom + theme.spacing.xxl,
				}}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor={theme.colors.primary}
						colors={[theme.colors.primary]}
						progressBackgroundColor={theme.colors.card}
						progressViewOffset={HEADER_HEIGHT + insets.top + theme.spacing.sm}
					/>
				}
				keyboardShouldPersistTaps="handled"
			>
				<Box marginHorizontal="md" marginBottom="lg">
					<Tabs
						tabs={tabItems}
						selectedTab={selectedTab}
						onSelectTab={handleSelectTab}
						theme={theme}
					/>
				</Box>

				<StatsGrid stats={currentStats} theme={theme} key={selectedTab} />

				<Text
					variant="lg"
					weight="semibold"
					marginHorizontal="md"
					marginBottom="sm"
				>
					Today's Prep
				</Text>
				<Animated.View
					entering={FadeInUp.delay(300).duration(400).springify().damping(15)}
				>
					<FlatList<MealPrepSummary>
						horizontal
						data={TODAY_PREP_SUMMARY}
						keyExtractor={keyExtractorPrepItem}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={[
							{
								paddingHorizontal: theme.spacing.md,
								paddingVertical: theme.spacing.sm,
								gap: theme.spacing.sm,
							},
						]}
						snapToInterval={PREP_CARD_WIDTH + theme.spacing.sm}
						decelerationRate="fast"
						renderItem={renderPrepItem}
					/>
				</Animated.View>

				<ActivityCard
					alerts={ALERTS}
					overviewStats={OVERVIEW_STATS}
					theme={theme}
					onViewAlert={handleViewAlert}
				/>
			</AnimatedScrollView>
		</View>
	);
};

export default HomeScreen;

import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodayPrepCard } from "@/components/dashboard/PrepCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { Box, Text } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { ALERTS, TODAY_PREP_SUMMARY } from "@/data";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState, useCallback, useRef, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	FadeInUp,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 65;
const PREP_CARD_WIDTH = 170;

const HomeScreen: React.FC = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t, language } = useTranslation();

	const [refreshing, setRefreshing] = useState(false);
	const [selectedTab, setSelectedTab] = useState("Today");
	const scrollY = useSharedValue(0);
	const scrollRef = useRef<Animated.FlatList<any>>(null);

	const tabItems = useMemo(() => {
		return ["Today", "Week", "Month"];
	}, [t]);

	const currentStats = useMemo(() => {
		switch (selectedTab) {
			case "Week":
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+3",
						icon: "add-circle-outline",
					},
				];
			case "Month":
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+12",
						icon: "add-circle-outline",
					},
				];
			default:
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+12",
						icon: "add-circle-outline",
					},
				];
		}
	}, [selectedTab]);

	const currentDateString = useMemo(
		() =>
			new Date().toLocaleDateString(language, {
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

	const handleViewAllAlerts = useCallback(() => {
		console.log("Navigate to All Alerts Screen");
	}, []);

	const handleSettingsPress = useCallback(() => {
		router.push("/settings");
	}, []);

	const scrollHandler = useAnimatedScrollHandler((event) => {
		const offsetY = event.contentOffset.y;
		scrollY.value = withTiming(offsetY, { duration: 150 });
	});

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: theme.colors.background,
			shadowColor: theme.colors.shadow,
			// shadowOffset: { width: 0, height: 1 },
			shadowRadius: 3,
			shadowOpacity: scrollY.value > 2 ? (theme.isDark ? 0.3 : 0.1) : 0,
			borderBottomWidth: scrollY.value > 2 ? StyleSheet.hairlineWidth : 0,
			borderBottomColor: theme.colors.divider,
			elevation: scrollY.value > 2 ? 3 : 0,
			zIndex: 1000,
		};
	});

	const renderHeader = useCallback(
		() => (
			<>
				<Box marginHorizontal="md" marginBottom="lg">
					<Tabs
						tabs={tabItems}
						selectedTab={selectedTab}
						onSelectTab={handleSelectTab}
						theme={theme}
						labelRender={(tab) => t(`dashboard.${tab.toLowerCase()}`)}
					/>
				</Box>
				<StatsGrid stats={currentStats} theme={theme} key={selectedTab} />
				<Text
					variant="lg"
					weight="semibold"
					marginHorizontal="md"
					marginBottom="sm"
				>
					{t("dashboard.todaysPrep")}
				</Text>
				<Animated.View
					entering={FadeInUp.delay(300).duration(400).springify().damping(15)}
				>
					<FlatList
						horizontal
						data={TODAY_PREP_SUMMARY}
						keyExtractor={(item) => item.period}
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
						renderItem={({ item }) => (
							<TodayPrepCard
								summary={item}
								theme={theme}
								onPress={() => handleViewSchedule(item.period)}
							/>
						)}
					/>
				</Animated.View>
				<AlertsCard
					alerts={ALERTS}
					theme={theme}
					onViewAlert={handleViewAlert}
					onViewAllAlerts={handleViewAllAlerts}
				/>
			</>
		),
		[
			selectedTab,
			currentStats,
			theme,
			handleSelectTab,
			handleViewSchedule,
			handleViewAlert,
			handleViewAllAlerts,
			t,
			tabItems,
		],
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
			<Animated.FlatList
				ref={scrollRef}
				data={[1]}
				keyExtractor={() => "main"}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingTop: HEADER_HEIGHT + insets.top + theme.spacing.md,
					paddingBottom: insets.bottom + theme.spacing.xxl,
				}}
				getItemLayout={(_, index) => ({
					length: PREP_CARD_WIDTH + theme.spacing.sm,
					offset: (PREP_CARD_WIDTH + theme.spacing.sm) * index,
					index,
				})}
				renderItem={() => renderHeader()}
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
			/>
		</View>
	);
};

export default HomeScreen;

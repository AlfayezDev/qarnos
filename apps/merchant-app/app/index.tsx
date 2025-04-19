import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { TodayPrepCard } from "@/components/dashboard/PrepCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { AnimatedBox, Box } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { Text } from "@/components/ui/Text";
import { ALERTS, TODAY_PREP_SUMMARY } from "@/data";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback, useMemo } from "react";
import { FlatList, ScrollView, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PREP_CARD_WIDTH = 170;

const HomeScreen = React.memo(() => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t, language } = useTranslation();
	const [selectedTab, setSelectedTab] = useState("Today");

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
	}, [selectedTab, t]);

	const currentDateString = useMemo(
		() =>
			new Date().toLocaleDateString(language, {
				weekday: "long",
				month: "short",
				day: "numeric",
			}),
		[language],
	);

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

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<ScrollView
				contentContainerStyle={{
					paddingBottom: theme.spacing.md,
				}}
				showsVerticalScrollIndicator={false}
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
						{currentDateString}
					</Text>
				</Box>
				<AnimatedBox
					marginHorizontal="md"
					gap="lg"
					entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
				>
					<Tabs
						tabs={tabItems}
						selectedTab={selectedTab}
						onSelectTab={handleSelectTab}
						labelRender={(tab) => t(`dashboard.${tab.toLowerCase()}`)}
					/>
					<StatsGrid stats={currentStats} key={selectedTab} />
				</AnimatedBox>
				<Animated.Text
					entering={FadeInUp.duration(400)}
					style={{
						fontSize: theme.typography.sizes.lg,
						fontWeight: theme.typography.weights.semibold,
						color: theme.colors.text,
						marginHorizontal: theme.spacing.md,
						marginBottom: theme.spacing.sm,
						alignSelf: "flex-start",
					}}
				>
					{t("dashboard.todaysPrep")}
				</Animated.Text>
				<Animated.View entering={FadeInUp.delay(300).duration(400).damping(15)}>
					<FlatList
						horizontal
						data={TODAY_PREP_SUMMARY}
						keyExtractor={(item) => item.period}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: theme.spacing.md,
							paddingVertical: theme.spacing.sm,
							gap: theme.spacing.sm,
						}}
						snapToInterval={PREP_CARD_WIDTH + theme.spacing.sm}
						decelerationRate="fast"
						renderItem={({ item }) => (
							<TodayPrepCard
								summary={item}
								onPress={() => handleViewSchedule(item.period)}
							/>
						)}
					/>
				</Animated.View>
				<AlertsCard
					alerts={ALERTS}
					onViewAlert={handleViewAlert}
					onViewAllAlerts={handleViewAllAlerts}
				/>
			</ScrollView>
		</View>
	);
});

export default HomeScreen;

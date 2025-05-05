import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { TodayPrepCard } from "@/components/dashboard/PrepCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { AnimatedBox, Box } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { Text } from "@/components/ui/Text";
import { ALERTS, TODAY_PREP_SUMMARY } from "@/data";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/stores/translationStore";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback, useMemo } from "react";
import { FlatList, ScrollView, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PREP_CARD_WIDTH = 200; // Slightly wider cards for lofi aesthetic

const HomeScreen = React.memo(() => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t, language } = useTranslation();
	const [selectedTab, setSelectedTab] = useState("Today");

	const tabItems = useMemo(() => {
		return ["Today", "Week", "Month"];
	}, [t]);

	// Map periods to lofi color variants
	const mapPeriodToVariant = (
		period: string,
	): "sage" | "peach" | "lavender" => {
		switch (period) {
			case "Breakfast":
				return "sage";
			case "Lunch":
				return "peach";
			case "Dinner":
				return "lavender";
			default:
				return "sage";
		}
	};

	const currentStats = useMemo(() => {
		switch (selectedTab) {
			case "Week":
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
						variant: "sky" as const,
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+3",
						icon: "add-circle-outline",
						variant: "mint" as const,
					},
				];
			case "Month":
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
						variant: "rose" as const,
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+12",
						icon: "add-circle-outline",
						variant: "cream" as const,
					},
				];
			default:
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
						variant: "lavender" as const,
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+12",
						icon: "add-circle-outline",
						variant: "peach" as const,
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
					paddingHorizontal: theme.spacing.xs, // Added horizontal padding
				}}
				showsVerticalScrollIndicator={false}
			>
				<Box
					row
					alignItems="center"
					paddingHorizontal="md"
					paddingVertical="sm"
					marginBottom="sm" // Added margin
					style={{
						height: theme.sizes.headerHeight,
					}}
				>
					<Text variant="xl" weight="semibold" numberOfLines={1}>
						{currentDateString}
					</Text>
				</Box>

				<AnimatedBox
					marginHorizontal="sm" // Reduced margin
					gap="md" // Reduced gap
					entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
						.duration(theme.animations.duration.extraSlow)
						.springify()
						.damping(theme.animations.spring.damping.light)}
					exiting={FadeOutDown.duration(theme.animations.duration.medium)}
				>
					<Box elevation="small" padding="xs">
						<Tabs
							tabs={tabItems}
							selectedTab={selectedTab}
							onSelectTab={handleSelectTab}
							labelRender={(tab) => t(`dashboard.${tab.toLowerCase()}`)}
						/>
					</Box>
					<StatsGrid stats={currentStats} key={selectedTab} />
				</AnimatedBox>

				<Animated.Text
					entering={FadeInUp.duration(400)}
					style={{
						fontSize: theme.typography.sizes.lg,
						fontWeight: theme.typography.weights.medium, // Less bold
						color: theme.colors.text,
						marginHorizontal: theme.spacing.md,
						marginVertical: theme.spacing.sm, // Added vertical margin
						alignSelf: "flex-start",
						letterSpacing: 0.5, // Added slight spacing
					}}
				>
					{t("dashboard.todaysPrep")}
				</Animated.Text>

				<Animated.View
					entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
						.duration(theme.animations.duration.extraSlow)
						.springify()
						.damping(theme.animations.spring.damping.light)}
					exiting={FadeOutDown.duration(theme.animations.duration.medium)}
				>
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
								variant={mapPeriodToVariant(item.period)}
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

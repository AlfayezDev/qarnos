import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { TodayPrepCard } from "@/components/dashboard/PrepCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { AnimatedBox, Box } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { AnimatedText, Text } from "@/components/ui/Text";
import { sizes } from "@/constants/theme/sizes";
import { ALERTS, TODAY_PREP_SUMMARY } from "@/data";
import { useTheme } from "@/stores/themeStore";
import { useTranslation } from "@/stores/translationStore";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { FlatList } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutDown,
	interpolate,
	LinearTransition,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const PREP_CARD_WIDTH = 200;
const HomeScreen = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t, language } = useTranslation();
	const [selectedTab, setSelectedTab] = useState("Today");

	const tabItems = ["Today", "Week", "Month"];

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

	const currentStats = (() => {
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
	})();

	const currentDateString = new Date().toLocaleDateString(language, {
		weekday: "long",
		month: "short",
		day: "numeric",
	});

	const handleSelectTab = (tab: string) => {
		if (tab !== selectedTab) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setSelectedTab(tab);
		}
	};
	const handleViewSchedule = (period?: string) => {
		console.log("Navigate to Schedule Screen, Filter:", period || "Full");
	};
	const handleViewAlert = (id: string | number) => {
		console.log("Navigate to Alert Details Screen, ID:", id);
	};
	const handleViewAllAlerts = () => {
		console.log("Navigate to All Alerts Screen");
	};
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const headerStyle = useAnimatedStyle(() => {
		const headerSize = sizes.headerHeight;
		return {
			opacity: interpolate(scrollOffset.value, [0, headerSize * 0.6], [1, 0]),
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value + headerSize,
						[0, headerSize, headerSize, headerSize + 1],
						[0, 0, 0, -1],
					),
				},
			],
		};
	});
	return (
		<>
			<Animated.ScrollView
				ref={scrollRef}
				contentContainerStyle={{
					paddingBottom: insets.bottom + theme.spacing.xxl * 1.5,
					paddingTop: insets.top,
					paddingHorizontal: theme.spacing.xs,
					backgroundColor: theme.colors.background,
					gap: theme.spacing.xs,
				}}
				showsVerticalScrollIndicator={false}
			>
				<AnimatedBox
					row
					alignItems="center"
					paddingHorizontal="md"
					paddingVertical="sm"
					marginBottom="sm"
					style={headerStyle}
				>
					<AnimatedText
						entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
							.duration(theme.animations.duration.extraSlow)
							.springify()
							.damping(theme.animations.spring.damping.light)}
						exiting={FadeOutDown.duration(theme.animations.duration.medium)}
						layout={LinearTransition.delay(500)}
						variant="xl"
						weight="semibold"
						numberOfLines={1}
					>
						{currentDateString}
					</AnimatedText>
				</AnimatedBox>
				<AnimatedBox
					marginHorizontal="sm"
					gap="md"
					entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
						.duration(theme.animations.duration.extraSlow)
						.springify()
						.damping(theme.animations.spring.damping.light)}
					exiting={FadeOutDown.duration(theme.animations.duration.medium)}
					layout={LinearTransition.delay(200)}
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
				<AnimatedBox
					entering={FadeInUp.delay(theme.animations.delay.staggered.medium)
						.duration(theme.animations.duration.extraSlow)
						.springify()
						.damping(theme.animations.spring.damping.light)}
					exiting={FadeOutDown.duration(theme.animations.duration.medium)}
					layout={LinearTransition.delay(200)}
				>
					<Text
						marginHorizontal={"md"}
						variant="lg"
						weight="semibold"
						fontFamily="serif"
						alignSelf="flex-start"
					>
						{t("dashboard.todaysPrep")}
					</Text>
					<Animated.View>
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
				</AnimatedBox>
				<AlertsCard
					alerts={ALERTS}
					onViewAlert={handleViewAlert}
					onViewAllAlerts={handleViewAllAlerts}
				/>
			</Animated.ScrollView>
		</>
	);
};
export default HomeScreen;

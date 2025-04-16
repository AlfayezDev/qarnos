import React, { useState, useCallback, useRef, useMemo } from "react";
import {
	RefreshControl,
	View,
	ScrollView,
	TouchableOpacity,
	Pressable,
	StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	interpolate,
	Extrapolation,
	withSpring,
	FadeInUp,
	FadeOutDown,
	LinearTransition,
} from "react-native-reanimated";
import { useTheme, AppTheme } from "@/hooks/useTheme";
import { Box, Text, Badge } from "@/components/ui";

interface MealCount {
	name: string;
	count: number;
	id: string | number;
}
interface MealPrepSummary {
	period: "Breakfast" | "Lunch" | "Dinner";
	totalMeals: number;
	mealsToPrep: MealCount[];
}
interface Alert {
	id: string | number;
	type: "warning" | "info" | "error";
	title: string;
	icon: string;
	timestamp?: string;
}
interface StatItem {
	title: string;
	value: string | number;
	icon: string;
}

interface OverviewStats {
	activeSubscriptions: number;
	newThisWeek: number;
}

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
const MAX_MEALS_TO_SHOW = 3;
const PREP_CARD_WIDTH = 180;

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface DashboardTabsProps {
	tabs: string[];
	selectedTab: string;
	onSelectTab: (tab: string) => void;
	theme: AppTheme;
}
const DashboardTabs: React.FC<DashboardTabsProps> = React.memo(
	({ tabs, selectedTab, onSelectTab, theme }) => {
		return (
			<AnimatedBox
				entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
				style={localStyles.tabsContainer}
				bg="backgroundAlt"
				rounded="xl"
				padding="xs"
			>
				{tabs.map((tab) => (
					<TouchableOpacity
						key={tab}
						style={[
							localStyles.tab,
							{ borderRadius: theme.radius.lg },
							tab === selectedTab && [
								localStyles.selectedTab,
								{
									backgroundColor: theme.colors.card,
									shadowColor: theme.colors.shadow,
								},
							],
						]}
						onPress={() => onSelectTab(tab)}
						activeOpacity={0.7}
					>
						<Text
							variant="sm"
							weight={tab === selectedTab ? "semibold" : "medium"}
							color={tab === selectedTab ? "primary" : "textSecondary"}
						>
							{tab}
						</Text>
					</TouchableOpacity>
				))}
			</AnimatedBox>
		);
	},
);

interface StatsGridProps {
	stats: StatItem[];
	theme: AppTheme;
}
const StatsGridComponent: React.FC<StatsGridProps> = React.memo(
	({ stats, theme }) => {
		return (
			<AnimatedBox
				layout={LinearTransition.delay(100).duration(300)}
				row
				marginHorizontal="md"
				marginBottom="lg"
			>
				{stats.map((stat, index) => (
					<AnimatedBox
						key={stat.title}
						entering={FadeInUp.duration(300)}
						exiting={FadeOutDown.duration(200)}
						layout={LinearTransition.duration(300)}
						flex={1}
						marginRight={index === 0 ? "sm" : undefined}
					>
						<Box
							bg="card"
							padding="md"
							rounded="lg"
							style={[
								localStyles.statCard,
								{ shadowColor: theme.colors.shadow },
							]}
						>
							<Box row alignCenter marginBottom="sm">
								<Box
									style={[
										localStyles.statIcon,
										{ borderRadius: theme.radius.sm },
									]}
									bg="primaryLight"
									marginRight="sm"
								>
									<Ionicons
										name={stat.icon as any}
										size={theme.sizes.iconSm}
										color={theme.colors.primary}
									/>
								</Box>
								<Text variant="sm" color="textSecondary">
									{stat.title}
								</Text>
							</Box>
							<Text variant="xl" weight="bold">
								{stat.value}
							</Text>
						</Box>
					</AnimatedBox>
				))}
			</AnimatedBox>
		);
	},
);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const ScaleOnPress = ({
	children,
	onPress,
	style,
	disabled,
}: {
	children: React.ReactNode;
	onPress?: () => void;
	style?: any;
	disabled?: boolean;
}) => {
	const scale = useSharedValue(1);
	const pressedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));
	return (
		<AnimatedPressable
			onPress={onPress}
			disabled={disabled || !onPress}
			onPressIn={() => {
				if (!disabled)
					scale.value = withSpring(0.97, { damping: 18, stiffness: 400 });
			}}
			onPressOut={() => {
				if (!disabled) scale.value = withSpring(1);
			}}
			style={[style, pressedStyle]}
		>
			{children}
		</AnimatedPressable>
	);
};

interface TodayPrepCardProps {
	summary: MealPrepSummary;
	theme: AppTheme;
	onPress: () => void;
}
const TodayPrepCard: React.FC<TodayPrepCardProps> = React.memo(
	({ summary, theme, onPress }) => {
		const periodIcons = {
			Breakfast: "cafe-outline",
			Lunch: "restaurant-outline",
			Dinner: "fast-food-outline",
		};
		const periodColors: Record<
			"Breakfast" | "Lunch" | "Dinner",
			"info" | "primary" | "error"
		> = { Breakfast: "info", Lunch: "primary", Dinner: "error" };
		return (
			<ScaleOnPress
				onPress={onPress}
				style={[
					localStyles.prepCardContainer,
					{ borderRadius: theme.radius.lg },
				]}
			>
				<Box
					style={[
						localStyles.prepCard,
						{
							backgroundColor: theme.colors.card,
							borderRadius: theme.radius.lg,
							shadowColor: theme.colors.shadow,
						},
					]}
				>
					<Box row alignCenter marginBottom="sm">
						<Ionicons
							name={periodIcons[summary.period] as any}
							size={theme.sizes.iconSm}
							color={theme.colors[periodColors[summary.period]]}
							style={{ marginRight: theme.spacing.sm }}
						/>
						<Text variant="md" weight="semibold">
							{summary.period}
						</Text>
					</Box>
					<Text
						variant="sm"
						weight="medium"
						color="textSecondary"
						marginBottom="xs"
					>
						Prep List:
					</Text>
					<Box style={localStyles.prepListContainer}>
						{summary.mealsToPrep.slice(0, MAX_MEALS_TO_SHOW).map((meal) => (
							<Box
								key={meal.id}
								row
								justifyContent="space-between"
								paddingVertical={theme.spacing.xs / 2}
							>
								<Text
									variant="sm"
									numberOfLines={1}
									style={{ flexShrink: 1, marginRight: theme.spacing.sm }}
								>
									{meal.name}
								</Text>
								<Text variant="sm" weight="medium" color="textSecondary">
									{meal.count}
								</Text>
							</Box>
						))}
					</Box>
					<Box
						row
						justifyContent="space-between"
						alignItems="flex-end"
						paddingTop="sm"
					>
						<Badge
							text={`${summary.totalMeals} Total`}
							variant={periodColors[summary.period]}
						/>
						{summary.mealsToPrep.length > MAX_MEALS_TO_SHOW && (
							<Text variant="xs" color="textMuted">
								+ {summary.mealsToPrep.length - MAX_MEALS_TO_SHOW} more
							</Text>
						)}
					</Box>
				</Box>
			</ScaleOnPress>
		);
	},
);

interface AlertRowProps {
	alert: Alert;
	theme: AppTheme;
	onPress: () => void;
}
const AlertRow: React.FC<AlertRowProps> = React.memo(
	({ alert, theme, onPress }) => {
		const iconColor = theme.colors[alert.type];
		return (
			<ScaleOnPress onPress={onPress}>
				<Box row alignCenter paddingVertical="sm">
					<Ionicons
						name={alert.icon as any}
						size={theme.sizes.iconSm}
						color={iconColor}
						style={{ marginRight: theme.spacing.sm }}
					/>
					<Box flex={1}>
						<Text variant="sm" numberOfLines={1}>
							{alert.title}
						</Text>
						{alert.timestamp && (
							<Text
								variant="xs"
								color="textMuted"
								marginTop={theme.spacing.xs / 2}
							>
								{alert.timestamp}
							</Text>
						)}
					</Box>
					<Ionicons
						name="chevron-forward"
						size={theme.sizes.iconSm}
						color={theme.colors.textMuted}
					/>
				</Box>
			</ScaleOnPress>
		);
	},
);

interface ActivityOverviewCardProps {
	alerts: Alert[];
	overviewStats: OverviewStats;
	theme: AppTheme;
	onViewAlert: (id: string | number) => void;
}
const ActivityOverviewCardComponent: React.FC<ActivityOverviewCardProps> =
	React.memo(({ alerts, overviewStats, theme, onViewAlert }) => {
		const hasAlerts = alerts.length > 0;
		return (
			<AnimatedBox
				entering={FadeInUp.delay(350).duration(400).springify().damping(15)}
				exiting={FadeOutDown.duration(200)}
				bg="card"
				rounded="lg"
				marginHorizontal="md"
				marginBottom="lg"
				padding="md"
				style={[localStyles.cardShadow, { shadowColor: theme.colors.shadow }]}
			>
				<Text variant="lg" weight="semibold" marginBottom="sm">
					Activity & Alerts
				</Text>
				<Box row marginBottom="sm" paddingVertical="xs">
					<Box flex={1} marginRight="sm">
						<Text
							variant="sm"
							color="textSecondary"
							marginBottom={theme.spacing.xs / 2}
						>
							Active Subs
						</Text>
						<Text variant="xl" weight="bold">
							{overviewStats.activeSubscriptions}
						</Text>
					</Box>
					<Box flex={1} marginLeft="sm">
						<Text
							variant="sm"
							color="textSecondary"
							marginBottom={theme.spacing.xs / 2}
						>
							New This Week
						</Text>
						<Text variant="xl" weight="bold" color="success">
							+{overviewStats.newThisWeek}
						</Text>
					</Box>
				</Box>
				{hasAlerts && (
					<Box marginTop="xs">
						{alerts.map((alert, index) => (
							<Box
								key={alert.id}
								style={{
									borderTopColor: theme.colors.divider,
									borderTopWidth: index > 0 ? StyleSheet.hairlineWidth : 0,
								}}
							>
								<AlertRow
									alert={alert}
									theme={theme}
									onPress={() => onViewAlert(alert.id)}
								/>
							</Box>
						))}
					</Box>
				)}
				{!hasAlerts && (
					<Box row alignCenter paddingVertical="sm" marginTop="xs">
						<Ionicons
							name="checkmark-circle-outline"
							size={theme.sizes.iconSm}
							color={theme.colors.success}
							style={{ marginRight: theme.spacing.sm }}
						/>
						<Text color="textSecondary" variant="sm">
							No pressing alerts.
						</Text>
					</Box>
				)}
			</AnimatedBox>
		);
	});

interface QuickActionButtonProps {
	label: string;
	icon: string;
	action: () => void;
	theme: AppTheme;
}
const QuickActionButton: React.FC<QuickActionButtonProps> = React.memo(
	({ label, icon, action, theme }) => (
		<ScaleOnPress onPress={action} style={localStyles.quickActionContainer}>
			<Box
				style={[
					localStyles.quickActionButton,
					{
						borderRadius: theme.radius.lg,
						shadowColor: theme.colors.shadow,
						minHeight: theme.sizes.buttonLg * 2.1,
					},
				]}
				bg="card"
			>
				<Ionicons
					name={`${icon}-outline` as any}
					size={theme.sizes.iconLg}
					color={theme.colors.primary}
				/>
				<Text
					center
					variant="sm"
					marginTop="sm"
					color="primary"
					weight="medium"
				>
					{label}
				</Text>
			</Box>
		</ScaleOnPress>
	),
);

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

	const handleRefresh = useCallback(() => {
		setRefreshing(true);

		setTimeout(() => setRefreshing(false), 1200);
	}, []);

	const handleViewSchedule = useCallback((period?: string) => {
		console.log("View Schedule", period || "Full");
	}, []);
	const handleViewAlert = useCallback((id: string | number) => {
		console.log("View Alert", id);
	}, []);
	const handleManageClients = useCallback(() => {
		console.log("Manage Clients");
	}, []);
	const handleManagePlans = useCallback(() => {
		console.log("Manage Plans");
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
			[0, 15],
			[0, 1],
			Extrapolation.CLAMP,
		);
		const shadowOpacity = interpolate(
			value,
			[0, 15],
			[0, theme.isDark ? 0.4 : 0.06],
			Extrapolation.CLAMP,
		);
		return {
			borderBottomColor: theme.colors.divider,
			borderBottomWidth: borderOpacity > 0 ? StyleSheet.hairlineWidth : 0,
			shadowOpacity: shadowOpacity,
			shadowColor: theme.colors.shadow,
			shadowOffset: { width: 0, height: 2 },
			shadowRadius: 3,
			elevation: borderOpacity > 0 ? 4 : 0,
		};
	});

	const Header = useCallback(
		() => (
			<Animated.View
				style={[
					localStyles.headerBase,
					{
						backgroundColor: theme.colors.card,
						paddingTop: insets.top,
						height: HEADER_HEIGHT + insets.top,
						paddingHorizontal: theme.spacing.md,
						paddingBottom: theme.spacing.sm,
					},
					headerAnimatedStyle,
				]}
			>
				<View style={localStyles.headerContent}>
					<View>
						<Text
							variant="sm"
							color="textSecondary"
							style={{ textTransform: "uppercase" }}
						>
							Dashboard
						</Text>
						<Text variant="lg" weight="semibold">
							{new Date().toLocaleDateString(undefined, {
								weekday: "long",
								month: "short",
								day: "numeric",
							})}
						</Text>
					</View>
					<TouchableOpacity
						onPress={() => console.log("Settings")}
						style={localStyles.iconButton}
					>
						<Ionicons
							name="settings-outline"
							size={theme.sizes.iconMd}
							color={theme.colors.textSecondary}
						/>
					</TouchableOpacity>
				</View>
			</Animated.View>
		),
		[insets.top, theme, headerAnimatedStyle],
	);

	return (
		<View
			style={[
				localStyles.screenContainer,
				{ backgroundColor: theme.colors.background },
			]}
		>
			<Header />
			<AnimatedScrollView
				ref={scrollRef}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingTop: HEADER_HEIGHT + insets.top,
					paddingBottom: insets.bottom + theme.spacing.xl,
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
			>
				{/* --- Tabs --- */}
				<Box marginHorizontal="md" marginBottom="md" marginTop="md">
					<DashboardTabs
						tabs={tabItems}
						selectedTab={selectedTab}
						onSelectTab={setSelectedTab}
						theme={theme}
					/>
				</Box>

				{/* --- Stats Grid (Re-animates on tab change via key + LinearTransition) --- */}
				<StatsGridComponent
					stats={currentStats}
					theme={theme}
					key={selectedTab}
				/>

				{/* --- Today's Prep Title --- */}
				<AnimatedText
					entering={FadeInUp.delay(250).duration(400).springify().damping(15)}
					variant="xl"
					weight="semibold"
					marginHorizontal="md"
					marginBottom="sm"
				>
					Today's Prep
				</AnimatedText>

				{/* --- Today's Prep ScrollView --- */}
				<AnimatedScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={[
						localStyles.prepScrollContainer,
						{
							paddingHorizontal: theme.spacing.md,
							paddingVertical: theme.spacing.sm,
							gap: theme.spacing.sm,
						},
					]}
					snapToInterval={PREP_CARD_WIDTH + theme.spacing.sm}
					decelerationRate="fast"
					entering={FadeInUp.delay(300).duration(400).springify().damping(15)}
				>
					{TODAY_PREP_SUMMARY.map((summary) => (
						<TodayPrepCard
							key={summary.period}
							summary={summary}
							theme={theme}
							onPress={() => handleViewSchedule(summary.period)}
						/>
					))}
				</AnimatedScrollView>

				{/* --- Activity Card (Uses fixed OVERVIEW_STATS) --- */}
				<ActivityOverviewCardComponent
					alerts={ALERTS}
					overviewStats={OVERVIEW_STATS}
					theme={theme}
					onViewAlert={handleViewAlert}
				/>

				{/* --- Quick Access Title --- */}
				<AnimatedText
					entering={FadeInUp.delay(400).duration(400).springify().damping(15)}
					variant="lg"
					weight="semibold"
					marginHorizontal="md"
					marginBottom="sm"
				>
					Quick Access
				</AnimatedText>

				{/* --- Quick Access Buttons --- */}
				<AnimatedBox
					entering={FadeInUp.delay(450).duration(400).springify().damping(15)}
					row
					justifyContent="space-around"
					marginHorizontal="sm"
					marginBottom="xl"
				>
					<QuickActionButton
						label="Full Schedule"
						icon="calendar"
						action={handleViewSchedule}
						theme={theme}
					/>
					<QuickActionButton
						label="Clients"
						icon="people"
						action={handleManageClients}
						theme={theme}
					/>
					<QuickActionButton
						label="Meal Plans"
						icon="restaurant"
						action={handleManagePlans}
						theme={theme}
					/>
				</AnimatedBox>
			</AnimatedScrollView>
		</View>
	);
};

const localStyles = StyleSheet.create({
	screenContainer: { flex: 1 },
	headerBase: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 100 },
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	iconButton: { padding: 8 },
	tabsContainer: { flexDirection: "row" },
	tab: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		alignItems: "center",
	},
	selectedTab: {
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	statCard: {
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
	},
	statIcon: {
		width: 32,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	prepScrollContainer: {},
	prepCardContainer: { width: PREP_CARD_WIDTH },
	prepCard: {
		padding: 16,
		minHeight: 180,
		justifyContent: "space-between",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
	},
	prepListContainer: { marginTop: 4, flexGrow: 1 },
	cardShadow: {
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	quickActionContainer: { flex: 1, marginHorizontal: 4 },
	quickActionButton: {
		paddingVertical: 16,
		paddingHorizontal: 4,
		alignItems: "center",
		justifyContent: "center",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
	},
});

export default HomeScreen;

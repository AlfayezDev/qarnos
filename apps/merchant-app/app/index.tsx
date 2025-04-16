import React, { useState, useCallback, useRef } from "react";
import {
	RefreshControl,
	View,
	ScrollView,
	TouchableOpacity,
	Pressable,
	StyleSheet,
	ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	interpolate,
	Extrapolation,
	withTiming,
	Easing,
	withSpring,
	FadeIn,
} from "react-native-reanimated";
import { useTheme, ColorToken } from "@/hooks/useTheme";
import { BadgeProps } from "@/components/ui/Badge";
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

interface ActivityStats {
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

const ACTIVITY_STATS: ActivityStats = {
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
		id: 3,
		type: "error",
		title: "Delivery issue Order #12345",
		icon: "car-sport-outline",
		timestamp: "Yesterday",
	},
	{
		id: 2,
		type: "warning",
		title: "Low inventory: Quinoa",
		icon: "cube-outline",
		timestamp: "1h ago",
	},
];

const HEADER_HEIGHT = 65;
const MAX_MEALS_TO_SHOW = 3;
const PREP_CARD_WIDTH = 180;

const HomeScreen: React.FC = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);
	const scrollY = useSharedValue(0);
	const isLoaded = useSharedValue(0);
	const scrollRef = useRef<Animated.ScrollView>(null);

	const getDayString = () =>
		new Date().toLocaleDateString(undefined, {
			weekday: "long",
			month: "short",
			day: "numeric",
		});

	useFocusEffect(
		useCallback(() => {
			isLoaded.value = 0;
			const timer = setTimeout(() => {
				isLoaded.value = withTiming(1, {
					duration: 400,
					easing: Easing.out(Easing.quad),
				});
			}, 100);
			return () => clearTimeout(timer);
		}, []),
	);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		isLoaded.value = withTiming(0, { duration: 150 });
		setTimeout(() => {
			setRefreshing(false);
			isLoaded.value = withTiming(1, { duration: 300 });
		}, 1200);
	}, []);

	const handleViewSchedule = (period?: string) =>
		console.log("View Schedule", period || "Full");
	const handleViewAlert = (id: string | number) =>
		console.log("View Alert", id);
	const handleManageClients = () => console.log("Manage Clients");
	const handleManagePlans = () => console.log("Manage Plans");

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

	// This style now only controls opacity based on loading state
	const contentContainerAnimatedStyle = useAnimatedStyle(() => ({
		opacity: isLoaded.value,
	}));

	const Header = () => (
		<Animated.View
			style={[
				styles.headerBase(insets.top, theme) as ViewStyle,
				headerAnimatedStyle,
			]}
		>
			<View>
				<Text variant="sm" color="textSecondary">
					Dashboard
				</Text>
				<Text variant="lg" weight="semibold">
					{getDayString()}
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => console.log("Settings")}
				style={styles.iconButton(theme)}
			>
				<Ionicons
					name="settings-outline"
					size={theme.sizes.iconMd}
					color={theme.colors.textSecondary}
				/>
			</TouchableOpacity>
		</Animated.View>
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

	const TodayPrepCard = ({ summary }: { summary: MealPrepSummary }) => {
		const periodIcons = {
			Breakfast: "cafe-outline",
			Lunch: "restaurant-outline",
			Dinner: "fast-food-outline",
		};
		const periodColors: Record<
			"Breakfast" | "Lunch" | "Dinner",
			BadgeProps["variant"]
		> = {
			Breakfast: "info",
			Lunch: "primary",
			Dinner: "error",
		};
		return (
			<ScaleOnPress
				onPress={() => handleViewSchedule(summary.period)}
				style={styles.prepCardContainer(theme)}
			>
				<Box
					style={[
						styles.prepCard(theme) as ViewStyle,
						{ backgroundColor: theme.colors.card },
					]}
				>
					<Box row alignCenter marginBottom="sm">
						<Ionicons
							name={periodIcons[summary.period] as any}
							size={theme.sizes.iconSm}
							color={theme.colors[periodColors[summary.period] as ColorToken]}
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
					<Box style={styles.prepListContainer}>
						{summary.mealsToPrep.slice(0, MAX_MEALS_TO_SHOW).map((meal) => (
							<Box
								key={meal.id}
								row
								justifyContent="space-between"
								paddingVertical={2}
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
								+ {summary.mealsToPrep.length - MAX_MEALS_TO_SHOW} other
							</Text>
						)}
					</Box>
				</Box>
			</ScaleOnPress>
		);
	};

	const AlertRow = ({ alert }: { alert: Alert }) => {
		const iconColor = theme.colors[alert.type];
		return (
			<ScaleOnPress onPress={() => handleViewAlert(alert.id)}>
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
							<Text variant="xs" color="textMuted" marginTop={2}>
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
	};

	const ActivityOverviewCard = () => {
		const hasAlerts = ALERTS.length > 0;
		return (
			<Box
				bg="card"
				rounded="lg"
				marginHorizontal="md"
				marginBottom="lg"
				padding="md"
				style={theme.shadows.medium}
			>
				<Text variant="lg" weight="semibold" marginBottom="sm">
					Activity & Alerts
				</Text>
				<Box row marginBottom="sm" paddingVertical="xs">
					<Box flex={1} marginRight="sm">
						<Text variant="sm" color="textSecondary" marginBottom={2}>
							Active Subs
						</Text>
						<Text variant="xl" weight="bold">
							{ACTIVITY_STATS.activeSubscriptions}
						</Text>
					</Box>
					<Box flex={1} marginLeft="sm">
						<Text variant="sm" color="textSecondary" marginBottom={2}>
							New This Week
						</Text>
						<Text variant="xl" weight="bold" color="success">
							{ACTIVITY_STATS.newThisWeek}
						</Text>
					</Box>
				</Box>
				{hasAlerts && (
					<Box marginTop="xs">
						{ALERTS.map((alert, index) => (
							<Box
								key={alert.id}
								style={{
									borderTopColor: theme.colors.divider,
									borderTopWidth: index > 0 ? StyleSheet.hairlineWidth : 0,
								}}
							>
								<AlertRow alert={alert} />
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
			</Box>
		);
	};

	const QuickActionButton = ({
		label,
		icon,
		action,
	}: { label: string; icon: string; action: () => void }) => (
		<ScaleOnPress onPress={action} style={styles.quickActionContainer(theme)}>
			<Box
				style={[
					styles.quickActionButton(theme) as ViewStyle,
					{ backgroundColor: theme.colors.card },
				]}
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
	);

	return (
		<View style={[styles.screenContainer(theme)]}>
			<Header />
			<Animated.ScrollView
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
						progressViewOffset={HEADER_HEIGHT + insets.top + 10}
					/>
				}
			>
				{/* Outer wrapper for the layout animation */}
				<Animated.View entering={FadeIn.duration(300).delay(50)}>
					{/* Inner view for the style animation (opacity) */}
					<Animated.View style={contentContainerAnimatedStyle}>
						<Text
							variant="xl"
							weight="semibold"
							style={styles.sectionTitle(theme)}
						>
							Today's Prep
						</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.prepScrollContainer(theme)}
							snapToInterval={
								PREP_CARD_WIDTH + styles.prepScrollContainer(theme).gap
							}
							decelerationRate="fast"
						>
							{TODAY_PREP_SUMMARY.map((summary) => (
								<TodayPrepCard key={summary.period} summary={summary} />
							))}
						</ScrollView>

						<ActivityOverviewCard />

						<Text
							variant="lg"
							weight="semibold"
							style={styles.sectionTitle(theme)}
						>
							Quick Access
						</Text>
						<Box
							row
							justifyContent="space-around"
							marginHorizontal={theme.spacing.sm}
							marginBottom="xl"
						>
							<QuickActionButton
								label="Full Schedule"
								icon="calendar"
								action={() => handleViewSchedule()}
							/>
							<QuickActionButton
								label="Clients"
								icon="people"
								action={handleManageClients}
							/>
							<QuickActionButton
								label="Meal Plans"
								icon="restaurant"
								action={handleManagePlans}
							/>
						</Box>
					</Animated.View>
				</Animated.View>
			</Animated.ScrollView>
		</View>
	);
};

// ... (Keep styles object the same) ...
const styles = {
	screenContainer: (theme: ReturnType<typeof useTheme>) => ({
		flex: 1,
		backgroundColor: theme.colors.background,
	}),
	headerBase: (topInset: number, theme: ReturnType<typeof useTheme>) => ({
		position: "absolute" as const,
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		flexDirection: "row" as const,
		alignItems: "center" as const,
		justifyContent: "space-between" as const,
		paddingHorizontal: theme.spacing.md,
		paddingBottom: theme.spacing.sm,
		paddingTop: topInset,
		height: HEADER_HEIGHT + topInset,
		backgroundColor: theme.colors.card,
	}),
	headerActions: (_: ReturnType<typeof useTheme>) => ({
		flexDirection: "row" as const,
		alignItems: "center" as const,
	}),
	iconButton: (theme: ReturnType<typeof useTheme>) => ({
		padding: theme.spacing.sm,
		marginLeft: theme.spacing.xs,
	}),
	sectionTitle: (theme: ReturnType<typeof useTheme>) => ({
		marginHorizontal: theme.spacing.md,
		marginTop: theme.spacing.md,
		marginBottom: theme.spacing.sm,
	}),
	prepScrollContainer: (theme: ReturnType<typeof useTheme>) => ({
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		gap: theme.spacing.sm,
	}),
	prepCardContainer: (theme: ReturnType<typeof useTheme>) => ({
		width: PREP_CARD_WIDTH,
		borderRadius: theme.radius.lg,
	}),
	prepCard: (theme: ReturnType<typeof useTheme>) => ({
		padding: theme.spacing.md,
		borderRadius: theme.radius.lg,
		minHeight: 180,
		justifyContent: "space-between" as const,
		...theme.shadows.medium,
	}),
	prepListContainer: {
		marginTop: 4,
		flexGrow: 1,
	},
	quickActionContainer: (theme: ReturnType<typeof useTheme>) => ({
		flex: 1,
		marginHorizontal: theme.spacing.xs,
	}),
	quickActionButton: (theme: ReturnType<typeof useTheme>) => ({
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.xs,
		borderRadius: theme.radius.lg,
		alignItems: "center" as const,
		justifyContent: "center" as const,
		minHeight: 110,
		...theme.shadows.small,
	}),
};

export default HomeScreen;

This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: **/*.log, tmp/, **/Illustrations/**, **/*.json, **/Localization.ts, **/SVGS/**, **/generated/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
apps/
  merchant-app/
    app/
      _layout.tsx
      +not-found.tsx
      index.tsx
    components/
      layout/
        index.ts
        PageHeader.tsx
        ScreenContainer.tsx
        SearchOverlay.tsx
        SectionHeader.tsx
      ui/
        Avatar.tsx
        Badge.tsx
        Box.tsx
        Button.tsx
        Card.tsx
        index.ts
        Text.tsx
      category-filters.tsx
      meal-plan-card.tsx
      progress-status-card.tsx
      restaurant-card.tsx
      task-card.tsx
    constants/
      Colors.ts
      Spacing.ts
      theme.ts
      Typography.ts
    hooks/
      useColorScheme.ts
      useColorScheme.web.ts
      useTheme.ts
      useThemeColor.ts
    .gitignore
.gitignore
.npmrc
.nvimrc
pnpm-workspace.yaml
```

# Files

## File: apps/merchant-app/app/+not-found.tsx
```typescript
import { Stack } from "expo-router";
export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
		</>
	);
}
```

## File: apps/merchant-app/app/index.tsx
```typescript
import React, { useState, useCallback, useRef } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	interpolate,
	Extrapolation,
	withTiming,
	withSpring,
	FadeIn,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
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
const ACTIVITY_STATS = {
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
const HomeScreen: React.FC = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);
	const [selectedTab, setSelectedTab] = useState("Today");
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
	const contentContainerAnimatedStyle = useAnimatedStyle(() => ({
		opacity: isLoaded.value,
	}));
	const Header = () => (
		<Animated.View
			style={[
				styles.headerBase,
				{
					backgroundColor: theme.colors.card,
					paddingTop: insets.top,
					height: HEADER_HEIGHT + insets.top,
				},
				headerAnimatedStyle,
			]}
		>
			<View style={styles.headerContent}>
				<View>
					<Text
						variant="sm"
						color="textSecondary"
						style={{ textTransform: "uppercase" }}
					>
						Dashboard
					</Text>
					<Text variant="lg" weight="semibold">
						{getDayString()}
					</Text>
				</View>
				<TouchableOpacity
					onPress={() => console.log("Settings")}
					style={styles.iconButton}
				>
					<Ionicons
						name="settings-outline"
						size={theme.sizes.iconMd}
						color={theme.colors.textSecondary}
					/>
				</TouchableOpacity>
			</View>
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
	const Tabs = () => {
		const tabs = ["Today", "Week", "Month"];
		return (
			<Box
				style={styles.tabsContainer}
				bg="backgroundAlt"
				rounded="xl"
				padding="xs"
			>
				{tabs.map((tab) => (
					<TouchableOpacity
						key={tab}
						style={[
							styles.tab,
							tab === selectedTab && [
								styles.selectedTab,
								{ backgroundColor: theme.colors.card },
							],
						]}
						onPress={() => setSelectedTab(tab)}
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
			</Box>
		);
	};
	const StatsGrid = () => {
		const stats = [
			{
				title: "Active Subs",
				value: ACTIVITY_STATS.activeSubscriptions,
				icon: "people-outline",
			},
			{
				title: "New This Week",
				value: `+${ACTIVITY_STATS.newThisWeek}`,
				icon: "add-circle-outline",
			},
		];
		return (
			<Box row marginHorizontal="md" marginBottom="lg">
				{stats.map((stat) => (
					<Box
						key={stat.title}
						flex={1}
						marginRight={stat.title === "Active Subs" ? "sm" : undefined}
					>
						<Box bg="card" padding="md" rounded="lg" style={styles.statCard}>
							<Box row alignCenter marginBottom="sm">
								<Box style={styles.statIcon} bg="primaryLight" marginRight="sm">
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
					</Box>
				))}
			</Box>
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
			"info" | "primary" | "error"
		> = {
			Breakfast: "info",
			Lunch: "primary",
			Dinner: "error",
		};
		return (
			<ScaleOnPress
				onPress={() => handleViewSchedule(summary.period)}
				style={styles.prepCardContainer}
			>
				<Box style={[styles.prepCard, { backgroundColor: theme.colors.card }]}>
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
								+ {summary.mealsToPrep.length - MAX_MEALS_TO_SHOW} more
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
				style={styles.cardShadow}
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
	}: {
		label: string;
		icon: string;
		action: () => void;
	}) => (
		<ScaleOnPress onPress={action} style={styles.quickActionContainer}>
			<Box style={styles.quickActionButton} bg="card">
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
		<View
			style={[
				styles.screenContainer,
				{ backgroundColor: theme.colors.background },
			]}
		>
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
				<Animated.View entering={FadeIn.duration(300).delay(50)}>
					<Animated.View style={contentContainerAnimatedStyle}>
						<Box marginHorizontal="md" marginBottom="md" marginTop="md">
							<Tabs />
						</Box>
						<StatsGrid />
						<Text variant="xl" weight="semibold" style={styles.sectionTitle}>
							Today's Prep
						</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.prepScrollContainer}
							snapToInterval={PREP_CARD_WIDTH + theme.spacing.sm}
							decelerationRate="fast"
						>
							{TODAY_PREP_SUMMARY.map((summary) => (
								<TodayPrepCard key={summary.period} summary={summary} />
							))}
						</ScrollView>
						<ActivityOverviewCard />
						<Text variant="lg" weight="semibold" style={styles.sectionTitle}>
							Quick Access
						</Text>
						<Box
							row
							justifyContent="space-around"
							marginHorizontal="sm"
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
const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
	},
	headerBase: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		paddingHorizontal: 16,
		paddingBottom: 8,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	iconButton: {
		padding: 8,
	},
	sectionTitle: {
		marginHorizontal: 16,
		marginTop: 16,
		marginBottom: 8,
	},
	tabsContainer: {
		flexDirection: "row",
	},
	tab: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		alignItems: "center",
		borderRadius: 16,
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
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	prepScrollContainer: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		gap: 8,
	},
	prepCardContainer: {
		width: PREP_CARD_WIDTH,
		borderRadius: 16,
	},
	prepCard: {
		padding: 16,
		borderRadius: 16,
		minHeight: 180,
		justifyContent: "space-between",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
	},
	prepListContainer: {
		marginTop: 4,
		flexGrow: 1,
	},
	cardShadow: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	quickActionContainer: {
		flex: 1,
		marginHorizontal: 4,
	},
	quickActionButton: {
		paddingVertical: 16,
		paddingHorizontal: 4,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 110,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
	},
});
export default HomeScreen;
```

## File: apps/merchant-app/components/layout/index.ts
```typescript
export * from "./ScreenContainer";
export * from "./SectionHeader";
export * from "./PageHeader";
export * from "./SearchOverlay";
```

## File: apps/merchant-app/components/layout/PageHeader.tsx
```typescript
import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ColorToken, useTheme } from "@/hooks/useTheme";
import { Text } from "../ui/Text";
interface PageHeaderProps {
	title: string;
	showSearch?: boolean;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (text: string) => void;
	onSearchClear?: () => void;
	rightIcon?: string;
	onRightIconPress?: () => void;
	backgroundColor?: ColorToken;
}
export const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	showSearch = false,
	searchPlaceholder = "Search...",
	searchValue = "",
	onSearchChange,
	onSearchClear,
	rightIcon,
	onRightIconPress,
	backgroundColor = "primary",
}) => {
	const theme = useTheme();
	const styles = StyleSheet.create({
		header: {
			backgroundColor: theme.colors[backgroundColor],
			paddingTop: theme.platform.topInset,
			paddingBottom: showSearch ? theme.spacing.lg : theme.spacing.md,
			paddingHorizontal: theme.spacing.md,
		},
		titleRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: showSearch ? theme.spacing.md : 0,
		},
		title: {
			color: "white",
			fontSize: theme.typography.sizes.xl,
			fontWeight: theme.typography.weights.bold,
		},
		searchContainer: {
			backgroundColor: "rgba(255,255,255,0.15)",
			borderRadius: theme.radius.md,
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: theme.spacing.md,
			height: theme.sizes.inputHeight,
		},
		searchInput: {
			flex: 1,
			fontSize: theme.typography.sizes.md,
			color: "#FFFFFF",
			height: theme.sizes.inputHeight,
		},
		iconButton: {
			padding: theme.spacing.xs,
			height: theme.sizes.touchTarget,
			width: theme.sizes.touchTarget,
			alignItems: "center",
			justifyContent: "center",
		},
	});
	return (
		<View style={styles.header}>
			<View style={styles.titleRow}>
				<Text style={styles.title}>{title}</Text>
				{rightIcon && (
					<TouchableOpacity
						style={styles.iconButton}
						onPress={onRightIconPress}
						hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
					>
						<Ionicons
							name={rightIcon as any}
							size={theme.sizes.iconMd}
							color="white"
						/>
					</TouchableOpacity>
				)}
			</View>
			{showSearch && (
				<View style={styles.searchContainer}>
					<Ionicons
						name="search"
						size={theme.sizes.iconMd}
						color="rgba(255,255,255,0.9)"
						style={{ marginRight: theme.spacing.sm }}
					/>
					<TextInput
						placeholder={searchPlaceholder}
						placeholderTextColor="rgba(255,255,255,0.7)"
						style={styles.searchInput}
						value={searchValue}
						onChangeText={onSearchChange}
					/>
					{searchValue && onSearchClear && (
						<TouchableOpacity onPress={onSearchClear} style={styles.iconButton}>
							<Ionicons
								name="close-circle"
								size={theme.sizes.iconMd}
								color="rgba(255,255,255,0.9)"
							/>
						</TouchableOpacity>
					)}
				</View>
			)}
		</View>
	);
};
```

## File: apps/merchant-app/components/layout/ScreenContainer.tsx
```typescript
import { useTheme } from "@/hooks/useTheme";
import { Screen } from "expo-router/build/views/Screen";
import React from "react";
import {
	RefreshControlProps,
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
} from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
interface ScreenContainerProps {
	children: React.ReactNode;
	scrollable?: boolean;
	screenOptions?: any;
	header?: React.ReactNode;
	padded?: boolean;
	refreshControl?: React.ReactElement<RefreshControlProps>;
	contentContainerStyle?: any;
	bottomInset?: boolean;
}
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
	children,
	scrollable = true,
	screenOptions = { headerShown: false },
	header,
	padded = true,
	refreshControl,
	contentContainerStyle,
	bottomInset = true,
}) => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		content: {
			flex: 1,
			paddingHorizontal: padded ? theme.spacing.screenPadding : 0,
		},
		scrollContent: {
			flexGrow: 1,
			paddingBottom: bottomInset
				? insets.bottom || theme.spacing.xl
				: theme.spacing.xl,
		},
	});
	const Container = header ? View : SafeAreaView;
	return (
		<>
			<Screen options={screenOptions} />
			<StatusBar
				barStyle={theme.isDark ? "light-content" : "dark-content"}
				backgroundColor={theme.colors.background}
			/>
			<Container style={styles.container}>
				{header}
				{scrollable ? (
					<ScrollView
						style={styles.content}
						contentContainerStyle={[
							styles.scrollContent,
							contentContainerStyle,
						]}
						showsVerticalScrollIndicator={false}
						refreshControl={refreshControl}
					>
						{children}
					</ScrollView>
				) : (
					<View style={styles.content}>{children}</View>
				)}
			</Container>
		</>
	);
};
```

## File: apps/merchant-app/components/layout/SectionHeader.tsx
```typescript
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SpacingToken, useTheme } from "@/hooks/useTheme";
import { Text } from "../ui/Text";
interface SectionHeaderProps {
	title: string;
	actionLabel?: string;
	onActionPress?: () => void;
	marginTop?: SpacingToken;
	marginBottom?: SpacingToken;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	actionLabel,
	onActionPress,
	marginTop = "sm",
	marginBottom = "sm",
}) => {
	const theme = useTheme();
	const styles = StyleSheet.create({
		container: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginHorizontal: theme.spacing.md,
			marginTop: theme.spacing[marginTop],
			marginBottom: theme.spacing[marginBottom],
		},
		actionButton: {
			padding: theme.spacing.sm,
		},
	});
	return (
		<View style={styles.container}>
			<Text variant="lg" weight="semibold">
				{title}
			</Text>
			{actionLabel && onActionPress && (
				<TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
					<Text color="primary" weight="medium" variant="sm">
						{actionLabel}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};
```

## File: apps/merchant-app/components/ui/Avatar.tsx
```typescript
import { ThemeTokens, useTheme } from "@/hooks/useTheme";
import React from "react";
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	View,
	ViewProps,
} from "react-native";
import { Text } from "./Text";
interface AvatarProps extends ViewProps {
	size?: "sm" | "md" | "lg" | number;
	source?: ImageSourcePropType;
	text?: string;
	color?: ThemeTokens["colors"];
	backgroundColor?: ThemeTokens["colors"];
}
export const Avatar: React.FC<AvatarProps> = ({
	size = "md",
	source,
	text,
	color,
	backgroundColor,
	...props
}) => {
	const theme = useTheme();
	const getSize = () => {
		if (typeof size === "number") return size;
		switch (size) {
			case "sm":
				return theme.sizes.avatarSm;
			case "md":
				return theme.sizes.avatarMd;
			case "lg":
				return theme.sizes.avatarLg;
		}
	};
	const getFontSize = () => {
		if (typeof size === "number") return size / 2;
		switch (size) {
			case "sm":
				return theme.typography.sizes.sm;
			case "md":
				return theme.typography.sizes.lg;
			case "lg":
				return theme.typography.sizes.xxl;
		}
	};
	const avatarSize = getSize();
	const bgColor = backgroundColor
		? theme.colors[backgroundColor]
		: theme.colors.primaryLight;
	const textColor = color ? theme.colors[color] : theme.colors.primary;
	const styles = StyleSheet.create({
		container: {
			width: avatarSize,
			height: avatarSize,
			borderRadius: avatarSize / 2,
			backgroundColor: bgColor,
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
		},
		image: {
			width: avatarSize,
			height: avatarSize,
		},
	});
	return (
		<View style={styles.container} {...props}>
			{source ? (
				<Image source={source} style={styles.image} resizeMode="cover" />
			) : (
				<Text
					weight="bold"
					color={textColor}
					style={{
						fontSize: getFontSize(),
					}}
				>
					{text ? text.charAt(0).toUpperCase() : "?"}
				</Text>
			)}
		</View>
	);
};
```

## File: apps/merchant-app/components/ui/Box.tsx
```typescript
import React from "react";
import {
	View,
	ViewProps,
	StyleSheet,
	StyleProp,
	ViewStyle,
	DimensionValue,
	FlexAlignType,
	Pressable,
	I18nManager,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SpacingToken, ColorToken, RadiusToken } from "@/hooks/useTheme";
type JustifyContentType =
	| "flex-start"
	| "flex-end"
	| "center"
	| "space-between"
	| "space-around"
	| "space-evenly";
interface BoxProps extends ViewProps {
	flex?: number;
	row?: boolean;
	center?: boolean;
	alignCenter?: boolean;
	alignItems?: FlexAlignType;
	justifyCenter?: boolean;
	justifyContent?: JustifyContentType;
	card?: boolean;
	padding?: SpacingToken | number;
	margin?: SpacingToken | number;
	marginTop?: SpacingToken | number;
	marginBottom?: SpacingToken | number;
	marginLeft?: SpacingToken | number;
	marginRight?: SpacingToken | number;
	marginStart?: SpacingToken | number;
	marginEnd?: SpacingToken | number;
	marginHorizontal?: SpacingToken | number;
	marginVertical?: SpacingToken | number;
	paddingHorizontal?: SpacingToken | number;
	paddingBottom?: SpacingToken | number;
	paddingTop?: SpacingToken | number;
	paddingVertical?: SpacingToken | number;
	paddingLeft?: SpacingToken | number;
	paddingRight?: SpacingToken | number;
	paddingStart?: SpacingToken | number;
	paddingEnd?: SpacingToken | number;
	rounded?: RadiusToken | number;
	width?: DimensionValue;
	height?: DimensionValue;
	borderWidth?: number;
	borderColor?: ColorToken;
	bg?: ColorToken | string;
	elevation?: "none" | "small" | "medium" | "large";
	style?: StyleProp<ViewStyle>;
	onPress?: () => void;
	activeOpacity?: number;
}
export const Box: React.FC<BoxProps> = ({
	children,
	flex,
	row,
	center,
	alignCenter,
	paddingTop,
	alignItems,
	paddingBottom,
	justifyCenter,
	justifyContent,
	card,
	padding,
	margin,
	marginTop,
	marginBottom,
	marginLeft,
	marginRight,
	marginStart,
	marginEnd,
	marginHorizontal,
	marginVertical,
	paddingHorizontal,
	paddingVertical,
	paddingLeft,
	paddingRight,
	paddingStart,
	paddingEnd,
	rounded,
	width,
	height,
	borderWidth,
	borderColor,
	bg,
	elevation,
	style,
	onPress,
	activeOpacity = 0.7,
	...props
}) => {
	const theme = useTheme();
	const isRTL = I18nManager.isRTL;
	let finalAlignItems: FlexAlignType | undefined;
	let finalJustifyContent: JustifyContentType | undefined;
	if (center) {
		finalAlignItems = "center";
		finalJustifyContent = "center";
	} else {
		finalAlignItems = alignCenter ? "center" : alignItems;
		finalJustifyContent = justifyCenter ? "center" : justifyContent;
	}
	const getSpacingValue = (
		value: SpacingToken | number | undefined,
	): number | undefined => {
		if (value === undefined) return undefined;
		return typeof value === "number" ? value : theme.spacing[value];
	};
	const getRadiusValue = (
		value: RadiusToken | number | undefined,
	): number | undefined => {
		if (value === undefined) return undefined;
		return typeof value === "number" ? value : theme.radius[value];
	};
	const getColorValue = (
		color: ColorToken | string | undefined,
	): string | undefined => {
		if (color === undefined) return undefined;
		if (typeof color === "string" && color in theme.colors) {
			return theme.colors[color as ColorToken];
		}
		return color;
	};
	const getElevation = (level?: "none" | "small" | "medium" | "large") => {
		if (!level || level === "none") return {};
		return theme.shadows[level];
	};
	const finalMarginLeft =
		marginStart !== undefined
			? isRTL
				? undefined
				: getSpacingValue(marginStart)
			: getSpacingValue(marginLeft);
	const finalMarginRight =
		marginEnd !== undefined
			? isRTL
				? undefined
				: getSpacingValue(marginEnd)
			: getSpacingValue(marginRight);
	const finalMarginStart =
		marginStart !== undefined
			? isRTL
				? getSpacingValue(marginStart)
				: undefined
			: undefined;
	const finalMarginEnd =
		marginEnd !== undefined
			? isRTL
				? getSpacingValue(marginEnd)
				: undefined
			: undefined;
	const finalPaddingLeft =
		paddingStart !== undefined
			? isRTL
				? undefined
				: getSpacingValue(paddingStart)
			: getSpacingValue(paddingLeft);
	const finalPaddingRight =
		paddingEnd !== undefined
			? isRTL
				? undefined
				: getSpacingValue(paddingEnd)
			: getSpacingValue(paddingRight);
	const finalPaddingStart =
		paddingStart !== undefined
			? isRTL
				? getSpacingValue(paddingStart)
				: undefined
			: undefined;
	const finalPaddingEnd =
		paddingEnd !== undefined
			? isRTL
				? getSpacingValue(paddingEnd)
				: undefined
			: undefined;
	const styles = StyleSheet.create({
		box: {
			flex: flex,
			flexDirection: row ? (isRTL ? "row-reverse" : "row") : "column",
			alignItems: finalAlignItems,
			justifyContent: finalJustifyContent,
			padding: getSpacingValue(padding),
			margin: getSpacingValue(margin),
			marginTop: getSpacingValue(marginTop),
			marginBottom: getSpacingValue(marginBottom),
			paddingBottom: getSpacingValue(paddingBottom),
			paddingTop: getSpacingValue(paddingBottom),
			marginLeft: finalMarginLeft,
			marginRight: finalMarginRight,
			marginStart: finalMarginStart,
			marginEnd: finalMarginEnd,
			marginHorizontal: getSpacingValue(marginHorizontal),
			marginVertical: getSpacingValue(marginVertical),
			paddingHorizontal: getSpacingValue(paddingHorizontal),
			paddingVertical: getSpacingValue(paddingVertical),
			paddingLeft: finalPaddingLeft,
			paddingRight: finalPaddingRight,
			paddingStart: finalPaddingStart,
			paddingEnd: finalPaddingEnd,
			borderRadius: getRadiusValue(rounded),
			width,
			height,
			borderWidth,
			borderColor: getColorValue(borderColor),
			backgroundColor: card ? theme.colors.card : getColorValue(bg),
			...(card ? theme.shadows.small : {}),
			...(elevation ? getElevation(elevation) : {}),
		},
	});
	if (onPress) {
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					styles.box,
					{ opacity: pressed ? activeOpacity : 1 },
					style,
				]}
				{...props}
			>
				{children}
			</Pressable>
		);
	}
	return (
		<View style={[styles.box, style]} {...props}>
			{children}
		</View>
	);
};
export default Box;
```

## File: apps/merchant-app/components/ui/Button.tsx
```typescript
import React from "react";
import {
	TouchableOpacity,
	TouchableOpacityProps,
	StyleSheet,
	StyleProp,
	ViewStyle,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "./Text";
interface ButtonProps extends TouchableOpacityProps {
	title: string;
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	leftIcon?: string;
	rightIcon?: string;
	loading?: boolean;
	rounded?: boolean;
	fullWidth?: boolean;
	style?: StyleProp<ViewStyle>;
}
export const Button: React.FC<ButtonProps> = ({
	title,
	variant = "primary",
	size = "md",
	leftIcon,
	rightIcon,
	loading = false,
	rounded = false,
	fullWidth = false,
	style,
	...props
}) => {
	const theme = useTheme();
	const getVariantStyles = () => {
		switch (variant) {
			case "primary":
				return {
					backgroundColor: theme.colors.primary,
					textColor: "white",
				};
			case "secondary":
				return {
					backgroundColor: theme.colors.cardAlt,
					textColor: theme.colors.text,
				};
			case "outline":
				return {
					backgroundColor: "transparent",
					borderWidth: 1,
					borderColor: theme.colors.primary,
					textColor: theme.colors.primary,
				};
			case "ghost":
				return {
					backgroundColor: "transparent",
					textColor: theme.colors.primary,
				};
		}
	};
	const getSizeStyles = () => {
		switch (size) {
			case "sm":
				return {
					height: theme.sizes.buttonSm,
					paddingHorizontal: theme.spacing.md,
					fontSize: "sm" as const,
				};
			case "md":
				return {
					height: theme.sizes.buttonMd,
					paddingHorizontal: theme.spacing.md,
					fontSize: "md" as const,
				};
			case "lg":
				return {
					height: theme.sizes.buttonLg,
					paddingHorizontal: theme.spacing.lg,
					fontSize: "md" as const,
				};
		}
	};
	const variantStyle = getVariantStyles();
	const sizeStyle = getSizeStyles();
	const styles = StyleSheet.create({
		button: {
			height: sizeStyle.height,
			paddingHorizontal: sizeStyle.paddingHorizontal,
			borderRadius: rounded ? theme.radius.round : theme.radius.button,
			backgroundColor: variantStyle.backgroundColor,
			borderWidth: variantStyle.borderWidth || 0,
			borderColor: variantStyle.borderColor,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			width: fullWidth ? "100%" : undefined,
		},
		icon: {
			marginRight: leftIcon && title ? theme.spacing.xs : 0,
			marginLeft: rightIcon && title ? theme.spacing.xs : 0,
		},
	});
	return (
		<TouchableOpacity
			style={[styles.button, style]}
			activeOpacity={0.7}
			disabled={loading || props.disabled}
			{...props}
		>
			{loading ? (
				<ActivityIndicator color={variantStyle.textColor} size="small" />
			) : (
				<>
					{leftIcon && (
						<Ionicons
							name={leftIcon as any}
							size={theme.sizes.iconSm}
							color={variantStyle.textColor}
							style={styles.icon}
						/>
					)}
					<Text
						variant={sizeStyle.fontSize}
						weight="semibold"
						color={variantStyle.textColor}
					>
						{title}
					</Text>
					{rightIcon && (
						<Ionicons
							name={rightIcon as any}
							size={theme.sizes.iconSm}
							color={variantStyle.textColor}
							style={styles.icon}
						/>
					)}
				</>
			)}
		</TouchableOpacity>
	);
};
```

## File: apps/merchant-app/components/ui/Card.tsx
```typescript
import React from "react";
import {
	TouchableOpacity,
	StyleSheet,
	TouchableOpacityProps,
	StyleProp,
	ViewStyle,
} from "react-native";
import { RadiusToken, SpacingToken, useTheme } from "@/hooks/useTheme";
interface CardProps extends TouchableOpacityProps {
	elevation?: "none" | "small" | "medium" | "large";
	padding?: SpacingToken | number;
	rounded?: RadiusToken;
	style?: StyleProp<ViewStyle>;
}
export const Card: React.FC<CardProps> = ({
	children,
	elevation = "small",
	padding = "md",
	rounded = "card",
	style,
	...props
}) => {
	const theme = useTheme();
	const getElevation = () => {
		if (elevation === "none") return {};
		return theme.shadows[elevation];
	};
	const getPadding = () => {
		return typeof padding === "number" ? padding : theme.spacing[padding];
	};
	const styles = StyleSheet.create({
		card: {
			backgroundColor: theme.colors.card,
			borderRadius: theme.radius[rounded],
			padding: getPadding(),
			...getElevation(),
		},
	});
	return (
		<TouchableOpacity
			activeOpacity={props.onPress ? 0.7 : 1}
			style={[styles.card, style]}
			{...props}
		>
			{children}
		</TouchableOpacity>
	);
};
```

## File: apps/merchant-app/components/ui/index.ts
```typescript
export * from "./Box";
export * from "./Text";
export * from "./Button";
export * from "./Avatar";
export * from "./Card";
export * from "./Badge";
```

## File: apps/merchant-app/components/ui/Text.tsx
```typescript
import React from "react";
import {
	Text as RNText,
	TextProps as RNTextProps,
	StyleSheet,
	StyleProp,
	TextStyle,
	I18nManager,
} from "react-native";
import {
	ColorToken,
	FontSizeVariant,
	FontWeightVariant,
	SpacingToken,
	useTheme,
} from "@/hooks/useTheme";
interface TextProps extends RNTextProps {
	variant?: FontSizeVariant;
	weight?: FontWeightVariant;
	color?: ColorToken | string;
	center?: boolean;
	muted?: boolean;
	marginBottom?: SpacingToken | number;
	marginTop?: SpacingToken | number;
	marginLeft?: SpacingToken | number;
	marginRight?: SpacingToken | number;
	marginStart?: SpacingToken | number;
	marginEnd?: SpacingToken | number;
	marginHorizontal?: SpacingToken | number;
	margin?: SpacingToken | number;
	style?: StyleProp<TextStyle>;
}
export const Text: React.FC<TextProps> = ({
	children,
	variant = "md",
	weight = "regular",
	color,
	center,
	muted,
	marginBottom,
	marginTop,
	marginLeft,
	marginRight,
	marginStart,
	marginEnd,
	marginHorizontal,
	margin,
	style,
	...props
}) => {
	const theme = useTheme();
	const isRTL = I18nManager.isRTL;
	const getSpacingValue = (
		value: SpacingToken | number | undefined,
	): number | undefined => {
		if (value === undefined) return undefined;
		return typeof value === "number" ? value : theme.spacing[value];
	};
	const getColorValue = (
		colorProp: ColorToken | string | undefined,
	): string => {
		if (colorProp === undefined) {
			return muted ? theme.colors.textSecondary : theme.colors.text;
		}
		if (typeof colorProp === "string" && colorProp in theme.colors) {
			return theme.colors[colorProp as ColorToken];
		}
		return colorProp;
	};
	const finalMarginLeft =
		marginStart !== undefined
			? isRTL
				? undefined
				: getSpacingValue(marginStart)
			: getSpacingValue(marginLeft);
	const finalMarginRight =
		marginEnd !== undefined
			? isRTL
				? undefined
				: getSpacingValue(marginEnd)
			: getSpacingValue(marginRight);
	const finalMarginStart =
		marginStart !== undefined
			? isRTL
				? getSpacingValue(marginStart)
				: undefined
			: undefined;
	const finalMarginEnd =
		marginEnd !== undefined
			? isRTL
				? getSpacingValue(marginEnd)
				: undefined
			: undefined;
	const styles = StyleSheet.create({
		text: {
			fontSize: theme.typography.sizes[variant],
			fontWeight: theme.typography.weights[weight],
			color: getColorValue(color),
			textAlign: center ? "center" : undefined,
			marginBottom: getSpacingValue(marginBottom),
			marginTop: getSpacingValue(marginTop),
			marginLeft: finalMarginLeft,
			marginRight: finalMarginRight,
			marginStart: finalMarginStart,
			marginEnd: finalMarginEnd,
			marginHorizontal: getSpacingValue(marginHorizontal),
			margin: getSpacingValue(margin),
		},
	});
	return (
		<RNText style={[styles.text, style]} {...props}>
			{children}
		</RNText>
	);
};
export default Text;
```

## File: apps/merchant-app/components/category-filters.tsx
```typescript
import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography } from "@/constants/Typography";
interface CategoryFiltersProps {
	categories: string[];
	selectedCategory: string;
	onSelectCategory: (category: string) => void;
}
const CategoryFilters = ({
	categories,
	selectedCategory,
	onSelectCategory,
}: CategoryFiltersProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				paddingLeft: QarnSpacing.md,
				paddingRight: QarnSpacing.sm,
				paddingVertical: QarnSpacing.sm,
			}}
		>
			{categories.map((category) => (
				<TouchableOpacity
					key={category}
					style={{
						paddingHorizontal: QarnSpacing.md,
						height: QarnSizes.buttonMd,
						borderRadius: QarnRadius.round,
						backgroundColor:
							selectedCategory === category
								? tokens.primary
								: tokens.primaryLight,
						marginRight: QarnSpacing.sm,
						alignItems: "center",
						justifyContent: "center",
						minWidth: 80,
					}}
					onPress={() => onSelectCategory(category)}
					activeOpacity={0.7}
				>
					<Text
						style={{
							color:
								selectedCategory === category
									? "white"
									: isDark
										? tokens.text
										: tokens.primary,
							fontWeight: QarnTypography.weights.medium,
							fontSize: QarnTypography.sizes.sm,
						}}
					>
						{category}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};
export default CategoryFilters;
```

## File: apps/merchant-app/components/progress-status-card.tsx
```typescript
import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
interface ProgressStatusCardProps {
	restaurantName: string;
	completedTasks: number;
	totalTasks: number;
	onAnalytics: () => void;
	onFinish: () => void;
	progressAnim?: Animated.Value;
}
const ProgressStatusCard = ({
	restaurantName,
	completedTasks,
	totalTasks,
	onAnalytics,
	onFinish,
	progressAnim,
}: ProgressStatusCardProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];
	const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
	return (
		<View
			style={{
				backgroundColor: tokens.card,
				borderRadius: QarnRadius.lg,
				padding: QarnSpacing.md,
				...shadows.large,
				marginHorizontal: QarnSpacing.md,
				marginTop: -20,
				marginBottom: QarnSpacing.md,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View>
					<Text
						style={{
							fontSize: QarnTypography.sizes.lg,
							fontWeight: QarnTypography.weights.bold,
							color: tokens.text,
							marginBottom: 4,
						}}
					>
						{restaurantName}
					</Text>
					<Text
						style={{
							fontSize: QarnTypography.sizes.sm,
							color: tokens.textSecondary,
						}}
					>
						{completedTasks} of {totalTasks} tasks completed
					</Text>
				</View>
				<View
					style={{
						backgroundColor: tokens.primaryLight,
						height: QarnSizes.avatarMd + 6,
						width: QarnSizes.avatarMd + 6,
						borderRadius: (QarnSizes.avatarMd + 6) / 2,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							fontSize: QarnTypography.sizes.lg,
							fontWeight: QarnTypography.weights.bold,
							color: tokens.primary,
						}}
					>
						{progressPercentage}%
					</Text>
				</View>
			</View>
			<View
				style={{
					height: 6,
					backgroundColor: tokens.primaryLight,
					borderRadius: 3,
					marginTop: QarnSpacing.md,
					marginBottom: QarnSpacing.md + 4,
					overflow: "hidden",
				}}
			>
				<Animated.View
					style={{
						width: progressAnim
							? progressAnim.interpolate({
									inputRange: [0, 1],
									outputRange: ["0%", "100%"],
								})
							: `${progressPercentage}%`,
						height: "100%",
						backgroundColor: tokens.primary,
						borderRadius: 3,
					}}
				/>
			</View>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<TouchableOpacity
					style={{
						backgroundColor: tokens.cardAlt,
						height: QarnSizes.buttonMd,
						paddingHorizontal: QarnSpacing.md,
						borderRadius: QarnRadius.button,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						minWidth: 120,
					}}
					onPress={onAnalytics}
					activeOpacity={0.7}
				>
					<Ionicons
						name="stats-chart"
						size={QarnSizes.iconSm}
						color={tokens.text}
					/>
					<Text
						style={{
							color: tokens.text,
							fontWeight: QarnTypography.weights.medium,
							marginLeft: QarnSpacing.xs,
							fontSize: QarnTypography.sizes.sm,
						}}
					>
						Analytics
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						backgroundColor: tokens.primary,
						height: QarnSizes.buttonMd,
						paddingHorizontal: QarnSpacing.md,
						borderRadius: QarnRadius.button,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						minWidth: 130,
					}}
					onPress={onFinish}
					activeOpacity={0.7}
				>
					<Text
						style={{
							color: "white",
							fontWeight: QarnTypography.weights.semibold,
							fontSize: QarnTypography.sizes.sm,
						}}
					>
						Finish Setup
					</Text>
					<Ionicons
						name="arrow-forward"
						size={QarnSizes.iconSm}
						color="white"
						style={{ marginLeft: QarnSpacing.xs }}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};
export default ProgressStatusCard;
```

## File: apps/merchant-app/components/restaurant-card.tsx
```typescript
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
interface RestaurantCardProps {
	name: string;
	items: number;
	onPress: () => void;
}
const RestaurantCard = ({ name, items, onPress }: RestaurantCardProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];
	return (
		<TouchableOpacity
			style={{
				borderRadius: QarnRadius.md,
				overflow: "hidden",
				backgroundColor: tokens.card,
				marginBottom: QarnSpacing.sm,
				...shadows.small,
				minHeight: QarnSizes.touchTarget + 16,
			}}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					paddingVertical: QarnSpacing.md,
					paddingHorizontal: QarnSpacing.md,
				}}
			>
				<View
					style={{
						width: QarnSizes.avatarMd,
						height: QarnSizes.avatarMd,
						borderRadius: QarnSizes.avatarMd / 2,
						backgroundColor: tokens.primaryLight,
						alignItems: "center",
						justifyContent: "center",
						marginRight: QarnSpacing.md,
					}}
				>
					<Text
						style={{
							fontSize: QarnTypography.sizes.md,
							fontWeight: QarnTypography.weights.extrabold,
							color: tokens.primary,
						}}
					>
						{name.charAt(0)}
					</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontWeight: QarnTypography.weights.semibold,
							fontSize: QarnTypography.sizes.md,
							color: tokens.text,
							marginBottom: 2,
						}}
						numberOfLines={1}
					>
						{name}
					</Text>
					<Text
						style={{
							fontSize: QarnTypography.sizes.sm,
							color: tokens.textSecondary,
						}}
					>
						{items} active meal plans
					</Text>
				</View>
				<View style={{ paddingLeft: QarnSpacing.sm }}>
					<TouchableOpacity
						style={{
							height: QarnSizes.touchTarget,
							width: QarnSizes.touchTarget,
							alignItems: "center",
							justifyContent: "center",
						}}
						hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
					>
						<Ionicons
							name="chevron-forward"
							size={QarnSizes.iconMd}
							color={tokens.textSecondary}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);
};
export default RestaurantCard;
```

## File: apps/merchant-app/components/task-card.tsx
```typescript
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
interface TaskCardProps {
	title: string;
	details: string;
	completed: boolean;
	icon: string;
	onPress: () => void;
}
const TaskCard = ({
	title,
	details,
	completed,
	icon,
	onPress,
}: TaskCardProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];
	return (
		<TouchableOpacity
			style={{
				backgroundColor: tokens.card,
				borderRadius: QarnRadius.md,
				padding: QarnSpacing.md,
				...shadows.small,
				minHeight: 130,
			}}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View
					style={{
						width: QarnSizes.avatarSm,
						height: QarnSizes.avatarSm,
						borderRadius: QarnSizes.avatarSm / 2,
						backgroundColor: completed ? tokens.primary : tokens.primaryLight,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{completed ? (
						<Ionicons name="checkmark" size={QarnSizes.iconSm} color="white" />
					) : (
						<Ionicons
							name={icon as any}
							size={QarnSizes.iconSm - 2}
							color={tokens.primary}
						/>
					)}
				</View>
				{!completed && (
					<View
						style={{
							width: 8,
							height: 8,
							borderRadius: 4,
							backgroundColor: tokens.primary,
						}}
					/>
				)}
			</View>
			<Text
				style={{
					marginTop: QarnSpacing.sm,
					fontWeight: QarnTypography.weights.semibold,
					fontSize: QarnTypography.sizes.md,
					color: tokens.text,
				}}
			>
				{title}
			</Text>
			<Text
				style={{
					marginTop: 4,
					fontSize: QarnTypography.sizes.sm,
					color: tokens.textSecondary,
					marginBottom: completed ? QarnSpacing.md : QarnSpacing.sm,
				}}
				numberOfLines={2}
			>
				{details}
			</Text>
			{!completed && (
				<TouchableOpacity
					style={{
						backgroundColor: tokens.primaryLight,
						height: QarnSizes.buttonMd,
						borderRadius: QarnRadius.button,
						alignItems: "center",
						justifyContent: "center",
						marginTop: "auto",
					}}
					activeOpacity={0.7}
				>
					<Text
						style={{
							color: tokens.primary,
							fontWeight: QarnTypography.weights.medium,
							fontSize: QarnTypography.sizes.sm,
						}}
					>
						Complete
					</Text>
				</TouchableOpacity>
			)}
		</TouchableOpacity>
	);
};
export default TaskCard;
```

## File: apps/merchant-app/constants/Colors.ts
```typescript
export const QarnColors = {
	light: {
		primary: "#22C55E",
		primaryDark: "#15803D",
		primaryLight: "#E5F6ED",
		background: "#F8FAF8",
		card: "#FFFFFF",
		cardAlt: "#F3F4F6",
		text: "#1C1D1F",
		textSecondary: "#6B7280",
		textMuted: "#9CA3AF",
		success: "#22C55E",
		warning: "#FFD60A",
		info: "#3B82F6",
		error: "#EF4444",
		divider: "#E5E7EB",
		overlay: "rgba(0,0,0,0.4)",
		shadow: "rgba(0,0,0,0.1)",
		tabBar: "#FFFFFF",
		tabIconDefault: "#9CA3AF",
		tabIconSelected: "#22C55E",
	},
	dark: {
		primary: "#22C55E",
		primaryDark: "#15803D",
		primaryLight: "#2C2C2E",
		background: "#0C0C0C",
		card: "#1C1C1E",
		cardAlt: "#2C2C2E",
		text: "#F2F2F7",
		textSecondary: "#8E8E93",
		textMuted: "#636366",
		success: "#22C55E",
		warning: "#FFD60A",
		info: "#3B82F6",
		error: "#EF4444",
		divider: "#38383A",
		overlay: "rgba(0,0,0,0.6)",
		shadow: "rgba(0,0,0,0.3)",
		tabBar: "#1C1C1E",
		tabIconDefault: "#8E8E93",
		tabIconSelected: "#22C55E",
	},
};
```

## File: apps/merchant-app/constants/Spacing.ts
```typescript
export const QarnSpacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
	screenPadding: 16,
	cardPadding: 16,
	itemSpacing: 12,
	sectionSpacing: 24,
};
export const QarnRadius = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	round: 999,
	button: 12,
	card: 16,
	input: 12,
	badge: 12,
};
export const QarnSizes = {
	touchTarget: 44,
	smallTouchTarget: 36,
	iconXs: 16,
	iconSm: 20,
	iconMd: 24,
	iconLg: 32,
	buttonSm: 36,
	buttonMd: 44,
	buttonLg: 52,
	inputHeight: 48,
	headerHeight: 56,
	tabBarHeight: 49,
	avatarSm: 32,
	avatarMd: 44,
	avatarLg: 64,
};
```

## File: apps/merchant-app/constants/Typography.ts
```typescript
export const QarnTypography = {
	sizes: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		xxl: 24,
		xxxl: 30,
	},
	weights: {
		regular: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
		extrabold: "800",
	} as const,
	lineHeights: {
		tight: 1.2,
		normal: 1.5,
		loose: 1.8,
	},
};
export const QarnShadows = {
	light: {
		small: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 2,
			elevation: 1,
		},
		medium: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 2,
		},
		large: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.1,
			shadowRadius: 8,
			elevation: 4,
		},
	},
	dark: {
		small: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.3,
			shadowRadius: 2,
			elevation: 1,
		},
		medium: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.4,
			shadowRadius: 4,
			elevation: 2,
		},
		large: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.5,
			shadowRadius: 8,
			elevation: 4,
		},
	},
};
```

## File: apps/merchant-app/hooks/useColorScheme.ts
```typescript
export { useColorScheme } from 'react-native';
```

## File: apps/merchant-app/hooks/useColorScheme.web.ts
```typescript
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  const colorScheme = useRNColorScheme();
  if (hasHydrated) {
    return colorScheme;
  }
  return 'light';
}
```

## File: apps/merchant-app/hooks/useTheme.ts
```typescript
import { useColorScheme } from "react-native";
import { theme, ThemeMode } from "@/constants/theme";
export const useTheme = () => {
	const colorScheme = useColorScheme() || "light";
	const isDark = colorScheme === "dark";
	const mode: ThemeMode = isDark ? "dark" : "light";
	return {
		colors: theme.colors[mode],
		isDark,
		mode,
		spacing: theme.spacing,
		radius: theme.radius,
		sizes: theme.sizes,
		typography: theme.typography,
		shadows: theme.shadows[mode],
		platform: theme.platform,
	};
};
export type Theme = ReturnType<typeof useTheme>;
export type SpacingToken = keyof Theme["spacing"];
export type RadiusToken = keyof Theme["radius"];
export type ColorToken = keyof Theme["colors"];
export type ThemeTokens = {
	spacing: SpacingToken;
	radius: RadiusToken;
	colors: ColorToken;
};
export type FontSizeVariant = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
export type FontWeightVariant =
	| "regular"
	| "medium"
	| "semibold"
	| "bold"
	| "extrabold";
```

## File: apps/merchant-app/hooks/useThemeColor.ts
```typescript
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
```

## File: apps/merchant-app/.gitignore
```
# @generated expo-cli sync-2b81b286409207a5da26e14c78851eb30d8ccbdb
# The following patterns were generated by expo-cli

expo-env.d.ts
# @end expo-cli
```

## File: .npmrc
```
node-linker=hoisted
engine-strict=true
```

## File: apps/merchant-app/components/layout/SearchOverlay.tsx
```typescript
import React, { useRef, useEffect, useState } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Keyboard,
	FlatList,
	StatusBar,
	Platform,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "../ui";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSpring,
	Easing,
} from "react-native-reanimated";
function interpolate(
	value: number,
	inputRange: number[],
	outputRange: number[],
) {
	"worklet";
	if (value <= inputRange[0]) {
		return outputRange[0];
	}
	if (value >= inputRange[1]) {
		return outputRange[1];
	}
	return (
		outputRange[0] +
		((value - inputRange[0]) * (outputRange[1] - outputRange[0])) /
			(inputRange[1] - inputRange[0])
	);
}
interface SearchResult {
	id: string | number;
	title: string;
	subtitle?: string;
	icon?: string;
}
interface SearchOverlayProps {
	isVisible: boolean;
	onClose: () => void;
	placeholder?: string;
	onSearch: (query: string) => void;
	results?: SearchResult[];
	onResultPress?: (item: SearchResult) => void;
	recentSearches?: string[];
	onClearRecents?: () => void;
}
export const SearchOverlay: React.FC<SearchOverlayProps> = ({
	isVisible,
	onClose,
	placeholder = "Search...",
	onSearch,
	results = [],
	onResultPress,
	recentSearches = [],
	onClearRecents,
}) => {
	const theme = useTheme();
	const [searchValue, setSearchValue] = useState("");
	const searchInputRef = useRef<TextInput>(null);
	// Animation values
	const translateY = useSharedValue(0);
	const opacity = useSharedValue(0);
	// Show/hide the overlay
	useEffect(() => {
		if (isVisible) {
			// Reset search on open
			setSearchValue("");
			// Start animations
			opacity.value = withTiming(1, { duration: 200 });
			translateY.value = withSpring(1, {
				damping: 11,
				stiffness: 65,
			});
			// Focus the input
			const timeoutId = setTimeout(() => {
				if (searchInputRef.current) {
					searchInputRef.current.focus();
				}
			}, 300);
			return () => clearTimeout(timeoutId);
		}
		// Hide animations
		opacity.value = withTiming(0, { duration: 150 });
		translateY.value = withTiming(0, {
			duration: 200,
			easing: Easing.ease,
		});
		// Dismiss keyboard
		Keyboard.dismiss();
	}, [isVisible]);
	// Handle search
	const handleChangeText = (text: string) => {
		setSearchValue(text);
		onSearch(text);
	};
	// Handle result selection
	const handleItemPress = (item: SearchResult) => {
		onResultPress?.(item);
		onClose();
	};
	// Handle recent search press
	const handleRecentPress = (query: string) => {
		setSearchValue(query);
		onSearch(query);
	};
	// Create animation styles
	const containerStyle = useAnimatedStyle(() => {
		const translateYValue = interpolate(translateY.value, [0, 1], [-50, 0]);
		return {
			opacity: opacity.value,
			transform: [{ translateY: translateYValue }],
		};
	});
	// If completely hidden, don't render
	if (!isVisible) return null;
	return (
		<Animated.View
			style={[
				styles.container,
				{ backgroundColor: theme.colors.background },
				containerStyle,
			]}
		>
			<StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
			{}
			<View style={styles.header}>
				<TouchableOpacity onPress={onClose} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={theme.colors.text} />
				</TouchableOpacity>
				<View
					style={[styles.searchBar, { backgroundColor: theme.colors.cardAlt }]}
				>
					<Ionicons
						name="search"
						size={20}
						color={theme.colors.textSecondary}
						style={{ marginRight: 8 }}
					/>
					<TextInput
						ref={searchInputRef}
						style={[styles.input, { color: theme.colors.text }]}
						placeholder={placeholder}
						placeholderTextColor={theme.colors.textSecondary}
						value={searchValue}
						onChangeText={handleChangeText}
						returnKeyType="search"
						autoCapitalize="none"
					/>
					{searchValue.length > 0 && (
						<TouchableOpacity onPress={() => handleChangeText("")}>
							<Ionicons
								name="close-circle"
								size={20}
								color={theme.colors.textSecondary}
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>
			{}
			{results.length > 0 ? (
				<FlatList
					data={results}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<Pressable
							style={({ pressed }) => [
								styles.resultItem,
								pressed && { backgroundColor: theme.colors.cardAlt },
							]}
							onPress={() => handleItemPress(item)}
							android_ripple={{ color: theme.colors.cardAlt }}
						>
							{item.icon && (
								<View
									style={[
										styles.resultIcon,
										{ backgroundColor: theme.colors.primaryLight },
									]}
								>
									<Ionicons
										name={item.icon as any}
										size={18}
										color={theme.colors.primary}
									/>
								</View>
							)}
							<View style={styles.resultText}>
								<Text style={{ fontSize: 16, color: theme.colors.text }}>
									{item.title}
								</Text>
								{item.subtitle && (
									<Text
										style={{
											fontSize: 14,
											color: theme.colors.textSecondary,
											marginTop: 2,
										}}
									>
										{item.subtitle}
									</Text>
								)}
							</View>
						</Pressable>
					)}
					contentContainerStyle={styles.list}
				/>
			) : (
				<View style={styles.emptyContainer}>
					{searchValue.length > 0 ? (
						<View style={styles.noResults}>
							<Ionicons
								name="search"
								size={32}
								color={theme.colors.textSecondary}
								style={{ marginBottom: 16 }}
							/>
							<Text style={{ color: theme.colors.textSecondary }}>
								No results found for "{searchValue}"
							</Text>
						</View>
					) : recentSearches.length > 0 ? (
						<View style={styles.recentsContainer}>
							<View style={styles.recentsHeader}>
								<Text
									style={{
										fontSize: 14,
										color: theme.colors.textSecondary,
										fontWeight: "600",
									}}
								>
									Recent Searches
								</Text>
								<TouchableOpacity onPress={onClearRecents}>
									<Text style={{ fontSize: 14, color: theme.colors.primary }}>
										Clear
									</Text>
								</TouchableOpacity>
							</View>
							{recentSearches.map((query, index) => (
								<Pressable
									key={`recent-searches-${index.toString()}`}
									style={({ pressed }) => [
										styles.recentItem,
										pressed && { backgroundColor: theme.colors.cardAlt },
									]}
									onPress={() => handleRecentPress(query)}
									android_ripple={{ color: theme.colors.cardAlt }}
								>
									<Ionicons
										name="time-outline"
										size={18}
										color={theme.colors.textSecondary}
										style={{ marginRight: 8 }}
									/>
									<Text style={{ fontSize: 15, color: theme.colors.text }}>
										{query}
									</Text>
								</Pressable>
							))}
						</View>
					) : null}
				</View>
			)}
		</Animated.View>
	);
};
const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1000,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: Platform.OS === "ios" ? 60 : 16,
		paddingHorizontal: 16,
		paddingBottom: 12,
	},
	backButton: {
		padding: 8,
		marginRight: 8,
		borderRadius: 20,
	},
	searchBar: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		height: 44,
		borderRadius: 10,
		paddingHorizontal: 12,
	},
	input: {
		flex: 1,
		height: "100%",
		fontSize: 16,
		marginLeft: 4,
	},
	list: {
		paddingBottom: 20,
	},
	resultItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "rgba(0,0,0,0.1)",
	},
	resultIcon: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	resultText: {
		flex: 1,
	},
	emptyContainer: {
		flex: 1,
		padding: 16,
	},
	noResults: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	recentsContainer: {
		paddingVertical: 8,
	},
	recentsHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
		paddingHorizontal: 8,
	},
	recentItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 12,
		borderRadius: 8,
	},
});
export default SearchOverlay;
```

## File: apps/merchant-app/components/ui/Badge.tsx
```typescript
import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "./Text";
export interface BadgeProps extends ViewProps {
	text: string;
	variant?: "primary" | "success" | "warning" | "info" | "error";
}
export const Badge: React.FC<BadgeProps> = ({
	text,
	variant = "primary",
	...props
}) => {
	const theme = useTheme();
	const getBadgeColor = () => {
		switch (variant) {
			case "primary":
				return theme.colors.primary;
			case "success":
				return theme.colors.success;
			case "warning":
				return theme.colors.warning;
			case "info":
				return theme.colors.info;
			case "error":
				return theme.colors.error;
		}
	};
	const styles = StyleSheet.create({
		badge: {
			backgroundColor: getBadgeColor(),
			paddingHorizontal: theme.spacing.sm,
			paddingVertical: theme.spacing.xs / 2,
			borderRadius: theme.radius.badge,
			minWidth: 24,
			alignItems: "center",
		},
	});
	return (
		<View style={[styles.badge, props.style]} {...props}>
			<Text variant="xs" weight="medium" color="white">
				{text}
			</Text>
		</View>
	);
};
```

## File: apps/merchant-app/components/meal-plan-card.tsx
```typescript
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography, QarnShadows } from "@/constants/Typography";
interface MealPlanCardProps {
	title: string;
	price: string;
	calories: string;
	image: string;
	meals: string;
	diet: string;
	onPress: () => void;
	featured?: boolean;
}
const MealPlanCard = ({
	title,
	price,
	calories,
	image,
	meals,
	diet,
	onPress,
}: MealPlanCardProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];
	const shadows = QarnShadows[isDark ? "dark" : "light"];
	return (
		<TouchableOpacity
			style={{
				height: 160,
				borderRadius: QarnRadius.card,
				marginRight: QarnSpacing.md,
				width: 260,
				overflow: "hidden",
				backgroundColor: tokens.card,
				...shadows.medium,
			}}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View
				style={{
					height: 100,
					backgroundColor: isDark ? tokens.cardAlt : "#EFEFEF",
					justifyContent: "flex-end",
				}}
			>
				<View
					style={{
						backgroundColor: tokens.primary,
						position: "absolute",
						top: QarnSpacing.sm,
						left: QarnSpacing.sm,
						paddingHorizontal: QarnSpacing.sm,
						paddingVertical: QarnSpacing.xs,
						borderRadius: QarnRadius.badge,
						zIndex: 10,
						minHeight: 24,
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							color: "white",
							fontWeight: QarnTypography.weights.semibold,
							fontSize: QarnTypography.sizes.xs,
						}}
					>
						{diet}
					</Text>
				</View>
				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Ionicons
						name={image as any}
						size={QarnSizes.iconLg + 12}
						color={tokens.primary}
					/>
				</View>
				<View
					style={{
						backgroundColor: isDark
							? "rgba(0,0,0,0.7)"
							: "rgba(255,255,255,0.8)",
						borderTopLeftRadius: QarnRadius.sm,
						paddingVertical: QarnSpacing.xs,
						paddingHorizontal: QarnSpacing.sm,
						alignSelf: "flex-start",
						margin: QarnSpacing.sm,
						flexDirection: "row",
						alignItems: "center",
						minHeight: 28,
					}}
				>
					<Ionicons name="flame" size={QarnSizes.iconXs} color="#FF9500" />
					<Text
						style={{
							fontWeight: QarnTypography.weights.medium,
							fontSize: QarnTypography.sizes.xs,
							color: isDark ? tokens.text : tokens.text,
							marginLeft: 4,
						}}
					>
						{calories} cal
					</Text>
				</View>
			</View>
			<View style={{ padding: QarnSpacing.md }}>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<Text
						style={{
							fontWeight: QarnTypography.weights.semibold,
							fontSize: QarnTypography.sizes.md,
							color: tokens.text,
							flex: 1,
						}}
						numberOfLines={1}
					>
						{title}
					</Text>
					<Text
						style={{
							fontWeight: QarnTypography.weights.bold,
							fontSize: QarnTypography.sizes.md,
							color: tokens.primary,
						}}
					>
						${price}
					</Text>
				</View>
				<View
					style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
				>
					<Ionicons
						name="calendar-outline"
						size={QarnSizes.iconXs}
						color={tokens.textSecondary}
					/>
					<Text
						style={{
							marginLeft: 4,
							fontSize: QarnTypography.sizes.sm,
							color: tokens.textSecondary,
						}}
					>
						{meals} meals weekly
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};
export default MealPlanCard;
```

## File: apps/merchant-app/constants/theme.ts
```typescript
import { Platform } from "react-native";
const colorPalette = {
	primary: {
		50: "#EBFFF9",
		100: "#C3FFF0",
		200: "#9BFFE6",
		300: "#5FF6D8",
		400: "#22E5C8",
		500: "#0AC5AB",
		600: "#09A98F",
		700: "#07866F",
		800: "#056952",
		900: "#034C3A",
	},
	secondary: {
		50: "#F2EFFF",
		100: "#E4DFFF",
		200: "#CABFFF",
		300: "#A799FF",
		400: "#8E7AFF",
		500: "#7559FF",
		600: "#6038FF",
		700: "#4E1AFF",
		800: "#3C00FB",
		900: "#2F00C2",
	},
	neutral: {
		0: "#FFFFFF",
		50: "#F9FAFB",
		100: "#F1F5F9",
		200: "#E2E8F0",
		300: "#CBD5E1",
		400: "#94A3B8",
		500: "#64748B",
		600: "#475569",
		700: "#334155",
		800: "#1E293B",
		900: "#0F172A",
		950: "#020617",
		1000: "#000000",
	},
};
const getPrimaryLightRgba = (hex: string, alpha: number) => {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export const theme = {
	colors: {
		light: {
			primary: colorPalette.primary[500],
			primaryDark: colorPalette.primary[600],
			primaryLight: colorPalette.primary[50],
			secondary: colorPalette.secondary[500],
			secondaryLight: colorPalette.secondary[50],
			background: colorPalette.neutral[50],
			backgroundAlt: colorPalette.neutral[100],
			card: colorPalette.neutral[0],
			cardAlt: colorPalette.neutral[100],
			text: colorPalette.neutral[900],
			textSecondary: colorPalette.neutral[600],
			textMuted: colorPalette.neutral[400],
			success: colorPalette.primary[500],
			warning: "#FFBE0B",
			info: colorPalette.secondary[500],
			error: "#FF5E5B",
			divider: colorPalette.neutral[200],
			overlay: "rgba(0,0,0,0.3)",
			shadow: "rgba(15,23,42,0.08)",
			tabBar: colorPalette.neutral[0],
			tabIconDefault: colorPalette.neutral[400],
			tabIconSelected: colorPalette.primary[500],
		},
		dark: {
			primary: colorPalette.primary[400],
			primaryDark: colorPalette.primary[500],
			primaryLight: getPrimaryLightRgba(colorPalette.primary[400], 0.15),
			secondary: colorPalette.secondary[400],
			secondaryLight: getPrimaryLightRgba(colorPalette.secondary[400], 0.15),
			background: "#0A0D14",
			backgroundAlt: "#121827",
			card: "#1A2236",
			cardAlt: "#263147",
			text: colorPalette.neutral[50],
			textSecondary: colorPalette.neutral[300],
			textMuted: colorPalette.neutral[500],
			success: colorPalette.primary[400],
			warning: "#FFBE0B",
			info: colorPalette.secondary[400],
			error: "#FF5E5B",
			divider: "rgba(255, 255, 255, 0.1)",
			overlay: "rgba(0,0,0,0.6)",
			shadow: "rgba(0,0,0,0.5)",
			tabBar: "#1A2236",
			tabIconDefault: colorPalette.neutral[500],
			tabIconSelected: colorPalette.primary[400],
		},
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
		xxl: 48,
		screenPadding: 16,
		cardPadding: 16,
		itemSpacing: 12,
		sectionSpacing: 24,
	},
	radius: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 24,
		round: 999,
		button: 12,
		card: 16,
		input: 12,
		badge: 12,
	},
	sizes: {
		touchTarget: 44,
		smallTouchTarget: 36,
		iconXs: 16,
		iconSm: 20,
		iconMd: 24,
		iconLg: 32,
		buttonSm: 36,
		buttonMd: 44,
		buttonLg: 52,
		inputHeight: 48,
		headerHeight: 56,
		tabBarHeight: 49,
		avatarSm: 32,
		avatarMd: 44,
		avatarLg: 64,
	},
	typography: {
		sizes: {
			xs: 12,
			sm: 14,
			md: 16,
			lg: 18,
			xl: 20,
			xxl: 24,
			xxxl: 30,
		},
		weights: {
			regular: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800",
		} as const,
		lineHeights: {
			tight: 1.2,
			normal: 1.5,
			loose: 1.8,
		},
	},
	shadows: {
		small: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 2,
			elevation: 1,
		},
		medium: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 2,
		},
		large: {
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.1,
			shadowRadius: 8,
			elevation: 4,
		},
	},
	platform: {
		topInset: Platform.OS === "ios" ? 44 : 16,
		bottomInset: Platform.OS === "ios" ? 34 : 16,
		isIOS: Platform.OS === "ios",
	},
};
export type ThemeColors = typeof theme.colors.light;
export type ThemeMode = "light" | "dark";
export const getThemedValue = (mode: ThemeMode) => theme.colors[mode];
export const spacing = theme.spacing;
export const radius = theme.radius;
export const sizes = theme.sizes;
export const typography = theme.typography;
export const shadows = theme.shadows;
```

## File: .nvimrc
```
23.11.0
```

## File: apps/merchant-app/app/_layout.tsx
```typescript
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);
	if (!loaded) {
		return null;
	}
	return (
		<SafeAreaProvider>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style="auto" />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
```

## File: pnpm-workspace.yaml
```yaml
packages:
  - apps/*
catalog:
  '@biomejs/biome': 1.9.4
  typescript: ~5.8.3
catalogs:
  react18:
    react: 18.3.1
    react-dom: 18.3.1
    '@types/react': ^18.3.3
    '@types/react-dom': ^18.3.0
  react-native:
    react: 19.0.0
    react-dom: 19.0.0
    react-native: 0.79.0
    '@types/react': ~19.0.10
nodeLinker: hoisted
onlyBuiltDependencies:
  - '@biomejs/biome'
```

## File: .gitignore
```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
next-env.d.ts
#sveltekit
.svelte-kit
# nitro
.nitro/
.output/

# expo
.expo
expo-env.d.ts
ios/
android/
*.gen.ts

# production
build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env
.env*.local

# typescript
*.tsbuildinfo
dist/

# turbo
.turbo




# Output
.cache
.output
.vercel
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
.maestro/tests/
messages.js
```

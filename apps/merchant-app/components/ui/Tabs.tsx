import React from "react";
import { Pressable } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";
import { useTheme } from "@/stores/themeStore";
import * as Haptics from "expo-haptics";
import { radius } from "@/constants/theme/radius";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
type TabItem = {
	key: string;
	label: string;
	accessibilityLabel?: string;
	accessibilityHint?: string;
};

export type TabType = string | TabItem;

interface TabsProps {
	tabs: TabType[];
	selectedTab: string;
	onSelectTab: (tab: string) => void;
	labelRender?: (tab: string) => string;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

type TabItemProps = {
	tab: TabType;
	isSelected: boolean;
	onSelectTab: (key: string) => void;
	labelRender?: (tab: string) => string;
};

// Separate Tab component for better React Compiler optimization
const TabItem = ({
	tab,
	isSelected,
	onSelectTab,
	labelRender,
}: TabItemProps) => {
	const theme = useTheme();
	const tabKey = typeof tab === "string" ? tab : tab.key;
	const tabLabel =
		typeof tab === "string"
			? labelRender
				? labelRender(tab)
				: tab
			: tab.label;

	const tabAccessibilityLabel =
		typeof tab !== "string" ? tab.accessibilityLabel || tabLabel : tabLabel;
	const tabAccessibilityHint =
		typeof tab !== "string" ? tab.accessibilityHint : undefined;
	const pressed = useSharedValue(0);

	const handlePressIn = () => {
		pressed.value = withTiming(1, { duration: 150 });
	};

	const handlePressOut = () => {
		pressed.value = withTiming(0, { duration: 200 });
	};

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(pressed.value, [0, 1], [1, 0.7]),
	}));
	const handlePress = () => {
		if (!isSelected) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			onSelectTab(tabKey);
		}
	};

	return (
		<AnimatedPressable
			style={[
				{
					flex: 1,
					paddingVertical: 10,
					paddingHorizontal: 12,
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "row",
					borderRadius: radius.md,
					gap: theme.spacing.xs,
				},
				animatedStyle,
			]}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			onPress={handlePress}
			android_ripple={{
				color: theme.colors.overlay,
				borderless: true,
				radius: 16,
				foreground: true,
			}}
			accessibilityRole="tab"
			accessibilityLabel={tabAccessibilityLabel}
			accessibilityHint={tabAccessibilityHint}
		>
			<Text
				variant="sm"
				color={isSelected ? "primary" : "textSecondary"}
				weight={isSelected ? "bold" : "medium"}
			>
				{tabLabel}
			</Text>
		</AnimatedPressable>
	);
};

export const Tabs = ({
	tabs,
	selectedTab,
	onSelectTab,
	labelRender,
	accessibilityLabel,
	accessibilityHint,
}: TabsProps) => {
	return (
		<Box
			row
			bg="transparent"
			accessibilityRole="tablist"
			accessibilityLabel={accessibilityLabel || "Tab navigation"}
			accessibilityHint={accessibilityHint}
		>
			{tabs.map((tab) => {
				const key = typeof tab === "string" ? tab : tab.key;
				return (
					<TabItem
						key={key}
						tab={tab}
						isSelected={selectedTab === key}
						onSelectTab={onSelectTab}
						labelRender={labelRender}
					/>
				);
			})}
		</Box>
	);
};

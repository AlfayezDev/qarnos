import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Box } from "./Box";
import { Text } from "./Text";
import { AppTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";

interface TabsProps {
	tabs: string[];
	selectedTab: string;
	onSelectTab: (tab: string) => void;
	theme: AppTheme;
}

const AnimatedBox = Animated.createAnimatedComponent(Box);

export const Tabs: React.FC<TabsProps> = React.memo(
	({ tabs, selectedTab, onSelectTab, theme }) => {
		const handlePress = (tab: string) => {
			if (tab !== selectedTab) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				onSelectTab(tab);
			}
		};
		return (
			<AnimatedBox
				entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
				style={localStyles.tabsContainer}
				bg="backgroundAlt"
				rounded="md"
				padding="xs"
				row
			>
				{tabs.map((tab) => (
					<Pressable
						key={tab}
						style={({ pressed }) => [
							localStyles.tab,
							{ borderRadius: theme.radius.sm },
							tab === selectedTab && [
								localStyles.selectedTab,
								{
									backgroundColor: theme.colors.card,
									shadowColor: theme.colors.shadow,
								},
							],
							pressed && { opacity: 0.5 },
						]}
						onPress={() => handlePress(tab)}
						android_ripple={{ color: theme.colors.overlay, borderless: true }}
					>
						<Text
							variant="sm"
							weight={tab === selectedTab ? "semibold" : "medium"}
							color={tab === selectedTab ? "primary" : "textSecondary"}
						>
							{tab}
						</Text>
					</Pressable>
				))}
			</AnimatedBox>
		);
	},
);

const localStyles = StyleSheet.create({
	tabsContainer: { flexDirection: "row" },
	tab: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedTab: {
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
});

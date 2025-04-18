import React from "react";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Box } from "./Box";
import { Text } from "./Text";
import { AppTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";

interface TabsProps {
	tabs: string[];
	selectedTab: string;
	onSelectTab: (tab: string) => void;
	theme: AppTheme;
	labelRender: (tab: string) => string;
}

export const Tabs: React.FC<TabsProps> = React.memo(
	({ tabs, selectedTab, onSelectTab, theme, labelRender }) => {
		const handlePress = (tab: string) => {
			if (tab !== selectedTab) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				onSelectTab(tab);
			}
		};

		return (
			<Box
				style={{
					flexDirection: "row",
				}}
				bg="backgroundAlt"
				rounded="md"
				padding="xs"
				row
			>
				{tabs.map((tab) => (
					<Pressable
						key={tab}
						style={({ pressed }) => [
							{
								flex: 1,
								paddingVertical: 8,
								paddingHorizontal: 12,
								alignItems: "center",
								justifyContent: "center",
							},
							{ borderRadius: theme.radius.sm },
							tab === selectedTab && [
								{
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.1,
									shadowRadius: 2,
									elevation: 2,
								},
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
							{labelRender(tab)}
						</Text>
					</Pressable>
				))}
			</Box>
		);
	},
);

import React from "react";
import { Pressable } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

type TabItem = {
	key: string;
	label: string;
	iconLeft?: string;
	iconRight?: string;
};

export type TabType = string | TabItem;

interface TabsProps {
	tabs: TabType[];
	selectedTab: string;
	onSelectTab: (tab: string) => void;
	labelRender?: (tab: string) => string;
}

export const Tabs = React.memo(
	({ tabs, selectedTab, onSelectTab, labelRender }: TabsProps) => {
		const theme = useTheme();

		const handlePress = (tab: TabType) => {
			const tabKey = typeof tab === "string" ? tab : tab.key;
			if (tabKey !== selectedTab) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				onSelectTab(tabKey);
			}
		};

		const getTabLabel = (tab: TabType): string => {
			if (typeof tab === "string") {
				return labelRender ? labelRender(tab) : tab;
			}
			return tab.label;
		};

		const isTabSelected = (tab: TabType): boolean => {
			const tabKey = typeof tab === "string" ? tab : tab.key;
			return tabKey === selectedTab;
		};

		return (
			<Box row bg={theme.colors.backgroundAlt} rounded="md" padding="xs">
				{tabs.map((tab) => {
					const isSelected = isTabSelected(tab);
					const tabKey = typeof tab === "string" ? tab : tab.key;
					return (
						<Pressable
							key={tabKey}
							style={({ pressed }) => ({
								flex: 1,
								paddingVertical: 8,
								paddingHorizontal: 12,
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "row",
								borderRadius: theme.radius.sm,
								backgroundColor: isSelected ? theme.colors.card : undefined,
								shadowOffset: isSelected ? { width: 0, height: 1 } : undefined,
								shadowOpacity: isSelected ? 0.1 : undefined,
								shadowRadius: isSelected ? 2 : undefined,
								elevation: isSelected ? 2 : undefined,
								shadowColor: isSelected ? theme.colors.shadow : undefined,
								opacity: pressed ? 0.5 : 1,
							})}
							onPress={() => handlePress(tab)}
							android_ripple={{ color: theme.colors.overlay, borderless: true }}
						>
							{typeof tab !== "string" && tab.iconLeft && (
								<Ionicons
									name={tab.iconLeft as any}
									size={theme.sizes.iconSm}
									color={
										isSelected
											? theme.colors.primary
											: theme.colors.textSecondary
									}
									style={{ marginEnd: theme.spacing.xs }}
								/>
							)}
							<Text
								variant="sm"
								weight={isSelected ? "semibold" : "medium"}
								color={isSelected ? "primary" : "textSecondary"}
							>
								{getTabLabel(tab)}
							</Text>
							{typeof tab !== "string" && tab.iconRight && (
								<Ionicons
									name={tab.iconRight as any}
									size={theme.sizes.iconSm}
									color={
										isSelected
											? theme.colors.primary
											: theme.colors.textSecondary
									}
									style={{ marginStart: theme.spacing.xs }}
								/>
							)}
						</Pressable>
					);
				})}
			</Box>
		);
	},
);

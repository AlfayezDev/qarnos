import React, { useMemo } from "react";
import { Pressable } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";
import { useTheme } from "@/stores/themeStore";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { radius } from "@/constants/theme/radius";

type TabItem = {
	key: string;
	label: string;
	iconLeft?: string;
	iconRight?: string;
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

export const Tabs = React.memo(
	({
		tabs,
		selectedTab,
		onSelectTab,
		labelRender,
		accessibilityLabel,
		accessibilityHint,
	}: TabsProps) => {
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

		// Memorize tab renderings to prevent unnecessary re-renders
		const renderedTabs = useMemo(() => {
			return tabs.map((tab) => {
				const isSelected = isTabSelected(tab);
				const tabKey = typeof tab === "string" ? tab : tab.key;
				const tabLabel = getTabLabel(tab);
				const iconLeft = typeof tab !== "string" ? tab.iconLeft : undefined;
				const iconRight = typeof tab !== "string" ? tab.iconRight : undefined;
				const tabAccessibilityLabel =
					typeof tab !== "string"
						? tab.accessibilityLabel || tabLabel
						: tabLabel;
				const tabAccessibilityHint =
					typeof tab !== "string" ? tab.accessibilityHint : undefined;

				return (
					<Pressable
						key={tabKey}
						style={({ pressed }) => ({
							flex: 1,
							paddingVertical: 10,
							paddingHorizontal: 12,
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "row",
							borderRadius: radius.md,
							opacity: pressed ? 0.7 : 1,
							gap: theme.spacing.xs,
						})}
						onPress={() => handlePress(tab)}
						android_ripple={{ color: theme.colors.overlay, borderless: true }}
						accessibilityRole="tab"
						accessibilityLabel={tabAccessibilityLabel}
						accessibilityHint={tabAccessibilityHint}
					>
						{iconLeft && (
							<Ionicons
								name={iconLeft as any}
								size={theme.sizes.iconSm}
								color={
									isSelected ? theme.colors.primary : theme.colors.textSecondary
								}
							/>
						)}
						<Text
							variant="sm"
							color={isSelected ? "primary" : "textSecondary"}
							weight={isSelected ? "bold" : "medium"}
						>
							{tabLabel}
						</Text>
						{iconRight && (
							<Ionicons
								name={iconRight as any}
								size={theme.sizes.iconSm}
								color={
									isSelected ? theme.colors.primary : theme.colors.textSecondary
								}
							/>
						)}
					</Pressable>
				);
			});
		}, [tabs, selectedTab, theme, labelRender]);

		return (
			<Box
				row
				bg="transparent" // No background
				accessibilityRole="tablist"
				accessibilityLabel={accessibilityLabel || "Tab navigation"}
				accessibilityHint={accessibilityHint}
			>
				{renderedTabs}
			</Box>
		);
	},
	(prevProps, nextProps) => {
		// Custom equality check for the Tabs component
		if (prevProps.selectedTab !== nextProps.selectedTab) {
			return false;
		}

		if (prevProps.tabs.length !== nextProps.tabs.length) {
			return false;
		}

		// Compare each tab
		for (let i = 0; i < prevProps.tabs.length; i++) {
			const prevTab = prevProps.tabs[i];
			const nextTab = nextProps.tabs[i];

			if (typeof prevTab !== typeof nextTab) {
				return false;
			}

			if (typeof prevTab === "string" && typeof nextTab === "string") {
				if (prevTab !== nextTab) {
					return false;
				}
			} else if (typeof prevTab === "object" && typeof nextTab === "object") {
				if (
					prevTab.key !== nextTab.key ||
					prevTab.label !== nextTab.label ||
					prevTab.iconLeft !== nextTab.iconLeft ||
					prevTab.iconRight !== nextTab.iconRight
				) {
					return false;
				}
			}
		}

		// If we reached here, the tabs are equal
		return true;
	},
);

import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { EdgeInsets } from "react-native-safe-area-context";

interface DashboardHeaderProps {
	theme: AppTheme;
	insets: EdgeInsets;
	animatedStyle: any;
	currentDateString: string;
	onSettingsPress: () => void;
	headerHeight: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
	theme,
	insets,
	animatedStyle,
	currentDateString,
	onSettingsPress,
	headerHeight,
}) => (
	<Animated.View
		style={[
			localStyles.headerBase,
			{
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
				height: headerHeight + insets.top,
				paddingHorizontal: theme.spacing.md,
				paddingBottom: theme.spacing.sm,
			},
			animatedStyle,
		]}
	>
		<View style={localStyles.headerContent}>
			<View>
				<Text
					variant="xs"
					color="textSecondary"
					weight="medium"
					style={localStyles.headerTitleSmall}
				>
					Dashboard
				</Text>
				<Text variant="xl" weight="semibold">
					{currentDateString}
				</Text>
			</View>
			<Pressable
				onPress={onSettingsPress}
				style={({ pressed }) => [
					localStyles.iconButton,
					pressed && { backgroundColor: theme.colors.overlay },
				]}
				android_ripple={{ color: theme.colors.overlay, borderless: true }}
			>
				<Ionicons
					name="settings-outline"
					size={theme.sizes.iconMd}
					color={theme.colors.textSecondary}
				/>
			</Pressable>
		</View>
	</Animated.View>
);

const localStyles = StyleSheet.create({
	headerBase: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
	},
	headerContent: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerTitleSmall: {
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	iconButton: {
		padding: 8,
		borderRadius: 20,
	},
});

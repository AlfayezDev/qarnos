import { Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { EdgeInsets } from "react-native-safe-area-context";

import { useTranslation } from "@/hooks/useTranslation";
interface DashboardHeaderProps {
	theme: AppTheme;
	insets: EdgeInsets;
	animatedStyle: any;
	currentDateString: string;
	onSettingsPress: () => void;
	headerHeight: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = memo(
	({
		theme,
		insets,
		animatedStyle,
		currentDateString,
		onSettingsPress,
		headerHeight,
	}) => {
		const { t } = useTranslation();

		return (
			<Animated.View
				style={[
					{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						zIndex: 100,
					},
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
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<View>
						<Text
							variant="xs"
							color="textSecondary"
							weight="medium"
							style={{
								textTransform: "uppercase",
								letterSpacing: 0.5,
							}}
						>
							{t("dashboard.title")}
						</Text>
						<Text variant="xl" weight="semibold">
							{currentDateString}
						</Text>
					</View>
					<Pressable
						onPress={onSettingsPress}
						style={({ pressed }) => [
							{
								padding: 8,
								borderRadius: 20,
							},
							pressed && { backgroundColor: theme.colors.overlay },
						]}
						android_ripple={{ color: theme.colors.overlay, borderless: true }}
						accessible={true}
						accessibilityLabel={t("common.more")}
						accessibilityRole="button"
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
	},
);

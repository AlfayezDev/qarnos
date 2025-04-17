import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Alert } from "@/types";
import { QarnSpacing } from "@/constants/Spacing";

interface AlertRowProps {
	alert: Alert;
	theme: AppTheme;
	onPress: () => void;
}

export const AlertRow: React.FC<AlertRowProps> = React.memo(
	({ alert, theme, onPress }) => {
		const iconColor = theme.colors[alert.type];
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					{
						paddingHorizontal: theme.spacing.sm,
						flexDirection: "row",
						alignItems: "center",
						paddingVertical: theme.spacing.md,
						borderRadius: theme.radius.sm,
					},
					pressed && {
						backgroundColor: theme.colors.backgroundAlt,
					},
				]}
				android_ripple={{ color: theme.colors.overlay }}
			>
				<Ionicons
					name={alert.icon as any}
					size={theme.sizes.iconSm}
					color={iconColor}
					style={{ marginRight: theme.spacing.md }}
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
			</Pressable>
		);
	},
);

const localStyles = StyleSheet.create({
	alertRowContainer: {
		paddingHorizontal: QarnSpacing.sm,
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
	},
});

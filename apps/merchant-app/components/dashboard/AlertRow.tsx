import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { Alert } from "@/types";

interface AlertRowProps {
	alert: Alert;
	onPress: () => void;
}

export const AlertRow = React.memo(({ alert, onPress }: AlertRowProps) => {
	const theme = useTheme();
	const iconColor = theme.colors[alert.type];

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => ({
				paddingHorizontal: theme.spacing.sm,
				flexDirection: "row",
				alignItems: "center",
				paddingVertical: theme.spacing.md,
				borderRadius: theme.radius.sm,
				backgroundColor: pressed ? theme.colors.backgroundAlt : undefined,
			})}
			android_ripple={{ color: theme.colors.overlay }}
		>
			<Ionicons
				name={alert.icon as any}
				size={theme.sizes.iconSm}
				color={iconColor}
				style={{ marginStart: theme.spacing.md }}
			/>
			<Box flex={1}>
				<Text variant="sm" numberOfLines={1}>
					{alert.title}
				</Text>
				{alert.timestamp && (
					<Text variant="xs" color="textMuted" marginTop={theme.spacing.xs / 2}>
						{alert.timestamp}
					</Text>
				)}
			</Box>
			<Ionicons
				name="chevron-back"
				size={theme.sizes.iconSm}
				color={theme.colors.textMuted}
			/>
		</Pressable>
	);
});

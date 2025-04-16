import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "./Text";

interface BadgeProps extends ViewProps {
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

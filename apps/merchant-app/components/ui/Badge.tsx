import React from "react";
import { View, ViewProps, AccessibilityState } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "./Text";

export interface BadgeProps extends ViewProps {
	text: string | number;
	variant?: "primary" | "success" | "warning" | "info" | "error" | "default";
	size?: "sm" | "md";
	accessibilityLabel?: string;
}

export const Badge = React.memo(
	({
		text,
		variant = "default",
		size = "md",
		style,
		accessibilityLabel,
		...props
	}: BadgeProps) => {
		const theme = useTheme();

		const getBadgeStyles = () => {
			const base = {
				textColor: theme.colors.text,
				bgColor: theme.colors.backgroundAlt,
			};

			switch (variant) {
				case "primary":
					return {
						textColor: theme.colors.background,
						bgColor: theme.colors.primary,
					};
				case "success":
					return {
						textColor: theme.colors.background,
						bgColor: theme.colors.success,
					};
				case "warning":
					return {
						textColor: theme.colors.text,
						bgColor: theme.colors.warning,
					};
				case "info":
					return {
						textColor: theme.colors.background,
						bgColor: theme.colors.info,
					};
				case "error":
					return {
						textColor: theme.colors.background,
						bgColor: theme.colors.error,
					};
				default:
					return base;
			}
		};

		const getSizeStyles = () => {
			switch (size) {
				case "sm":
					return {
						paddingHorizontal: theme.spacing.sm,
						paddingVertical: theme.spacing.xs / 2,
						fontSize: "xs" as const,
					};
				default:
					return {
						paddingHorizontal: theme.spacing.sm,
						paddingVertical: theme.spacing.xs / 2 + 1,
						fontSize: "sm" as const,
					};
			}
		};

		const badgeStyle = getBadgeStyles();
		const sizeStyle = getSizeStyles();

		const badgeStyles = {
			backgroundColor: badgeStyle.bgColor,
			paddingHorizontal: sizeStyle.paddingHorizontal,
			paddingVertical: sizeStyle.paddingVertical,
			borderRadius: theme.radius.badge,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			alignSelf: "flex-start" as const,
		};

		// Accessibility properties
		const accessibilityState: AccessibilityState = {};

		return (
			<View
				style={[badgeStyles, style]}
				accessibilityRole="text"
				accessibilityLabel={accessibilityLabel || `${text} ${variant}`}
				accessibilityState={accessibilityState}
				{...props}
			>
				<Text
					variant={sizeStyle.fontSize}
					weight="medium"
					color={badgeStyle.textColor}
				>
					{text}
				</Text>
			</View>
		);
	},
	(prevProps, nextProps) => {
		// Custom equality check to optimize re-renders
		return (
			prevProps.text === nextProps.text &&
			prevProps.variant === nextProps.variant &&
			prevProps.size === nextProps.size
		);
	},
);

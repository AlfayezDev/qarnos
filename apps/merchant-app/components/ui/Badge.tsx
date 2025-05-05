import React from "react";
import { View, ViewProps, AccessibilityState, ViewStyle } from "react-native";
import { useTheme } from "@/stores/themeStore";
import { Text } from "./Text";

export interface BadgeProps extends ViewProps {
	text: string | number;
	variant?:
		| "primary"
		| "success"
		| "warning"
		| "info"
		| "error"
		| "default"
		| "sage"
		| "peach"
		| "lavender"
		| "coral"
		| "mint"
		| "cream"
		| "sky"
		| "rose";
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
			// Base styles
			const base = {
				textColor: theme.colors.text,
				bgColor: theme.colors.backgroundAlt,
			};

			// Handle lofi accent variants
			const accentVariants = [
				"sage",
				"peach",
				"lavender",
				"coral",
				"mint",
				"cream",
				"sky",
				"rose",
			];

			if (accentVariants.includes(variant)) {
				const accentKey =
					`accent${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof theme.colors;
				return {
					textColor: theme.colors.text,
					bgColor: theme.colors[accentKey],
				};
			}

			// Semantic variants
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

		const badgeStyles: ViewStyle = {
			backgroundColor: badgeStyle.bgColor as string,
			paddingHorizontal: sizeStyle.paddingHorizontal,
			paddingVertical: sizeStyle.paddingVertical,
			borderRadius: theme.radius.badge,
			borderWidth: 1,
			borderColor: theme.colors.divider,
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

import { useTheme } from "@/stores/themeStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	ActivityIndicator,
	TouchableOpacity,
	TouchableOpacityProps,
	AccessibilityState,
} from "react-native";
import { Text } from "./Text";

interface ButtonProps extends TouchableOpacityProps {
	title: string;
	variant?:
		| "primary"
		| "secondary"
		| "outline"
		| "ghost"
		| "sage"
		| "peach"
		| "lavender"
		| "coral"
		| "mint"
		| "cream"
		| "sky"
		| "rose";
	size?: "sm" | "md" | "lg";
	leftIcon?: string;
	rightIcon?: string;
	loading?: boolean;
	rounded?: boolean;
	fullWidth?: boolean;
	textColor?: string;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

export const Button = ({
	title,
	variant = "primary",
	size = "md",
	leftIcon,
	rightIcon,
	loading = false,
	rounded = false,
	fullWidth = false,
	style,
	textColor: textColorOverride,
	accessibilityLabel,
	accessibilityHint,
	...props
}: ButtonProps) => {
	const theme = useTheme();

	const getVariantStyles = () => {
		// Handle lofi accent color variants
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
				backgroundColor: theme.colors[accentKey],
				textColorToken: theme.colors.text,
			};
		}

		switch (variant) {
			case "primary":
				return {
					backgroundColor: theme.colors.primary,
					textColorToken: theme.colors.background,
				};
			case "secondary":
				return {
					backgroundColor: theme.colors.cardAlt,
					textColorToken: theme.colors.text,
				};
			case "outline":
				return {
					backgroundColor: "transparent",
					borderWidth: 1,
					borderColor: theme.colors.primary,
					textColorToken: theme.colors.primary,
				};
			case "ghost":
				return {
					backgroundColor: "transparent",
					textColorToken: theme.colors.primary,
				};
			default:
				return {
					backgroundColor: theme.colors.primary,
					textColorToken: theme.colors.background,
				};
		}
	};

	const getSizeStyles = () => {
		switch (size) {
			case "sm":
				return {
					height: theme.sizes.buttonSm,
					paddingHorizontal: theme.spacing.md,
					fontSize: "sm" as const,
					iconSize: theme.sizes.iconXs,
				};
			case "md":
				return {
					height: theme.sizes.buttonMd,
					paddingHorizontal: theme.spacing.md,
					fontSize: "md" as const,
					iconSize: theme.sizes.iconSm,
				};
			case "lg":
				return {
					height: theme.sizes.buttonLg,
					paddingHorizontal: theme.spacing.lg,
					fontSize: "md" as const,
					iconSize: theme.sizes.iconMd,
				};
			default:
				return {
					height: theme.sizes.buttonMd,
					paddingHorizontal: theme.spacing.md,
					fontSize: "md" as const,
					iconSize: theme.sizes.iconSm,
				};
		}
	};

	const variantStyle = getVariantStyles();
	const sizeStyle = getSizeStyles();
	const finalTextColor = textColorOverride || variantStyle.textColorToken;
	const iconStyle = {
		marginEnd: leftIcon && title ? theme.spacing.xs : 0,
		marginStart: rightIcon && title ? theme.spacing.xs : 0,
	};

	const accessibilityState: AccessibilityState = {
		disabled: loading || props.disabled,
	};

	return (
		<TouchableOpacity
			style={[
				{
					height: sizeStyle.height,
					paddingHorizontal: sizeStyle.paddingHorizontal,
					borderRadius: rounded ? theme.radius.round : theme.radius.button,
					backgroundColor: variantStyle.backgroundColor,
					borderWidth: variantStyle.borderWidth || 0,
					borderColor: variantStyle.borderColor,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					width: fullWidth ? "100%" : undefined,
				} as TouchableOpacityProps["style"],
				style,
			]}
			activeOpacity={0.8}
			disabled={loading || props.disabled}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel || title}
			accessibilityHint={accessibilityHint}
			accessibilityState={accessibilityState}
			{...props}
		>
			{loading ? (
				<ActivityIndicator color={finalTextColor} size="small" />
			) : (
				<>
					{leftIcon && (
						<Ionicons
							name={leftIcon as any}
							size={sizeStyle.iconSize}
							color={finalTextColor}
							style={iconStyle}
						/>
					)}
					<Text
						variant={sizeStyle.fontSize}
						weight="medium"
						color={finalTextColor as ColorToken}
					>
						{title}
					</Text>
					{rightIcon && (
						<Ionicons
							name={rightIcon as any}
							size={sizeStyle.iconSize}
							color={finalTextColor}
							style={iconStyle}
						/>
					)}
				</>
			)}
		</TouchableOpacity>
	);
};

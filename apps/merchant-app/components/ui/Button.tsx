import React from "react";
import {
	TouchableOpacity,
	TouchableOpacityProps,
	StyleSheet,
	StyleProp,
	ViewStyle,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "./Text";
interface ButtonProps extends TouchableOpacityProps {
	title: string;
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	leftIcon?: string;
	rightIcon?: string;
	loading?: boolean;
	rounded?: boolean;
	fullWidth?: boolean;
	style?: StyleProp<ViewStyle>;
	textColor?: string; // Allow overriding text color
}
export const Button: React.FC<ButtonProps> = ({
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
	...props
}) => {
	const theme = useTheme();
	const getVariantStyles = () => {
		switch (variant) {
			case "primary":
				return {
					backgroundColor: theme.colors.primary,
					textColorToken: theme.colors.background, // Assuming white/light bg for primary btn
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
	const styles = StyleSheet.create({
		button: {
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
		},
		icon: {
			marginRight: leftIcon && title ? theme.spacing.xs : 0,
			marginLeft: rightIcon && title ? theme.spacing.xs : 0,
		},
	});
	return (
		<TouchableOpacity
			style={[styles.button, style]}
			activeOpacity={0.7}
			disabled={loading || props.disabled}
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
							style={styles.icon}
						/>
					)}
					<Text
						variant={sizeStyle.fontSize}
						weight="semibold"
						color={finalTextColor}
					>
						{title}
					</Text>
					{rightIcon && (
						<Ionicons
							name={rightIcon as any}
							size={sizeStyle.iconSize}
							color={finalTextColor}
							style={styles.icon}
						/>
					)}
				</>
			)}
		</TouchableOpacity>
	);
};

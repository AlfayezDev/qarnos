import React from "react";
import {
	TouchableOpacity,
	TouchableOpacityProps,
	StyleProp,
	ViewStyle,
	View,
} from "react-native";
import { useTheme } from "@/stores/themeStore";
import { getRgba } from "@/constants/theme/colors";

interface CardProps extends TouchableOpacityProps {
	elevation?: "none" | "small" | "medium" | "large";
	gap?: SpacingToken;
	padding?: string | number | SpacingToken;
	rounded?: string | RadiusToken;
	style?: StyleProp<ViewStyle>;
	children?: React.ReactNode;
	variant?:
		| "default"
		| "sage"
		| "peach"
		| "lavender"
		| "coral"
		| "mint"
		| "cream"
		| "sky"
		| "rose";
}

export const Card = React.memo(
	({
		children,
		gap,
		elevation = "small",
		padding = "md",
		rounded = "md", // Less rounded by default
		style,
		onPress,
		variant = "default",
		...props
	}: CardProps) => {
		const theme = useTheme();

		const getElevation = () => {
			if (elevation === "none") return {};
			const shadowStyle = theme.shadows[elevation];
			return { ...shadowStyle, shadowColor: theme.colors.shadow };
		};

		const getPaddingValue = () => {
			return typeof padding === "number"
				? padding
				: theme.spacing[padding as SpacingToken];
		};

		const getRadiusValue = () => {
			return theme.radius[rounded as RadiusToken];
		};

		const getSpacingValue = (spacing?: SpacingToken) => {
			if (!spacing) return 0;
			return theme.spacing[spacing];
		};

		// Very subtle, barely noticeable background colors
		const getBackgroundColor = () => {
			// Default to white card
			if (variant === "default") return theme.colors.card;

			// For colored variants, mix the accent color with the card color at a very low opacity
			const accentKey =
				`accent${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof theme.colors;
			const color = theme.colors[accentKey];
			if (color) {
				// Use rgba to create a very subtle background tint (almost white)
				return getRgba(color, 0.08); // Very subtle tint
			}

			return theme.colors.card;
		};

		const cardStyle = {
			backgroundColor: getBackgroundColor(),
			gap: getSpacingValue(gap),
			borderRadius: getRadiusValue(),
			padding: getPaddingValue(),
			borderWidth: 1,
			borderColor: theme.colors.divider,
			...getElevation(),
		};

		const ContainerComponent = onPress ? TouchableOpacity : View;

		return (
			<ContainerComponent
				activeOpacity={onPress ? 0.85 : 1}
				style={[cardStyle, style]}
				onPress={onPress}
				{...props}
			>
				{children}
			</ContainerComponent>
		);
	},
);

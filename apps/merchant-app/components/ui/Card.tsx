import React from "react";
import {
	TouchableOpacity,
	TouchableOpacityProps,
	StyleProp,
	ViewStyle,
	View,
} from "react-native";
import { RadiusToken, SpacingToken, useTheme } from "@/hooks/useTheme";

interface CardProps extends TouchableOpacityProps {
	elevation?: "none" | "small" | "medium" | "large";
	padding?: string | number | SpacingToken;
	rounded?: string | RadiusToken;
	style?: StyleProp<ViewStyle>;
	children?: React.ReactNode;
}

export const Card = React.memo(
	({
		children,
		elevation = "small",
		padding = "md",
		rounded = "card",
		style,
		onPress,
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

		const cardStyle = {
			backgroundColor: theme.colors.card,
			borderRadius: getRadiusValue(),
			padding: getPaddingValue(),
			...getElevation(),
		};

		const ContainerComponent = onPress ? TouchableOpacity : View;

		return (
			<ContainerComponent
				activeOpacity={onPress ? 0.7 : 1}
				style={[cardStyle, style]}
				onPress={onPress}
				{...props}
			>
				{children}
			</ContainerComponent>
		);
	},
);

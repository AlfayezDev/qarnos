import React from "react";
import {
	TouchableOpacity,
	StyleSheet,
	TouchableOpacityProps,
	StyleProp,
	ViewStyle,
} from "react-native";
import { RadiusToken, SpacingToken, useTheme } from "@/hooks/useTheme";

interface CardProps extends TouchableOpacityProps {
	elevation?: "none" | "small" | "medium" | "large";
	padding?: SpacingToken | number;
	rounded?: RadiusToken;
	style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
	children,
	elevation = "small",
	padding = "md",
	rounded = "card",
	style,
	...props
}) => {
	const theme = useTheme();

	const getElevation = () => {
		if (elevation === "none") return {};
		return theme.shadows[elevation];
	};

	const getPadding = () => {
		return typeof padding === "number" ? padding : theme.spacing[padding];
	};

	const styles = StyleSheet.create({
		card: {
			backgroundColor: theme.colors.card,
			borderRadius: theme.radius[rounded],
			padding: getPadding(),
			...getElevation(),
		},
	});

	return (
		<TouchableOpacity
			activeOpacity={props.onPress ? 0.7 : 1}
			style={[styles.card, style]}
			{...props}
		>
			{children}
		</TouchableOpacity>
	);
};

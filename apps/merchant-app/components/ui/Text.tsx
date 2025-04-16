import React from "react";
import {
	Text as RNText,
	TextProps as RNTextProps,
	StyleSheet,
	StyleProp,
	TextStyle,
	I18nManager,
} from "react-native";
import {
	ColorToken,
	FontSizeVariant,
	FontWeightVariant,
	SpacingToken,
	useTheme,
} from "@/hooks/useTheme";

interface TextProps extends RNTextProps {
	variant?: FontSizeVariant;
	weight?: FontWeightVariant;
	color?: ColorToken | string;
	center?: boolean;
	muted?: boolean;
	marginBottom?: SpacingToken | number;
	marginTop?: SpacingToken | number;
	marginLeft?: SpacingToken | number;
	marginRight?: SpacingToken | number;
	marginStart?: SpacingToken | number; // RTL aware
	marginEnd?: SpacingToken | number; // RTL aware
	marginHorizontal?: SpacingToken | number; // Added for meals screen
	margin?: SpacingToken | number;
	style?: StyleProp<TextStyle>;
}

export const Text: React.FC<TextProps> = ({
	children,
	variant = "md",
	weight = "regular",
	color,
	center,
	muted,
	marginBottom,
	marginTop,
	marginLeft,
	marginRight,
	marginStart,
	marginEnd,
	marginHorizontal,
	margin,
	style,
	...props
}) => {
	const theme = useTheme();
	const isRTL = I18nManager.isRTL;

	const getSpacingValue = (
		value: SpacingToken | number | undefined,
	): number | undefined => {
		if (value === undefined) return undefined;
		return typeof value === "number" ? value : theme.spacing[value];
	};

	const getColorValue = (
		colorProp: ColorToken | string | undefined,
	): string => {
		if (colorProp === undefined) {
			return muted ? theme.colors.textSecondary : theme.colors.text;
		}

		// Check if it's a theme color key
		if (typeof colorProp === "string" && colorProp in theme.colors) {
			return theme.colors[colorProp as ColorToken];
		}

		// Otherwise return the raw color value
		return colorProp;
	};

	// Calculate proper RTL-aware margin values
	const finalMarginLeft =
		marginStart !== undefined
			? isRTL
				? undefined
				: getSpacingValue(marginStart)
			: getSpacingValue(marginLeft);

	const finalMarginRight =
		marginEnd !== undefined
			? isRTL
				? undefined
				: getSpacingValue(marginEnd)
			: getSpacingValue(marginRight);

	const finalMarginStart =
		marginStart !== undefined
			? isRTL
				? getSpacingValue(marginStart)
				: undefined
			: undefined;

	const finalMarginEnd =
		marginEnd !== undefined
			? isRTL
				? getSpacingValue(marginEnd)
				: undefined
			: undefined;

	const styles = StyleSheet.create({
		text: {
			fontSize: theme.typography.sizes[variant],
			fontWeight: theme.typography.weights[weight],
			color: getColorValue(color),
			textAlign: center ? "center" : undefined,
			marginBottom: getSpacingValue(marginBottom),
			marginTop: getSpacingValue(marginTop),
			marginLeft: finalMarginLeft,
			marginRight: finalMarginRight,
			marginStart: finalMarginStart,
			marginEnd: finalMarginEnd,
			marginHorizontal: getSpacingValue(marginHorizontal),
			margin: getSpacingValue(margin),
		},
	});

	return (
		<RNText style={[styles.text, style]} {...props}>
			{children}
		</RNText>
	);
};

export default Text;

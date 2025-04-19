import {
	ColorToken,
	FontSizeVariant,
	FontWeightVariant,
	SpacingToken,
	useTheme,
} from "@/hooks/useTheme";
import React, { memo } from "react";
import {
	Text as RNText,
	TextProps as RNTextProps,
	StyleProp,
	TextStyle,
} from "react-native";

interface TextProps extends RNTextProps {
	variant?: FontSizeVariant;
	weight?: FontWeightVariant;
	color?: ColorToken | string;
	center?: boolean;
	muted?: boolean;
	marginBottom?: SpacingToken | number;
	marginTop?: SpacingToken | number;
	marginStart?: SpacingToken | number;
	marginEnd?: SpacingToken | number;
	marginHorizontal?: SpacingToken | number;
	marginVertical?: SpacingToken | number;
	margin?: SpacingToken | number;
	paddingStart?: SpacingToken | number;
	paddingEnd?: SpacingToken | number;
	paddingHorizontal?: SpacingToken | number;
	paddingVertical?: SpacingToken | number;
	paddingTop?: SpacingToken | number;
	paddingBottom?: SpacingToken | number;
	padding?: SpacingToken | number;
	style?: StyleProp<TextStyle>;
	align?: TextStyle["textAlign"];
}

export const Text: React.FC<TextProps> = memo(
	({
		children,
		variant = "md",
		weight = "regular",
		color,
		center,
		muted,
		marginBottom,
		marginTop,
		marginStart,
		marginEnd,
		marginHorizontal,
		marginVertical,
		margin,
		paddingStart,
		paddingEnd,
		paddingHorizontal,
		paddingVertical,
		paddingTop,
		paddingBottom,
		padding,
		style,
		align,
		...props
	}) => {
		const theme = useTheme();

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
			if (typeof colorProp === "string" && colorProp in theme.colors) {
				return theme.colors[colorProp as ColorToken];
			}
			return colorProp;
		};

		const textAlign = center ? "center" : align;

		const textStyle: TextStyle = {
			fontSize: theme.typography.sizes[variant],
			fontWeight: theme.typography.weights[weight],
			color: getColorValue(color),
			textAlign,
			marginBottom: getSpacingValue(marginBottom),
			marginTop: getSpacingValue(marginTop),
			marginStart: getSpacingValue(marginStart),
			marginEnd: getSpacingValue(marginEnd),
			marginHorizontal: getSpacingValue(marginHorizontal),
			marginVertical: getSpacingValue(marginVertical),
			margin: getSpacingValue(margin),
			paddingStart: getSpacingValue(paddingStart),
			paddingEnd: getSpacingValue(paddingEnd),
			paddingHorizontal: getSpacingValue(paddingHorizontal),
			paddingVertical: getSpacingValue(paddingVertical),
			paddingTop: getSpacingValue(paddingTop),
			paddingBottom: getSpacingValue(paddingBottom),
			padding: getSpacingValue(padding),
		};

		return (
			<RNText style={[textStyle, style]} {...props}>
				{children}
			</RNText>
		);
	},
);

export default Text;

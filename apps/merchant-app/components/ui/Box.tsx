import { useTheme } from "@/hooks/useTheme";
import { ColorToken, RadiusToken, SpacingToken } from "@/hooks/useTheme";
import React, { memo } from "react";
import {
	DimensionValue,
	FlexAlignType,
	Pressable,
	StyleProp,
	View,
	ViewProps,
	ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

type JustifyContentType =
	| "flex-start"
	| "flex-end"
	| "center"
	| "space-between"
	| "space-around"
	| "space-evenly";

interface BoxProps extends ViewProps {
	flex?: number;
	row?: boolean;
	center?: boolean;
	alignCenter?: boolean;
	alignItems?: FlexAlignType;
	justifyCenter?: boolean;
	justifyContent?: JustifyContentType;
	card?: boolean;
	padding?: SpacingToken | number;
	gap?: SpacingToken | number;
	margin?: SpacingToken | number;
	marginTop?: SpacingToken | number;
	marginBottom?: SpacingToken | number;
	marginStart?: SpacingToken | number;
	marginEnd?: SpacingToken | number;
	marginHorizontal?: SpacingToken | number;
	marginVertical?: SpacingToken | number;
	paddingHorizontal?: SpacingToken | number;
	paddingBottom?: SpacingToken | number;
	paddingTop?: SpacingToken | number;
	paddingVertical?: SpacingToken | number;
	paddingStart?: SpacingToken | number;
	paddingEnd?: SpacingToken | number;
	rounded?: RadiusToken | number;
	width?: DimensionValue;
	height?: DimensionValue;
	borderWidth?: number;
	borderColor?: ColorToken;
	bg?: ColorToken | string;
	elevation?: "none" | "small" | "medium" | "large";
	style?: StyleProp<ViewStyle>;
	onPress?: () => void;
	activeOpacity?: number;
}

export const Box: React.FC<BoxProps> = memo(
	({
		children,
		flex,
		row,
		gap,
		center,
		alignCenter,
		paddingTop,
		alignItems,
		paddingBottom,
		justifyCenter,
		justifyContent,
		card,
		padding,
		margin,
		marginTop,
		marginBottom,
		marginStart,
		marginEnd,
		marginHorizontal,
		marginVertical,
		paddingHorizontal,
		paddingVertical,
		paddingStart,
		paddingEnd,
		rounded,
		width,
		height,
		borderWidth,
		borderColor,
		bg,
		elevation,
		style,
		onPress,
		activeOpacity = 0.7,
		...props
	}) => {
		const theme = useTheme();

		let finalAlignItems: FlexAlignType | undefined;
		let finalJustifyContent: JustifyContentType | undefined;

		if (center) {
			finalAlignItems = "center";
			finalJustifyContent = "center";
		} else {
			finalAlignItems = alignCenter ? "center" : alignItems;
			finalJustifyContent = justifyCenter ? "center" : justifyContent;
		}

		const getSpacingValue = (
			value: SpacingToken | number | undefined,
		): number | undefined => {
			if (value === undefined) return undefined;
			return typeof value === "number" ? value : theme.spacing[value];
		};

		const getRadiusValue = (
			value: RadiusToken | number | undefined,
		): number | undefined => {
			if (value === undefined) return undefined;
			return typeof value === "number" ? value : theme.radius[value];
		};

		const getColorValue = (
			color: ColorToken | string | undefined,
		): string | undefined => {
			if (color === undefined) return undefined;
			if (typeof color === "string" && color in theme.colors) {
				return theme.colors[color as ColorToken];
			}
			return color;
		};

		const getElevation = (level?: "none" | "small" | "medium" | "large") => {
			if (!level || level === "none") return {};
			const shadowStyle = theme.shadows[level];
			return { ...shadowStyle, shadowColor: theme.colors.shadow };
		};

		const boxStyle: ViewStyle = {
			flex,
			flexDirection: row ? "row" : "column",
			alignItems: finalAlignItems,
			justifyContent: finalJustifyContent,
			padding: getSpacingValue(padding),
			margin: getSpacingValue(margin),
			marginTop: getSpacingValue(marginTop),
			marginBottom: getSpacingValue(marginBottom),
			marginStart: getSpacingValue(marginStart),
			marginEnd: getSpacingValue(marginEnd),
			marginHorizontal: getSpacingValue(marginHorizontal),
			marginVertical: getSpacingValue(marginVertical),
			paddingHorizontal: getSpacingValue(paddingHorizontal),
			paddingVertical: getSpacingValue(paddingVertical),
			gap: getSpacingValue(gap),
			paddingTop: getSpacingValue(paddingTop),
			paddingBottom: getSpacingValue(paddingBottom),
			paddingStart: getSpacingValue(paddingStart),
			paddingEnd: getSpacingValue(paddingEnd),
			borderRadius: getRadiusValue(rounded),
			width,
			height,
			borderWidth,
			borderColor: getColorValue(borderColor),
			backgroundColor: card ? theme.colors.card : getColorValue(bg),
			...(card ? getElevation("small") : {}),
			...(elevation ? getElevation(elevation) : {}),
		};

		if (onPress) {
			return (
				<Pressable
					onPress={onPress}
					style={({ pressed }) => [
						boxStyle,
						{ opacity: pressed ? activeOpacity : 1 },
						style,
					]}
					{...props}
					android_ripple={{ color: theme.colors.overlay }}
				>
					{children}
				</Pressable>
			);
		}

		return (
			<View style={[boxStyle, style]} {...props}>
				{children}
			</View>
		);
	},
);

export default Box;
export const AnimatedBox = Animated.createAnimatedComponent(Box);

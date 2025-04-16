// apps/merchant-app/components/ui/Box.tsx
import React from "react";
import {
	View,
	ViewProps,
	StyleSheet,
	StyleProp,
	ViewStyle,
	DimensionValue,
	FlexAlignType,
	Pressable,
	I18nManager,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SpacingToken, ColorToken, RadiusToken } from "@/hooks/useTheme";

// Type for justifyContent property
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
	margin?: SpacingToken | number;
	marginTop?: SpacingToken | number;
	marginBottom?: SpacingToken | number;
	marginLeft?: SpacingToken | number;
	marginRight?: SpacingToken | number;
	marginStart?: SpacingToken | number; // RTL aware
	marginEnd?: SpacingToken | number; // RTL aware
	marginHorizontal?: SpacingToken | number;
	marginVertical?: SpacingToken | number;
	paddingHorizontal?: SpacingToken | number;
	paddingBottom?: SpacingToken | number;
	paddingTop?: SpacingToken | number;
	paddingVertical?: SpacingToken | number;
	paddingLeft?: SpacingToken | number;
	paddingRight?: SpacingToken | number;
	paddingStart?: SpacingToken | number; // RTL aware
	paddingEnd?: SpacingToken | number; // RTL aware
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

export const Box: React.FC<BoxProps> = ({
	children,
	flex,
	row,
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
	marginLeft,
	marginRight,
	marginStart,
	marginEnd,
	marginHorizontal,
	marginVertical,
	paddingHorizontal,
	paddingVertical,
	paddingLeft,
	paddingRight,
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
	const isRTL = I18nManager.isRTL;

	// Determine alignment based on props
	let finalAlignItems: FlexAlignType | undefined;
	let finalJustifyContent: JustifyContentType | undefined;

	// If center is true, center both axes
	if (center) {
		finalAlignItems = "center";
		finalJustifyContent = "center";
	} else {
		// Otherwise use specified values
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

		// Check if it's a theme color key
		if (typeof color === "string" && color in theme.colors) {
			return theme.colors[color as ColorToken];
		}

		// Otherwise return the raw color value
		return color;
	};

	const getElevation = (level?: "none" | "small" | "medium" | "large") => {
		if (!level || level === "none") return {};
		return theme.shadows[level]; // Access directly by elevation level
	};

	// Calculate RTL-aware margin values
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

	// Calculate RTL-aware padding values
	const finalPaddingLeft =
		paddingStart !== undefined
			? isRTL
				? undefined
				: getSpacingValue(paddingStart)
			: getSpacingValue(paddingLeft);

	const finalPaddingRight =
		paddingEnd !== undefined
			? isRTL
				? undefined
				: getSpacingValue(paddingEnd)
			: getSpacingValue(paddingRight);

	const finalPaddingStart =
		paddingStart !== undefined
			? isRTL
				? getSpacingValue(paddingStart)
				: undefined
			: undefined;

	const finalPaddingEnd =
		paddingEnd !== undefined
			? isRTL
				? getSpacingValue(paddingEnd)
				: undefined
			: undefined;

	const styles = StyleSheet.create({
		box: {
			flex: flex,
			flexDirection: row ? (isRTL ? "row-reverse" : "row") : "column",
			alignItems: finalAlignItems,
			justifyContent: finalJustifyContent,
			padding: getSpacingValue(padding),
			margin: getSpacingValue(margin),
			marginTop: getSpacingValue(marginTop),
			marginBottom: getSpacingValue(marginBottom),
			paddingBottom: getSpacingValue(paddingBottom),
			paddingTop: getSpacingValue(paddingBottom),
			marginLeft: finalMarginLeft,
			marginRight: finalMarginRight,
			marginStart: finalMarginStart,
			marginEnd: finalMarginEnd,
			marginHorizontal: getSpacingValue(marginHorizontal),
			marginVertical: getSpacingValue(marginVertical),
			paddingHorizontal: getSpacingValue(paddingHorizontal),
			paddingVertical: getSpacingValue(paddingVertical),
			paddingLeft: finalPaddingLeft,
			paddingRight: finalPaddingRight,
			paddingStart: finalPaddingStart,
			paddingEnd: finalPaddingEnd,
			borderRadius: getRadiusValue(rounded),
			width,
			height,
			borderWidth,
			borderColor: getColorValue(borderColor),
			backgroundColor: card ? theme.colors.card : getColorValue(bg),
			...(card ? theme.shadows.small : {}),
			...(elevation ? getElevation(elevation) : {}),
		},
	});

	// If we have an onPress prop, use Pressable instead of View
	if (onPress) {
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					styles.box,
					{ opacity: pressed ? activeOpacity : 1 },
					style,
				]}
				{...props}
			>
				{children}
			</Pressable>
		);
	}

	return (
		<View style={[styles.box, style]} {...props}>
			{children}
		</View>
	);
};

export default Box;

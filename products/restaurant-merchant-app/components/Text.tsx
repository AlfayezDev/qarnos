import { forwardRef, useMemo } from "react";
import {
	Text as RNText,
	type TextStyle,
	type TextProps as RNTextProps,
} from "react-native";
import { useStyles } from "react-native-unistyles";

const textVariants = ["default", "title", "subtitle"] as const;
type TextVariant = (typeof textVariants)[number];

type TextProps = RNTextProps & {
	variant?: TextVariant;
};

export const Text = forwardRef<RNText, TextProps>(
	({ variant = "default", style, ...props }, ref) => {
		const { theme } = useStyles();

		const variantStyle = useMemo(() => {
			let resultStyle: TextStyle = {
				textAlign: "center",
				color: theme.colors.foreground,
			};

			switch (variant) {
				case "subtitle":
					resultStyle = {
						...resultStyle,
						fontWeight: theme.fontWeight.light,
						color: theme.colors.cardForeground,
						opacity: theme.opacity[5],
					};
					break;
				case "title":
					resultStyle = {
						...resultStyle,
						fontWeight: theme.fontWeight.bold,
						fontSize: theme.fontSize.lg,
					};
					break;
				case "default":
					break;
				default: {
					const _exhaustiveCheck: never = variant;
					return _exhaustiveCheck;
				}
			}

			return resultStyle;
		}, [variant, theme]);

		return <RNText ref={ref} style={[variantStyle, style]} {...props} />;
	},
);

Text.displayName = "Text";

import { forwardRef, useMemo } from "react";
import {
	Pressable,
	type PressableProps,
	type View,
	type ViewStyle,
	type TextStyle,
} from "react-native";
import {
	createStyleSheet,
	useStyles,
	UnistylesRuntime,
} from "react-native-unistyles";
import { Text } from "./Text";

type ButtonProps = React.PropsWithChildren<PressableProps> & {
	variant?: "outline" | "primary";
	buttonStyle?: ViewStyle;
	textStyle?: TextStyle;
	style?: never;
};

export const Button = forwardRef<View, ButtonProps>(
	(
		{ variant = "primary", children, buttonStyle, textStyle, ...props },
		ref,
	) => {
		const { styles, theme } = useStyles(buttonStyleSheet);

		const variantStyle = useMemo(() => {
			switch (variant) {
				case "primary":
					return {
						button: styles.primaryButton,
						text: styles.primaryButtonText,
					};
				case "outline":
					return {
						button: styles.outlinedButton,
						text: { color: theme.colors.foreground },
					};
			}
		}, [variant, UnistylesRuntime.themeName]);

		const contentIsString = useMemo(
			() => typeof children === "string",
			[children],
		);

		return (
			<Pressable
				ref={ref}
				style={[styles.button, variantStyle.button, buttonStyle]}
				{...props}
			>
				{contentIsString ? (
					<Text style={[variantStyle.text, textStyle]}>{children}</Text>
				) : (
					children
				)}
			</Pressable>
		);
	},
);

const buttonStyleSheet = createStyleSheet((theme) => ({
	button: {
		borderRadius: theme.radius.lg,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		height: theme.sizes.md,
	},
	primaryButton: {
		backgroundColor: theme.colors.primary,
	},
	primaryButtonText: {
		color: theme.colors.primaryForeground,
	},
	outlinedButton: {
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
}));
Button.displayName = "Button";

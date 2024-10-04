import React from "react";
import { forwardRef, useMemo } from "react";
import {
	Pressable,
	type PressableProps,
	Text as RNText,
	type View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ButtonProps = React.PropsWithChildren<PressableProps> & {
	variant?: "outline" | "primary";
};

export const Button = forwardRef<View, ButtonProps>(
	({ variant = "primary", children, ...props }, ref) => {
		const { styles } = useStyles(buttonStyleSheet);

		const variantStyle = useMemo(() => {
			switch (variant) {
				case "primary":
					return {
						button: styles.primaryButton,
						text: styles.primaryButtonText,
					};
				case "outline":
					return { button: styles.outlinedButton, text: styles.text };
			}
		}, [variant]);

		const contentIsString = useMemo(
			() => typeof children === "string",
			[children],
		);

		return (
			<Pressable
				ref={ref}
				style={[styles.button, variantStyle.button]}
				{...props}
			>
				{contentIsString ? (
					<RNText style={[styles.text, variantStyle.text]}>{children}</RNText>
				) : (
					children
				)}
			</Pressable>
		);
	},
);

Button.displayName = "Button";
const buttonStyleSheet = createStyleSheet((theme) => ({
	text: {
		textAlign: "center",
		color: theme.colors.foreground,
	},
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

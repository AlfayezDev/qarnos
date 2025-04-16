import { ThemeTokens, useTheme } from "@/hooks/useTheme";
import React from "react";
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	View,
	ViewProps,
} from "react-native";
import { Text } from "./Text";

interface AvatarProps extends ViewProps {
	size?: "sm" | "md" | "lg" | number;
	source?: ImageSourcePropType;
	text?: string;
	color?: ThemeTokens["colors"];
	backgroundColor?: ThemeTokens["colors"];
}

export const Avatar: React.FC<AvatarProps> = ({
	size = "md",
	source,
	text,
	color,
	backgroundColor,
	...props
}) => {
	const theme = useTheme();

	const getSize = () => {
		if (typeof size === "number") return size;
		switch (size) {
			case "sm":
				return theme.sizes.avatarSm;
			case "md":
				return theme.sizes.avatarMd;
			case "lg":
				return theme.sizes.avatarLg;
		}
	};

	const getFontSize = () => {
		if (typeof size === "number") return size / 2;
		switch (size) {
			case "sm":
				return theme.typography.sizes.sm;
			case "md":
				return theme.typography.sizes.lg;
			case "lg":
				return theme.typography.sizes.xxl;
		}
	};

	const avatarSize = getSize();
	const bgColor = backgroundColor
		? theme.colors[backgroundColor]
		: theme.colors.primaryLight;
	const textColor = color ? theme.colors[color] : theme.colors.primary;

	const styles = StyleSheet.create({
		container: {
			width: avatarSize,
			height: avatarSize,
			borderRadius: avatarSize / 2,
			backgroundColor: bgColor,
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
		},
		image: {
			width: avatarSize,
			height: avatarSize,
		},
	});

	return (
		<View style={styles.container} {...props}>
			{source ? (
				<Image source={source} style={styles.image} resizeMode="cover" />
			) : (
				<Text
					weight="bold"
					color={textColor}
					style={{
						fontSize: getFontSize(),
					}}
				>
					{text ? text.charAt(0).toUpperCase() : "?"}
				</Text>
			)}
		</View>
	);
};

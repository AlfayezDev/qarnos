import { ColorToken, useTheme } from "@/hooks/useTheme";
import React from "react";
import { Image, ImageSourcePropType, View, ViewProps } from "react-native";
import { Text } from "./Text";

interface AvatarProps extends ViewProps {
	size?: "sm" | "md" | "lg" | number;
	source?: ImageSourcePropType;
	text?: string;
	color?: string;
	backgroundColor?: string;
}

export const Avatar = React.memo(
	({
		size = "md",
		source,
		text,
		color,
		backgroundColor,
		style,
		...props
	}: AvatarProps) => {
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
				default:
					return theme.sizes.avatarMd;
			}
		};

		const getFontVariant = () => {
			if (typeof size === "number") return "md";
			switch (size) {
				case "sm":
					return "sm";
				case "md":
					return "lg";
				case "lg":
					return "xl";
				default:
					return "lg";
			}
		};

		const avatarSize = getSize();
		const bgColor = backgroundColor
			? theme.colors[backgroundColor as ColorToken] || backgroundColor
			: theme.colors.primaryLight;
		const textColor = color
			? theme.colors[color as ColorToken] || color
			: theme.colors.primary;

		const containerStyle = {
			width: avatarSize,
			height: avatarSize,
			borderRadius: avatarSize / 2,
			backgroundColor: bgColor,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			overflow: "hidden" as const,
		};

		const imageStyle = {
			width: avatarSize,
			height: avatarSize,
		};

		return (
			<View style={[containerStyle, style]} {...props}>
				{source ? (
					<Image source={source} style={imageStyle} resizeMode="cover" />
				) : (
					<Text variant={getFontVariant()} weight="bold" color={textColor}>
						{text ? text.charAt(0).toUpperCase() : "?"}
					</Text>
				)}
			</View>
		);
	},
);

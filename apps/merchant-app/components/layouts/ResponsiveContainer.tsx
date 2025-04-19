import React from "react";
import { View, StyleSheet } from "react-native";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useTheme } from "@/hooks/useTheme";

interface ResponsiveContainerProps {
	children: React.ReactNode;
	padded?: boolean;
	centered?: boolean;
	maxWidth?: number;
	style?: any;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
	children,
	padded = true,
	centered = false,
	maxWidth,
	style,
}) => {
	const { isTablet, deviceType } = useResponsiveLayout();
	const theme = useTheme();

	const getMaxWidth = () => {
		if (maxWidth) return maxWidth;
		if (deviceType === "tablet") return 700;
		return undefined;
	};

	const containerStyle = {
		flex: 1,
		width: "100%",
		maxWidth: getMaxWidth(),
		paddingHorizontal: padded ? theme.spacing.md : 0,
		alignSelf: isTablet ? "center" : undefined,
		alignItems: centered ? "center" : undefined,
	};

	return <View style={[containerStyle, style]}>{children}</View>;
};

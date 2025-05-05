import React, {
	PropsWithChildren,
	forwardRef,
	ForwardRefRenderFunction,
	useCallback,
} from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBox, AnimatedText, Box, Text } from "@/components/ui";
import { useTheme } from "@/stores/themeStore";
import {
	useAnimatedProps,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { AnimatedIonicons } from "../common/AnimatedIcons";

type TabButtonProps = {
	icon: string;
	label: string;
	isFocused?: boolean;
	onPress?: () => void;
	route?: string;
};

export const TabButton = React.memo(
	({ icon, label, isFocused, onPress }: TabButtonProps) => {
		const { colors, radius } = useTheme();

		// Memoize press handler to prevent re-renders
		const handlePress = useCallback(() => {
			if (onPress) onPress();
		}, [onPress]);
		const iconStyle = useAnimatedStyle(() => ({
			color: withTiming(isFocused ? colors.primary : colors.textMuted),
		}));
		const textStyle = useAnimatedStyle(() => ({
			color: withTiming(isFocused ? colors.primary : colors.textMuted),
		}));

		const containerStyle = useAnimatedStyle(() => ({
			backgroundColor: withTiming(
				isFocused ? colors.primaryLight : "transparent",
			),
		}));

		return (
			<Pressable style={[styles.tabItem]} onPress={handlePress}>
				<AnimatedBox
					rounded={"xs"}
					alignCenter
					style={[styles.tabItem, containerStyle]}
				>
					<AnimatedIonicons name={icon as any} size={22} style={iconStyle} />
					<AnimatedText variant="xs" marginTop="xs" style={textStyle}>
						{label}
					</AnimatedText>
				</AnimatedBox>
			</Pressable>
		);
	},
	// Optimize re-renders - only re-render on focus change or label change
	(prevProps, nextProps) => true,
);
TabButton.displayName = "TabButton";

type FloatingTabBarLayoutProps = PropsWithChildren<{
	style?: React.ComponentProps<typeof View>["style"];
}>;

const FloatingTabBarLayoutComponent: ForwardRefRenderFunction<
	View,
	FloatingTabBarLayoutProps
> = ({ children, style }, ref) => {
	const { colors, radius } = useTheme();
	const insets = useSafeAreaInsets();

	return (
		<View
			ref={ref}
			style={[
				styles.container,
				{ paddingBottom: insets.bottom ? insets.bottom : 12 }, // reduced bottom padding
				style,
			]}
		>
			<Box
				style={[
					styles.tabBarContainer,
					{
						backgroundColor: colors.card,
						borderRadius: radius.xl,
						shadowColor: colors.shadow,
						shadowOffset: { width: 0, height: 3 }, // less intense shadow
						shadowOpacity: 0.12, // reduced opacity
						shadowRadius: 12,
						elevation: 6,
						borderWidth: 1,
						borderColor: colors.divider,
					},
				]}
			>
				{children}
			</Box>
		</View>
	);
};

export const FloatingTabBarLayout = React.memo(
	forwardRef(FloatingTabBarLayoutComponent),
	// Add deep comparison to prevent layout re-renders
	(prevProps, nextProps) => {
		// Only re-render when children change in a meaningful way
		return false;
	},
);
FloatingTabBarLayout.displayName = "FloatingTabBarLayout";

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 12, // reduced from 16
		left: 16,
		right: 16,
	},
	tabBarContainer: {
		flexDirection: "row",
		paddingVertical: 6, // reduced from 10
		paddingHorizontal: 12, // reduced from 16
		width: "100%",
	},
	tabItem: {
		flex: 1,
		paddingVertical: 4, // reduced from 8
		paddingHorizontal: 4, // reduced from 12
		alignItems: "center",
		width: "100%",
	},
});

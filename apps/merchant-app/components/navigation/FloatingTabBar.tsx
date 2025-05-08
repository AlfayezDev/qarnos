import React, { PropsWithChildren, ForwardRefRenderFunction } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedBox, AnimatedText, Box } from "@/components/ui";
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

export const TabButton = ({
	icon,
	label,
	isFocused,
	onPress,
}: TabButtonProps) => {
	const { colors } = useTheme();

	const handlePress = () => {
		if (onPress) onPress();
	};
	const iconStyle = useAnimatedProps(() => ({
		color: isFocused ? colors.primaryDark : colors.textMuted,
	}));
	const textStyle = useAnimatedStyle(() => ({
		color: withTiming(isFocused ? colors.primaryDark : colors.textMuted),
		fontWeight: isFocused ? "bold" : "normal",
	}));

	const containerStyle = useAnimatedStyle(() => ({
		backgroundColor: withTiming(
			isFocused ? colors.primaryLight : "transparent",
		),
	}));

	return (
		<Pressable onPress={handlePress} style={{ flex: 1 }}>
			<AnimatedBox
				width={"100%"}
				padding={"xs"}
				rounded={"xs"}
				alignCenter
				style={containerStyle}
				flex={1}
				row
				justifyCenter
				gap={"sm"}
			>
				<AnimatedIonicons
					key={`${label}-icon-selected-${isFocused}`}
					name={icon as any}
					size={22}
					animatedProps={iconStyle}
				/>
				<AnimatedText variant="xs" style={textStyle} alignSelf={"center"}>
					{label}
				</AnimatedText>
			</AnimatedBox>
		</Pressable>
	);
};

TabButton.displayName = "TabButton";

type FloatingTabBarLayoutProps = PropsWithChildren<{
	style?: React.ComponentProps<typeof View>["style"];
}>;

export const FloatingTabBarLayout: ForwardRefRenderFunction<
	View,
	FloatingTabBarLayoutProps
> = ({ children, style }, ref) => {
	const { colors } = useTheme();
	const insets = useSafeAreaInsets();

	return (
		<View
			ref={ref}
			style={[
				styles.container,
				{ paddingBottom: insets.bottom ? insets.bottom : 12 },
				style,
			]}
		>
			<Box
				row
				width={"100%"}
				rounded={"xs"}
				bg="card"
				elevation="large"
				borderColor="divider"
				borderWidth={1}
				padding={"xs"}
				style={{
					shadowColor: colors.shadow,
					shadowOffset: { width: 0, height: 3 },
					shadowOpacity: 0.12,
					shadowRadius: 12,
				}}
			>
				{children}
			</Box>
		</View>
	);
};

FloatingTabBarLayout.displayName = "FloatingTabBarLayout";

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 0,
		left: 16,
		right: 16,
	},
});

import React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSpring,
	interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTranslation } from "@/stores/translationStore";

interface BackButtonProps {
	onPress: () => void;
	accessibilityLabel?: string;
}

export const BackButton = React.memo(
	({ onPress, accessibilityLabel }: BackButtonProps) => {
		const theme = useTheme();
		const { t, isRTL } = useTranslation();

		const pressed = useSharedValue(0);

		const handlePressIn = () => {
			pressed.value = withTiming(1, {
				duration: theme.animations.duration.fast,
			});
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		};

		const handlePressOut = () => {
			pressed.value = withTiming(0, {
				duration: theme.animations.duration.fast,
			});
		};

		const animatedStyle = useAnimatedStyle(() => {
			return {
				transform: [
					{
						scale: withSpring(pressed.value === 1 ? 0.9 : 1, {
							damping: theme.animations.spring.damping.light,
						}),
					},
				],
				backgroundColor: interpolateColor(
					pressed.value,
					[0, 1],
					["transparent", theme.colors.primaryLight],
				),
				borderRadius: theme.radius.sm,
				padding: theme.spacing.xs,
				marginEnd: theme.spacing.sm,
			};
		});

		return (
			<Animated.View style={animatedStyle}>
				<TouchableOpacity
					onPress={onPress}
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					style={{
						width: theme.sizes.touchTarget,
						height: theme.sizes.touchTarget,
						alignItems: "center",
						justifyContent: "center",
					}}
					activeOpacity={1}
					accessibilityLabel={accessibilityLabel || t("common.back")}
					accessibilityRole="button"
				>
					<Ionicons
						name={isRTL ? "chevron-forward" : "chevron-back"}
						size={theme.sizes.iconMd}
						color={theme.colors.primary}
					/>
				</TouchableOpacity>
			</Animated.View>
		);
	},
);

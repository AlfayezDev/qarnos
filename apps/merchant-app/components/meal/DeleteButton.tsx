import React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSpring,
	interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface DeleteButtonProps {
	onPress: () => void;
	accessibilityLabel?: string;
}

export const DeleteButton = React.memo(
	({ onPress, accessibilityLabel }: DeleteButtonProps) => {
		const theme = useTheme();
		const { t } = useTranslation();

		const pressed = useSharedValue(0);

		const handlePressIn = () => {
			pressed.value = withTiming(1, {
				duration: theme.animations.duration.fast,
			});
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		};

		const handlePressOut = () => {
			pressed.value = withTiming(0, {
				duration: theme.animations.duration.medium,
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
					["transparent", `${theme.colors.error}15`],
				),
				borderRadius: theme.radius.round,
				padding: theme.spacing.xs,
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
					accessibilityLabel={accessibilityLabel || t("common.delete")}
					accessibilityRole="button"
				>
					<Ionicons
						name="trash-outline"
						size={theme.sizes.iconMd}
						color={theme.colors.error}
					/>
				</TouchableOpacity>
			</Animated.View>
		);
	},
);

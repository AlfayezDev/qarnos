import React, { useEffect } from "react";
import {
	View,
	Switch as RNSwitch,
	TouchableWithoutFeedback,
	StyleSheet,
	StyleProp,
	ViewStyle,
	Platform,
} from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
	withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { Text, Box } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";

export interface SwitchFieldProps {
	value: boolean;
	onValueChange: (value: boolean) => void;
	label?: string;
	description?: string;
	disabled?: boolean;
	leftIcon?: string;
	style?: StyleProp<ViewStyle>;
	error?: string;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
	value,
	onValueChange,
	label,
	description,
	disabled = false,
	leftIcon,
	style,
	error,
}) => {
	const theme = useTheme();
	const animatedValue = useSharedValue(value ? 1 : 0);
	const pressedValue = useSharedValue(0);
	const hasError = !!error;

	useEffect(() => {
		animatedValue.value = withTiming(value ? 1 : 0, { duration: 150 });
	}, [value]);

	useEffect(() => {
		if (hasError) {
			// Error animation sequence
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			pressedValue.value = withTiming(1, { duration: 100 });
			setTimeout(() => {
				pressedValue.value = withTiming(0, { duration: 200 });
			}, 300);
		}
	}, [error]);

	const toggleSwitch = () => {
		if (!disabled) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			onValueChange(!value);
		}
	};

	const handlePressIn = () => {
		if (!disabled) {
			pressedValue.value = withTiming(1, { duration: 100 });
		}
	};

	const handlePressOut = () => {
		if (!disabled) {
			pressedValue.value = withTiming(0, { duration: 200 });
		}
	};

	const containerAnimatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(pressedValue.value, [0, 1], [1, 0.98]);

		// Add shake animation for error state
		const translateX = hasError
			? withSpring(0, {
					velocity: pressedValue.value > 0.5 ? 0 : 5,
					damping: 8,
				})
			: 0;

		// Add error background tint
		const backgroundColor = hasError
			? `${theme.colors.error}10`
			: "transparent";

		// Add error border
		const borderColor = hasError ? theme.colors.error : "transparent";
		const borderWidth = hasError ? 1 : 0;
		const borderRadius = theme.radius.md;

		return {
			transform: [{ scale }, { translateX }],
			opacity: disabled ? 0.6 : 1,
			backgroundColor,
			borderColor,
			borderWidth,
			borderRadius,
			padding: hasError ? theme.spacing.xs : 0,
		};
	});

	// This will handle the switch being toggled directly
	const handleSwitchValueChange = () => {
		if (!disabled) {
			// Apply haptic feedback
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			// Handle press animation
			handlePressIn();
			setTimeout(() => handlePressOut(), 200);

			// Update the value
			onValueChange(!value);
		}
	};

	return (
		<TouchableWithoutFeedback
			onPress={toggleSwitch}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
		>
			<Animated.View style={[styles.container, containerAnimatedStyle, style]}>
				<View style={styles.contentContainer}>
					{leftIcon && (
						<Box
							width={theme.sizes.buttonSm}
							height={theme.sizes.buttonSm}
							rounded="sm"
							bg="primaryLight"
							alignItems="center"
							justifyContent="center"
							marginEnd="sm"
						>
							<Ionicons
								name={leftIcon as any}
								size={theme.sizes.iconSm}
								color={theme.colors.primary}
							/>
						</Box>
					)}

					<View style={styles.labelContainer}>
						{label && (
							<Text
								variant="md"
								weight="semibold"
								color={disabled ? "textMuted" : "text"}
							>
								{label}
							</Text>
						)}

						{description && (
							<Text
								variant="sm"
								color={disabled ? "textMuted" : "textSecondary"}
								style={{ marginTop: theme.spacing.xs / 2 }}
							>
								{description}
							</Text>
						)}

						{hasError && (
							<Text
								variant="xs"
								color="error"
								style={{ marginTop: theme.spacing.xs }}
							>
								{error}
							</Text>
						)}
					</View>
				</View>

				<RNSwitch
					value={value}
					onValueChange={handleSwitchValueChange}
					disabled={disabled}
					trackColor={{
						false: theme.colors.backgroundAlt,
						true: theme.colors.primary,
					}}
					thumbColor={
						Platform.OS === "ios"
							? undefined
							: value
								? theme.colors.background
								: theme.colors.card
					}
					ios_backgroundColor={
						hasError ? `${theme.colors.error}40` : theme.colors.backgroundAlt
					}
					style={[
						hasError &&
							Platform.OS === "android" && {
								borderWidth: 1,
								borderColor: theme.colors.error,
								borderRadius: 16,
							},
					]}
				/>
			</Animated.View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 12,
	},
	contentContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		marginRight: 12,
	},
	labelContainer: {
		flex: 1,
	},
});

export default SwitchField;

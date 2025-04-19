import React, { useCallback } from "react";
import {
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
	TouchableWithoutFeedback,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSpring,
	interpolateColor,
	FadeInUp,
} from "react-native-reanimated";

export interface CategoryOption {
	value: string;
	label: string;
	icon: string;
}

export interface CategoryFieldProps {
	options: CategoryOption[];
	value: string;
	onChange: (value: string) => void;
	label?: string;
	style?: StyleProp<ViewStyle>;
	error?: string;
	required?: boolean;
	disabled?: boolean;
}

export const CategoryField: React.FC<CategoryFieldProps> = ({
	options,
	value,
	onChange,
	label,
	style,
	error,
	required,
	disabled = false,
}) => {
	const theme = useTheme();
	const hasError = !!error;
	const errorAnim = useSharedValue(0);

	React.useEffect(() => {
		if (hasError) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			errorAnim.value = 0;
			errorAnim.value = withTiming(1, { duration: 300 });
		} else {
			errorAnim.value = withTiming(0, { duration: 200 });
		}
	}, [hasError, error]);

	const handleSelect = useCallback(
		(optionValue: string) => {
			if (!disabled && optionValue !== value) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				onChange(optionValue);
			}
		},
		[disabled, value, onChange],
	);

	const containerAnimStyle = useAnimatedStyle(() => {
		const translateX = hasError
			? withSpring(0, {
					velocity: errorAnim.value > 0.5 ? 0 : 10,
					damping: 5,
					stiffness: 200,
				})
			: 0;

		const backgroundColor = hasError
			? `${theme.colors.error}10`
			: "transparent";

		const borderColor = hasError ? theme.colors.error : "transparent";
		const borderWidth = hasError ? 1.5 : 0;

		return {
			transform: [{ translateX }],
			backgroundColor,
			borderColor,
			borderWidth,
			borderRadius: theme.radius.md,
			padding: hasError ? 4 : 0,
			overflow: "hidden",
		};
	});

	return (
		<View style={[styles.container, style]}>
			{label && (
				<View style={{ flexDirection: "row", marginBottom: theme.spacing.xs }}>
					<Text
						variant="sm"
						weight="semibold"
						color={hasError ? "error" : "textSecondary"}
					>
						{label}
					</Text>
					{required && (
						<Text
							variant="sm"
							weight="semibold"
							color="error"
							style={{ marginLeft: theme.spacing.xs / 2 }}
						>
							*
						</Text>
					)}
				</View>
			)}

			<Animated.View style={[styles.optionsContainer, containerAnimStyle]}>
				<Animated.View
					style={[
						{
							flexDirection: "row",
							backgroundColor: theme.colors.backgroundAlt,
							borderRadius: theme.radius.md,
							padding: theme.spacing.xs,
							opacity: disabled ? 0.6 : 1,
						},
					]}
				>
					{options.map((option) => (
						<CategoryOption
							key={option.value}
							option={option}
							isSelected={option.value === value}
							onSelect={() => handleSelect(option.value)}
							theme={theme}
							disabled={disabled}
							hasError={hasError}
						/>
					))}
				</Animated.View>
			</Animated.View>

			{hasError && (
				<Animated.View
					entering={FadeInUp.duration(200).springify()}
					style={{ marginTop: theme.spacing.xs }}
				>
					<Text variant="xs" color="error">
						{error}
					</Text>
				</Animated.View>
			)}
		</View>
	);
};

interface CategoryOptionProps {
	option: CategoryOption;
	isSelected: boolean;
	onSelect: () => void;
	theme: any;
	disabled?: boolean;
	hasError?: boolean;
}

const CategoryOption: React.FC<CategoryOptionProps> = ({
	option,
	isSelected,
	onSelect,
	theme,
	disabled,
	hasError = false,
}) => {
	const selectedValue = useSharedValue(isSelected ? 1 : 0);
	const pressedValue = useSharedValue(0);

	React.useEffect(() => {
		selectedValue.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
	}, [isSelected]);

	const handlePressIn = () => {
		if (!disabled) {
			pressedValue.value = withTiming(1, { duration: 100 });
		}
	};

	const handlePressOut = () => {
		if (!disabled) {
			pressedValue.value = withTiming(0, { duration: 150 });
		}
	};

	const containerAnimatedStyle = useAnimatedStyle(() => {
		const scale = 0.96 + (1 - 0.96) * (1 - pressedValue.value);

		const backgroundColor =
			hasError && !isSelected
				? interpolateColor(
						selectedValue.value,
						[0, 1],
						[`${theme.colors.error}10`, theme.colors.card],
					)
				: interpolateColor(
						selectedValue.value,
						[0, 1],
						["transparent", theme.colors.card],
					);

		const borderColor =
			hasError && !isSelected
				? theme.colors.error
				: isSelected
					? theme.colors.primary
					: "transparent";

		const elevation = selectedValue.value * 2;
		const shadowOpacity = selectedValue.value * 0.15;

		return {
			flex: 1,
			margin: 2,
			paddingVertical: theme.spacing.sm,
			transform: [{ scale }],
			backgroundColor,
			borderRadius: theme.radius.sm,
			alignItems: "center",
			justifyContent: "center",
			shadowColor: hasError ? theme.colors.error : theme.colors.shadow,
			shadowOffset: { width: 0, height: 1 },
			shadowRadius: 2,
			shadowOpacity,
			elevation,
			borderWidth: hasError && !isSelected ? 1 : 0,
			borderColor,
		};
	});

	const iconAnimatedStyle = useAnimatedStyle(() => {
		const scale = withSpring(isSelected ? 1.1 : 1, { damping: 15 });

		return {
			transform: [{ scale }],
		};
	});

	const textAnimatedStyle = useAnimatedStyle(() => {
		const color = interpolateColor(
			selectedValue.value,
			[0, 1],
			[theme.colors.text, theme.colors.primary],
		);

		return {
			color,
			fontWeight: isSelected ? "600" : "500",
			fontSize: theme.typography.sizes.sm,
		};
	});

	return (
		<TouchableWithoutFeedback
			onPress={onSelect}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
		>
			<Animated.View style={containerAnimatedStyle}>
				<Animated.View style={iconAnimatedStyle}>
					<Ionicons
						name={option.icon as any}
						size={theme.sizes.iconSm}
						color={
							isSelected ? theme.colors.primary : theme.colors.textSecondary
						}
					/>
				</Animated.View>

				<Animated.Text style={textAnimatedStyle}>{option.label}</Animated.Text>
			</Animated.View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	optionsContainer: {
		width: "100%",
	},
});

export default CategoryField;

import React from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { Text } from "@/components/ui";
import { useTheme } from "@/stores/themeStore";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSpring,
	FadeInUp,
} from "react-native-reanimated";

export interface RadioOption {
	value: string;
	label: string;
	icon?: string;
	description?: string;
}

export interface RadioFieldProps {
	options: RadioOption[];
	value: string;
	onChange: (value: string) => void;
	label?: string;
	horizontal?: boolean;
	style?: StyleProp<ViewStyle>;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

export const RadioField = React.memo(
	({
		options,
		value,
		onChange,
		label,
		horizontal = false,
		style,
		error,
		required,
		disabled = false,
	}: RadioFieldProps) => {
		const theme = useTheme();
		const [errorShake, setErrorShake] = React.useState(false);
		const hasError = !!error;
		const errorAnimation = useSharedValue(0);

		React.useEffect(() => {
			if (hasError) {
				setErrorShake(true);
				errorAnimation.value = withTiming(1, { duration: 300 });
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
				setTimeout(() => {
					setErrorShake(false);
				}, 800);
			} else {
				errorAnimation.value = withTiming(0, { duration: 200 });
			}
		}, [error, hasError]);

		const containerAnimatedStyle = useAnimatedStyle(() => {
			const translateX = errorShake
				? withSpring(0, {
						velocity: 10,
						damping: 3,
						stiffness: 200,
					})
				: 0;
			const borderColor = hasError ? theme.colors.error : "transparent";
			const borderWidth = hasError ? 2 : 0;
			const backgroundColor = hasError
				? `${theme.colors.error}08`
				: "transparent";
			return {
				transform: [{ translateX }],
				borderColor,
				borderWidth,
				backgroundColor,
				borderRadius: theme.radius.md,
				padding: hasError ? 4 : 0,
			};
		});

		const handleSelect = (optionValue: string) => {
			if (!disabled && optionValue !== value) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				onChange(optionValue);
			}
		};

		return (
			<View style={[{ width: "100%" }, style]}>
				{label && (
					<View
						style={{ flexDirection: "row", marginBottom: theme.spacing.sm }}
					>
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
								style={{ marginStart: theme.spacing.xs / 2 }}
							>
								*
							</Text>
						)}
					</View>
				)}
				<Animated.View
					style={[
						{
							width: "100%",
							flexDirection: horizontal ? "row" : "column",
						},
						containerAnimatedStyle,
					]}
				>
					{options.map((option, index) => (
						<RadioOption
							key={option.value}
							option={option}
							isSelected={option.value === value}
							onSelect={() => handleSelect(option.value)}
							isLast={index === options.length - 1}
							horizontal={horizontal}
							disabled={disabled}
							hasError={hasError}
						/>
					))}
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
	},
);

interface RadioOptionProps {
	option: RadioOption;
	isSelected: boolean;
	onSelect: () => void;
	isLast: boolean;
	horizontal: boolean;
	disabled?: boolean;
	hasError?: boolean;
}

const RadioOption = React.memo(
	({
		option,
		isSelected,
		onSelect,
		isLast,
		horizontal,
		disabled,
		hasError = false,
	}: RadioOptionProps) => {
		const theme = useTheme();
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

		const animatedStyle = useAnimatedStyle(() => {
			const scale = 0.98 + (1 - 0.98) * (1 - pressedValue.value);
			return {
				transform: [{ scale }],
				opacity: disabled ? 0.6 : 1,
				backgroundColor: isSelected
					? withTiming(theme.colors.card, { duration: 200 })
					: withTiming(theme.colors.backgroundAlt, { duration: 200 }),
				borderColor: isSelected
					? withTiming(theme.colors.primary, { duration: 200 })
					: hasError
						? theme.colors.error
						: withTiming(theme.colors.divider, { duration: 200 }),
				borderWidth: hasError && !isSelected ? 1.5 : 1,
			};
		});

		const checkAnimatedStyle = useAnimatedStyle(() => {
			return {
				opacity: withTiming(isSelected ? 1 : 0, { duration: 150 }),
				transform: [{ scale: withSpring(isSelected ? 1 : 0, { damping: 15 }) }],
			};
		});

		const iconAnimatedStyle = useAnimatedStyle(() => {
			return {
				opacity: withTiming(isSelected ? 1 : 0.6, { duration: 150 }),
				transform: [
					{ scale: withSpring(isSelected ? 1.1 : 1, { damping: 15 }) },
				],
				color: isSelected ? theme.colors.primary : theme.colors.textSecondary,
			};
		});

		const textAnimatedStyle = useAnimatedStyle(() => {
			return {
				color: isSelected
					? withTiming(theme.colors.primary, { duration: 200 })
					: withTiming(theme.colors.text, { duration: 200 }),
				fontWeight: isSelected ? "600" : "500",
			};
		});

		const containerStyle = {
			marginBottom: horizontal ? 0 : isLast ? 0 : theme.spacing.xs,
			marginEnd: horizontal ? (isLast ? 0 : theme.spacing.xs) : 0,
			paddingVertical: horizontal ? theme.spacing.sm : theme.spacing.md,
			paddingHorizontal: theme.spacing.md,
			borderRadius: theme.radius.sm,
			flex: horizontal ? 1 : undefined,
		};

		return (
			<Animated.View style={[containerStyle, animatedStyle]}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={onSelect}
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					disabled={disabled}
					style={{ flex: 1 }}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<View style={{ marginEnd: 12 }}>
							{option.icon ? (
								<Animated.View style={iconAnimatedStyle}>
									<Ionicons
										name={option.icon as any}
										size={theme.sizes.iconSm}
										color={
											isSelected
												? theme.colors.primary
												: theme.colors.textSecondary
										}
									/>
								</Animated.View>
							) : (
								<View
									style={{
										width: 20,
										height: 20,
										borderRadius: 10,
										justifyContent: "center",
										alignItems: "center",
										borderColor: isSelected
											? theme.colors.primary
											: hasError
												? theme.colors.error
												: theme.colors.divider,
										borderWidth: isSelected ? 2 : 1,
									}}
								>
									<Animated.View
										style={[
											{
												width: 10,
												height: 10,
												borderRadius: 5,
												backgroundColor: theme.colors.primary,
											},
											checkAnimatedStyle,
										]}
									/>
								</View>
							)}
						</View>
						<View style={{ flex: 1 }}>
							<Animated.Text
								style={[
									{
										fontSize: theme.typography.sizes.md,
										color: isSelected
											? theme.colors.primary
											: theme.colors.text,
										fontWeight: isSelected ? "600" : "500",
									},
									textAnimatedStyle,
								]}
							>
								{option.label}
							</Animated.Text>
							{option.description && (
								<Text
									variant="sm"
									color="textSecondary"
									style={{ marginTop: theme.spacing.xs / 2 }}
								>
									{option.description}
								</Text>
							)}
						</View>
						{isSelected && !option.icon && (
							<Animated.View style={checkAnimatedStyle}>
								<Ionicons
									name="checkmark"
									size={theme.sizes.iconSm}
									color={theme.colors.primary}
									style={{ marginStart: theme.spacing.sm }}
								/>
							</Animated.View>
						)}
					</View>
				</TouchableOpacity>
			</Animated.View>
		);
	},
);

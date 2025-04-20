import React, {
	useState,
	useEffect,
	useImperativeHandle,
	forwardRef,
} from "react";
import {
	TextInput,
	StyleProp,
	TextStyle,
	KeyboardTypeOptions,
	ReturnKeyTypeOptions,
	Platform,
	NativeSyntheticEvent,
	TextInputFocusEventData,
	TouchableWithoutFeedback,
	View,
	AccessibilityRole,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	interpolateColor,
	withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui";
import { z } from "zod";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
interface ValidationProps {
	schema?: z.ZodType<any>;
	onValidation?: (isValid: boolean, error?: string) => void;
}
export interface FocusableInputProps extends ValidationProps {
	inputRef?: React.RefObject<TextInput | null>;
	style?: StyleProp<TextStyle>;
	value?: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	placeholderTextColor?: string;
	returnKeyType?: ReturnKeyTypeOptions;
	onSubmitEditing?: () => void;
	multiline?: boolean;
	numberOfLines?: number;
	keyboardType?: KeyboardTypeOptions;
	textAlign?: "left" | "center" | "right";
	textAlignVertical?: "top" | "center" | "bottom";
	maxLength?: number;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	autoCorrect?: boolean;
	editable?: boolean;
	secureTextEntry?: boolean;
	onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	label?: string;
	error?: string;
	required?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
	accessibilityRole?: AccessibilityRole;
}

const FocusableInput = forwardRef<TextInput, FocusableInputProps>(
	(
		{
			inputRef: externalInputRef,
			style,
			value,
			onChangeText,
			placeholder,
			placeholderTextColor,
			returnKeyType,
			onSubmitEditing,
			multiline = false,
			numberOfLines = 1,
			keyboardType = "default",
			textAlign,
			textAlignVertical,
			maxLength,
			autoCapitalize = "sentences",
			autoCorrect = true,
			editable = true,
			secureTextEntry = false,
			onFocus,
			onBlur,
			label,
			error,
			required,
			schema,
			onValidation,
			accessibilityLabel,
			accessibilityHint,
			accessibilityRole,
		},
		ref,
	) => {
		const theme = useTheme();
		const [isFocused, setIsFocused] = useState(false);
		const internalInputRef = React.useRef<TextInput>(null);
		const hasError = !!error;

		useImperativeHandle(
			ref,
			() => {
				if (internalInputRef.current) {
					return internalInputRef.current;
				}
				return new TextInput({}) as TextInput;
			},
			[],
		);

		const inputRefToUse = externalInputRef || internalInputRef;
		const focusProgress = useSharedValue(0);
		const errorProgress = useSharedValue(0);

		useEffect(() => {
			focusProgress.value = withTiming(isFocused ? 1 : 0, {
				duration: 200,
			});
			if (isFocused) {
				if (Platform.OS !== "android") {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
						() => {},
					);
				}
			}
		}, [isFocused]);

		useEffect(() => {
			errorProgress.value = withTiming(hasError ? 1 : 0, {
				duration: 200,
			});
			if (hasError && errorProgress.value === 0) {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
					() => {},
				);
			}
		}, [hasError]);

		const containerAnimatedStyle = useAnimatedStyle(() => {
			const shadowOpacity = hasError
				? errorProgress.value * 0.3
				: focusProgress.value * 0.15;
			return {
				marginBottom: hasError
					? theme.spacing.md
					: multiline
						? theme.spacing.sm
						: 0,
				borderRadius: theme.radius.input,
				shadowColor: hasError ? theme.colors.error : theme.colors.primary,
				shadowOffset: { width: 0, height: 0 },
				shadowOpacity,
				shadowRadius: hasError ? 5 : 3,
				elevation: hasError ? errorProgress.value * 4 : focusProgress.value * 2,
			};
		});

		const inputAnimatedStyle = useAnimatedStyle(() => {
			const borderColor = hasError
				? interpolateColor(
						errorProgress.value,
						[0, 1],
						[theme.colors.divider, theme.colors.error],
					)
				: interpolateColor(
						focusProgress.value,
						[0, 1],
						[theme.colors.divider, theme.colors.primary],
					);
			const translateX = hasError
				? withSpring(0, {
						velocity: errorProgress.value > 0.5 ? 0 : 10,
						damping: theme.animations.spring.damping.medium,
						stiffness: theme.animations.spring.stiffness.medium,
					})
				: 0;
			return {
				borderColor,
				borderWidth: hasError ? 1.5 : 1,
				paddingHorizontal: theme.spacing.md,
				paddingVertical: multiline ? theme.spacing.sm : 0,
				color: editable ? theme.colors.text : theme.colors.textSecondary,
				backgroundColor: theme.colors.card,
				borderRadius: theme.radius.input,
				height: multiline ? undefined : theme.sizes.inputHeight,
				minHeight: multiline
					? theme.sizes.inputHeight * (numberOfLines || 1)
					: undefined,
				textAlign,
				textAlignVertical,
				opacity: editable ? 1 : 0.8,
				transform: [{ translateX }],
				...(style as any),
			};
		});

		const focusInput = () => {
			if (inputRefToUse.current && editable) {
				inputRefToUse.current.focus();
			}
		};

		const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			setIsFocused(true);
			if (onFocus) {
				onFocus(e);
			}
		};
		const validateInput = (text: string) => {
			if (!schema) return true;

			try {
				schema.parse(text);
				if (onValidation) {
					onValidation(true);
				}
				return true;
			} catch (error) {
				if (error instanceof z.ZodError) {
					const errorMessage = error.errors[0]?.message || "Invalid input";
					if (onValidation) {
						onValidation(false, errorMessage);
					}
				}
				return false;
			}
		};

		const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			setIsFocused(false);
			if (schema && value !== undefined) {
				validateInput(value);
			}
			if (onBlur) {
				onBlur(e);
			}
		};

		return (
			<View>
				{label && (
					<View
						style={{ flexDirection: "row", marginBottom: theme.spacing.xs }}
					>
						<Text variant="sm" weight="semibold" color="textSecondary">
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
				<TouchableWithoutFeedback onPress={focusInput}>
					<Animated.View style={containerAnimatedStyle}>
						<AnimatedTextInput
							ref={inputRefToUse}
							style={inputAnimatedStyle}
							value={value}
							onChangeText={onChangeText}
							placeholder={placeholder}
							placeholderTextColor={
								placeholderTextColor || theme.colors.textMuted
							}
							returnKeyType={returnKeyType}
							onSubmitEditing={onSubmitEditing}
							onFocus={handleFocus}
							onBlur={handleBlur}
							multiline={multiline}
							numberOfLines={numberOfLines}
							keyboardType={keyboardType}
							selectionColor={theme.colors.primary}
							maxLength={maxLength}
							autoCapitalize={autoCapitalize}
							autoCorrect={autoCorrect}
							editable={editable}
							secureTextEntry={secureTextEntry}
							accessibilityHint={accessibilityHint}
							accessibilityRole={accessibilityRole}
							accessibilityLabel={accessibilityLabel}
						/>
					</Animated.View>
				</TouchableWithoutFeedback>
				{hasError && (
					<Text
						variant="xs"
						color="error"
						style={{
							marginTop: theme.spacing.xs,
							marginHorizontal: theme.spacing.xs,
						}}
					>
						{error}
					</Text>
				)}
			</View>
		);
	},
);

export default FocusableInput;

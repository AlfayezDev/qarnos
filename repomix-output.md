This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: **/*.log, tmp/, **/Illustrations/**, **/*.json, **/Localization.ts, **/SVGS/**, **/generated/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
apps/
  merchant-app/
    app/
      meals/
        _layout.tsx
        [meal-id].tsx
        index.tsx
      _layout.tsx
      index.tsx
      settings.tsx
    components/
      dashboard/
        AlertRow.tsx
        AlertsCard.tsx
        DashboardHeader.tsx
        PrepCard.tsx
        StatsGrid.tsx
      fields/
        CategoryField.tsx
        FocusableInput.tsx
        RadioField.tsx
        SwitchField.tsx
      layout/
        ScreenContainer.tsx
      ui/
        Avatar.tsx
        Badge.tsx
        Box.tsx
        Button.tsx
        Card.tsx
        index.ts
        Tabs.tsx
        Text.tsx
      LanguageSelector.tsx
    constants/
      i18n.ts
      theme.ts
    hooks/
      useColorScheme/
        index.ts
        useColorScheme.web.ts
      useLanguage.ts
      useTheme.ts
      useTranslation.ts
    .gitignore
    data.ts
    types.ts
.gitignore
.npmrc
.nvimrc
pnpm-workspace.yaml
```

# Files

## File: apps/merchant-app/app/meals/_layout.tsx
```typescript
import { Stack } from "expo-router";
export default function MealsLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="[meal-id]" />
		</Stack>
	);
}
```

## File: apps/merchant-app/app/meals/index.tsx
```typescript
import React, { useState, useCallback, useMemo } from "react";
import { FlatList, View, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	FadeIn,
	FadeInUp,
	LinearTransition,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { AnimatedBox, Box, Card, Text } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { MEALS } from "@/data";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Meal } from "@/types";
import { Link } from "expo-router";
const MealScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [selectedPeriod, setSelectedPeriod] = useState<string>("Breakfast");
	const insets = useSafeAreaInsets();
	const [meals] = useState<Meal[]>(MEALS);
	const periods = useMemo(() => ["Breakfast", "Lunch", "Dinner"], []);
	const filteredMeals = useMemo(() => {
		return meals.filter((meal) => meal.period === selectedPeriod);
	}, [meals, selectedPeriod]);
	const handleSelectPeriod = useCallback(
		(period: string) => {
			if (period !== selectedPeriod) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				setSelectedPeriod(period);
			}
		},
		[selectedPeriod],
	);
	function renderEmptyList() {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					padding: theme.spacing.xl,
				}}
			>
				<Ionicons
					name="restaurant-outline"
					size={theme.sizes.iconLg}
					color={theme.colors.textMuted}
					style={{ marginBottom: theme.spacing.md }}
				/>
				<Text variant="lg" weight="semibold" color="textSecondary" center>
					{t("meals.noMeals")}
				</Text>
				<Text variant="md" color="textMuted" center marginTop="xs">
					{t("meals.addFirstMeal")}
				</Text>
			</View>
		);
	}
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<Box
				row
				alignItems="center"
				paddingHorizontal="md"
				paddingVertical="sm"
				style={{
					height: theme.sizes.headerHeight,
				}}
			>
				<Text variant="xl" weight="semibold" numberOfLines={1}>
					{t("meals.title")}
				</Text>
			</Box>
			<AnimatedBox
				marginHorizontal="md"
				gap="lg"
				entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
			>
				<Tabs
					tabs={periods}
					selectedTab={selectedPeriod}
					onSelectTab={handleSelectPeriod}
					theme={theme}
					labelRender={(tab) => t(`periods.${tab.toLowerCase()}`)}
				/>
			</AnimatedBox>
			<Animated.View layout={LinearTransition.springify()} style={{ flex: 1 }}>
				{filteredMeals.length > 0 ? (
					<FlatList
						data={filteredMeals}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <MealCard item={item} />}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							padding: theme.spacing.md,
							paddingBottom: theme.spacing.xxl,
						}}
					/>
				) : (
					renderEmptyList()
				)}
			</Animated.View>
		</View>
	);
};
const MealCard = (props: { item: Meal }) => {
	const { item } = props;
	const { language } = useTranslation();
	const theme = useTheme();
	const isArabic = language === "ar";
	return (
		<Animated.View
			layout={LinearTransition.springify().damping(15)}
			entering={FadeIn.duration(300)}
			style={{ marginBottom: theme.spacing.md }}
		>
			<Link asChild href={`/meals/${item.id}`}>
				<Pressable
					onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
					style={({ pressed }) => ({
						opacity: pressed ? 0.9 : 1,
						transform: [{ scale: pressed ? 0.98 : 1 }],
					})}
				>
					<Card padding="none" elevation="small">
						{item.image && (
							<Image
								source={{ uri: item.image }}
								style={{
									height: 140,
									width: "100%",
									borderTopLeftRadius: theme.radius.card,
									borderTopRightRadius: theme.radius.card,
								}}
								resizeMode="cover"
							/>
						)}
						<Box padding="md" gap={"sm"} alignItems="flex-start">
							<Text variant="lg" weight="semibold">
								{isArabic && item.name_ar ? item.name_ar : item.name}
							</Text>
							<Text
								variant="sm"
								color="textSecondary"
								marginBottom="md"
								numberOfLines={2}
							>
								{isArabic && item.description_ar
									? item.description_ar
									: item.description}
							</Text>
							<Box row marginBottom="sm">
								<Box row alignCenter>
									<Ionicons
										name="flame-outline"
										size={theme.sizes.iconSm}
										color={theme.colors.textSecondary}
										style={{ marginEnd: theme.spacing.xs }}
									/>
									<Text variant="sm" color="textSecondary">
										{item.calories} cal
									</Text>
								</Box>
							</Box>
						</Box>
					</Card>
				</Pressable>
			</Link>
		</Animated.View>
	);
};
export default MealScreen;
```

## File: apps/merchant-app/hooks/useColorScheme/index.ts
```typescript
export { useColorScheme } from 'react-native';
```

## File: apps/merchant-app/hooks/useColorScheme/useColorScheme.web.ts
```typescript
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  const colorScheme = useRNColorScheme();
  if (hasHydrated) {
    return colorScheme;
  }
  return 'light';
}
```

## File: .npmrc
```
node-linker=hoisted
engine-strict=true
```

## File: apps/merchant-app/components/fields/CategoryField.tsx
```typescript
import React, { useCallback } from "react";
import {
	View,
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
export const CategoryField = React.memo(
	({
		options,
		value,
		onChange,
		label,
		style,
		error,
		required,
		disabled = false,
	}: CategoryFieldProps) => {
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
			<View style={[{ width: "100%" }, style]}>
				{label && (
					<View
						style={{ flexDirection: "row", marginBottom: theme.spacing.xs }}
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
				<Animated.View style={[{ width: "100%" }, containerAnimStyle]}>
					<Animated.View
						style={{
							flexDirection: "row",
							backgroundColor: theme.colors.backgroundAlt,
							borderRadius: theme.radius.md,
							padding: theme.spacing.xs,
							opacity: disabled ? 0.6 : 1,
						}}
					>
						{options.map((option) => (
							<CategoryOption
								key={option.value}
								option={option}
								isSelected={option.value === value}
								onSelect={() => handleSelect(option.value)}
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
	},
);
interface CategoryOptionProps {
	option: CategoryOption;
	isSelected: boolean;
	onSelect: () => void;
	disabled?: boolean;
	hasError?: boolean;
}
const CategoryOption = React.memo(
	({
		option,
		isSelected,
		onSelect,
		disabled,
		hasError = false,
	}: CategoryOptionProps) => {
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
					<Animated.Text style={textAnimatedStyle}>
						{option.label}
					</Animated.Text>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	},
);
```

## File: apps/merchant-app/components/fields/FocusableInput.tsx
```typescript
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
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
export interface FocusableInputProps {
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
						damping: 8,
						stiffness: 300,
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
		const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			setIsFocused(false);
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
```

## File: apps/merchant-app/components/fields/RadioField.tsx
```typescript
import React from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
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
```

## File: apps/merchant-app/components/fields/SwitchField.tsx
```typescript
import React, { useEffect } from "react";
import {
	View,
	Switch as RNSwitch,
	TouchableWithoutFeedback,
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
export const SwitchField = React.memo(
	({
		value,
		onValueChange,
		label,
		description,
		disabled = false,
		leftIcon,
		style,
		error,
	}: SwitchFieldProps) => {
		const theme = useTheme();
		const animatedValue = useSharedValue(value ? 1 : 0);
		const pressedValue = useSharedValue(0);
		const hasError = !!error;
		useEffect(() => {
			animatedValue.value = withTiming(value ? 1 : 0, { duration: 150 });
		}, [value]);
		useEffect(() => {
			if (hasError) {
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
			const translateX = hasError
				? withSpring(0, {
						velocity: pressedValue.value > 0.5 ? 0 : 5,
						damping: 8,
					})
				: 0;
			const backgroundColor = hasError
				? `${theme.colors.error}10`
				: "transparent";
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
		const handleSwitchValueChange = () => {
			if (!disabled) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				handlePressIn();
				setTimeout(() => handlePressOut(), 200);
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
				<Animated.View
					style={[
						{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							paddingVertical: 12,
						},
						containerAnimatedStyle,
						style,
					]}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							flex: 1,
							marginEnd: 12,
						}}
					>
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
						<View style={{ flex: 1 }}>
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
						style={
							hasError &&
							Platform.OS === "android" && {
								borderWidth: 1,
								borderColor: theme.colors.error,
								borderRadius: 16,
							}
						}
					/>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	},
);
```

## File: apps/merchant-app/components/layout/ScreenContainer.tsx
```typescript
import { useTheme } from "@/hooks/useTheme";
import { Screen } from "expo-router/build/views/Screen";
import React from "react";
import { RefreshControlProps, ScrollView, StatusBar, View } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
interface ScreenContainerProps {
	children: React.ReactNode;
	scrollable?: boolean;
	screenOptions?: any;
	header?: React.ReactNode;
	padded?: boolean;
	refreshControl?: React.ReactElement<RefreshControlProps>;
	contentContainerStyle?: any;
	bottomInset?: boolean;
}
export const ScreenContainer = React.memo(
	({
		children,
		scrollable = true,
		screenOptions = { headerShown: false },
		header,
		padded = true,
		refreshControl,
		contentContainerStyle,
		bottomInset = true,
	}: ScreenContainerProps) => {
		const theme = useTheme();
		const insets = useSafeAreaInsets();
		const containerStyle = {
			flex: 1,
			backgroundColor: theme.colors.background,
		};
		const contentStyle = {
			flex: 1,
			paddingHorizontal: padded ? theme.spacing.screenPadding : 0,
		};
		const scrollContentStyle = {
			flexGrow: 1,
			paddingBottom: bottomInset
				? insets.bottom || theme.spacing.xl
				: theme.spacing.xl,
		};
		const Container = header ? View : SafeAreaView;
		return (
			<>
				<Screen options={screenOptions} />
				<StatusBar
					barStyle={theme.isDark ? "light-content" : "dark-content"}
					backgroundColor={theme.colors.background}
				/>
				<Container style={containerStyle}>
					{header}
					{scrollable ? (
						<ScrollView
							style={contentStyle}
							contentContainerStyle={[
								scrollContentStyle,
								contentContainerStyle,
							]}
							showsVerticalScrollIndicator={false}
							refreshControl={refreshControl}
							keyboardShouldPersistTaps="handled"
						>
							{children}
						</ScrollView>
					) : (
						<View style={contentStyle}>{children}</View>
					)}
				</Container>
			</>
		);
	},
);
```

## File: apps/merchant-app/components/ui/Avatar.tsx
```typescript
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
```

## File: apps/merchant-app/components/ui/Button.tsx
```typescript
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	ActivityIndicator,
	TouchableOpacity,
	TouchableOpacityProps,
} from "react-native";
import { Text } from "./Text";
interface ButtonProps extends TouchableOpacityProps {
	title: string;
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	leftIcon?: string;
	rightIcon?: string;
	loading?: boolean;
	rounded?: boolean;
	fullWidth?: boolean;
	textColor?: string;
}
export const Button = React.memo(
	({
		title,
		variant = "primary",
		size = "md",
		leftIcon,
		rightIcon,
		loading = false,
		rounded = false,
		fullWidth = false,
		style,
		textColor: textColorOverride,
		...props
	}: ButtonProps) => {
		const theme = useTheme();
		const getVariantStyles = () => {
			switch (variant) {
				case "primary":
					return {
						backgroundColor: theme.colors.primary,
						textColorToken: theme.colors.background,
					};
				case "secondary":
					return {
						backgroundColor: theme.colors.cardAlt,
						textColorToken: theme.colors.text,
					};
				case "outline":
					return {
						backgroundColor: "transparent",
						borderWidth: 1,
						borderColor: theme.colors.primary,
						textColorToken: theme.colors.primary,
					};
				case "ghost":
					return {
						backgroundColor: "transparent",
						textColorToken: theme.colors.primary,
					};
				default:
					return {
						backgroundColor: theme.colors.primary,
						textColorToken: theme.colors.background,
					};
			}
		};
		const getSizeStyles = () => {
			switch (size) {
				case "sm":
					return {
						height: theme.sizes.buttonSm,
						paddingHorizontal: theme.spacing.md,
						fontSize: "sm" as const,
						iconSize: theme.sizes.iconXs,
					};
				case "md":
					return {
						height: theme.sizes.buttonMd,
						paddingHorizontal: theme.spacing.md,
						fontSize: "md" as const,
						iconSize: theme.sizes.iconSm,
					};
				case "lg":
					return {
						height: theme.sizes.buttonLg,
						paddingHorizontal: theme.spacing.lg,
						fontSize: "md" as const,
						iconSize: theme.sizes.iconMd,
					};
				default:
					return {
						height: theme.sizes.buttonMd,
						paddingHorizontal: theme.spacing.md,
						fontSize: "md" as const,
						iconSize: theme.sizes.iconSm,
					};
			}
		};
		const variantStyle = getVariantStyles();
		const sizeStyle = getSizeStyles();
		const finalTextColor = textColorOverride || variantStyle.textColorToken;
		const iconStyle = {
			marginEnd: leftIcon && title ? theme.spacing.xs : 0,
			marginStart: rightIcon && title ? theme.spacing.xs : 0,
		};
		return (
			<TouchableOpacity
				style={[
					{
						height: sizeStyle.height,
						paddingHorizontal: sizeStyle.paddingHorizontal,
						borderRadius: rounded ? theme.radius.round : theme.radius.button,
						backgroundColor: variantStyle.backgroundColor,
						borderWidth: variantStyle.borderWidth || 0,
						borderColor: variantStyle.borderColor,
						flexDirection: "row" as const,
						alignItems: "center" as const,
						justifyContent: "center" as const,
						width: fullWidth ? "100%" : undefined,
					},
					style,
				]}
				activeOpacity={0.7}
				disabled={loading || props.disabled}
				{...props}
			>
				{loading ? (
					<ActivityIndicator color={finalTextColor} size="small" />
				) : (
					<>
						{leftIcon && (
							<Ionicons
								name={leftIcon as any}
								size={sizeStyle.iconSize}
								color={finalTextColor}
								style={iconStyle}
							/>
						)}
						<Text
							variant={sizeStyle.fontSize}
							weight="semibold"
							color={finalTextColor}
						>
							{title}
						</Text>
						{rightIcon && (
							<Ionicons
								name={rightIcon as any}
								size={sizeStyle.iconSize}
								color={finalTextColor}
								style={iconStyle}
							/>
						)}
					</>
				)}
			</TouchableOpacity>
		);
	},
);
```

## File: apps/merchant-app/components/ui/Card.tsx
```typescript
import React from "react";
import {
	TouchableOpacity,
	TouchableOpacityProps,
	StyleProp,
	ViewStyle,
	View,
} from "react-native";
import { RadiusToken, SpacingToken, useTheme } from "@/hooks/useTheme";
interface CardProps extends TouchableOpacityProps {
	elevation?: "none" | "small" | "medium" | "large";
	padding?: string | number | SpacingToken;
	rounded?: string | RadiusToken;
	style?: StyleProp<ViewStyle>;
	children?: React.ReactNode;
}
export const Card = React.memo(
	({
		children,
		elevation = "small",
		padding = "md",
		rounded = "card",
		style,
		onPress,
		...props
	}: CardProps) => {
		const theme = useTheme();
		const getElevation = () => {
			if (elevation === "none") return {};
			const shadowStyle = theme.shadows[elevation];
			return { ...shadowStyle, shadowColor: theme.colors.shadow };
		};
		const getPaddingValue = () => {
			return typeof padding === "number"
				? padding
				: theme.spacing[padding as SpacingToken];
		};
		const getRadiusValue = () => {
			return theme.radius[rounded as RadiusToken];
		};
		const cardStyle = {
			backgroundColor: theme.colors.card,
			borderRadius: getRadiusValue(),
			padding: getPaddingValue(),
			...getElevation(),
		};
		const ContainerComponent = onPress ? TouchableOpacity : View;
		return (
			<ContainerComponent
				activeOpacity={onPress ? 0.7 : 1}
				style={[cardStyle, style]}
				onPress={onPress}
				{...props}
			>
				{children}
			</ContainerComponent>
		);
	},
);
```

## File: apps/merchant-app/components/ui/index.ts
```typescript
export * from "./Box";
export * from "./Text";
export * from "./Button";
export * from "./Avatar";
export * from "./Card";
export * from "./Badge";
export * from "./Tabs";
```

## File: apps/merchant-app/hooks/useLanguage.ts
```typescript
import { useState, useEffect } from "react";
import { I18nManager } from "react-native";
import { Language } from "@/constants/i18n";
const DEFAULT_LANGUAGE: Language = "ar";
export function useLanguage() {
	const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
	useEffect(() => {
		const loadLanguage = async () => {
			const savedLanguage = DEFAULT_LANGUAGE;
			if (savedLanguage === "en" || savedLanguage === "ar") {
				setLanguage(savedLanguage);
				const shouldBeRTL = savedLanguage === "ar";
				if (shouldBeRTL !== I18nManager.isRTL) {
					I18nManager.forceRTL(shouldBeRTL);
				} else if (!shouldBeRTL && I18nManager.isRTL) {
					I18nManager.forceRTL(false);
				}
			}
		};
		loadLanguage();
	}, []);
	const changeLanguage = async (newLanguage: Language) => {
		try {
			setLanguage(newLanguage);
			const shouldBeRTL = newLanguage === "ar";
			if (shouldBeRTL !== I18nManager.isRTL) {
				I18nManager.allowRTL(shouldBeRTL);
				I18nManager.forceRTL(shouldBeRTL);
			}
		} catch (error) {
			console.error("Failed to save language setting:", error);
		}
	};
	return { language, changeLanguage };
}
```

## File: apps/merchant-app/hooks/useTheme.ts
```typescript
import { useColorScheme } from "react-native";
import { theme, ThemeMode } from "@/constants/theme";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
export const useTheme = () => {
	const colorScheme = useColorScheme() || "light";
	const isDark = colorScheme === "dark";
	const mode: ThemeMode = isDark ? "dark" : "light";
	const navTheme = isDark ? DarkTheme : DefaultTheme;
	return {
		colors: theme.colors[mode],
		isDark,
		mode,
		spacing: theme.spacing,
		radius: theme.radius,
		sizes: theme.sizes,
		typography: theme.typography,
		shadows: theme.shadows,
		platform: theme.platform,
		navTheme: {
			...navTheme,
			colors: {
				...navTheme.colors,
				primary: theme.colors[mode].primary,
				background: theme.colors[mode].background,
				card: theme.colors[mode].card,
				text: theme.colors[mode].text,
				border: theme.colors[mode].divider,
				notification: theme.colors[mode].primary,
			},
		},
	};
};
export type AppTheme = ReturnType<typeof useTheme>;
export type SpacingToken = keyof AppTheme["spacing"];
export type RadiusToken = keyof AppTheme["radius"];
export type ColorToken = keyof AppTheme["colors"];
export type ThemeTokens = {
	spacing: SpacingToken;
	radius: RadiusToken;
	colors: ColorToken;
};
export type FontSizeVariant = keyof AppTheme["typography"]["sizes"];
export type FontWeightVariant = keyof AppTheme["typography"]["weights"];
```

## File: apps/merchant-app/hooks/useTranslation.ts
```typescript
import { translations } from "@/constants/i18n";
import { useCallback } from "react";
import { useLanguage } from "./useLanguage";
import { I18nManager } from "react-native";
type TranslationsType = typeof translations.en;
type Primitive = string | number | boolean | null | undefined;
type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${"" extends P ? "" : "."}${P}`
		: never
	: never;
type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends Primitive
		? ""
		:
				| {
						[K in keyof T]: K extends string | number
							? K | Join<K, Paths<T[K], Prev[D]>>
							: never;
				  }[keyof T & (string | number)]
				| "";
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export type TranslationPath = Paths<TranslationsType, 4>;
export function useTranslation() {
	const { language } = useLanguage();
	const isRTL = I18nManager.isRTL;
	const t = useCallback(
		(path: string, params?: Record<string, string | number>): string => {
			const keys = path.split(".");
			let translation: any = translations[language];
			for (const key of keys) {
				translation = translation?.[key];
				if (translation === undefined) {
					let fallback: any = translations.en;
					for (const k of keys) {
						fallback = fallback?.[k];
						if (fallback === undefined) break;
					}
					translation = fallback;
					break;
				}
			}
			if (typeof translation !== "string") {
				return path;
			}
			if (params) {
				return Object.entries(params).reduce(
					(result, [key, value]) => result.replace(`{{${key}}}`, String(value)),
					translation,
				);
			}
			return translation;
		},
		[language],
	);
	return { t, language, isRTL };
}
```

## File: apps/merchant-app/app/meals/[meal-id].tsx
```typescript
import { AnimatedBox, Badge, Box, Button, Text } from "@/components/ui";
import FocusableInput from "@/components/fields/FocusableInput";
import { SwitchField } from "@/components/fields/SwitchField";
import { CategoryField } from "@/components/fields/CategoryField";
import { RadioField } from "@/components/fields/RadioField";
import { MEALS } from "@/data";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { Meal } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
	Alert,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TextInput,
	View,
} from "react-native";
import Animated, {
	FadeIn,
	FadeInRight,
	FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, TabType } from "@/components/ui/Tabs";
const MealFormScreen = React.memo(() => {
	const { "meal-id": mealId } = useLocalSearchParams<{ "meal-id": string }>();
	const theme = useTheme();
	const { t, language, isRTL } = useTranslation();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const isArabic = language === "ar";
	const isEdit = mealId !== "new";
	const sectionTabs: TabType[] = [
		{
			key: "basic",
			label: t("meals.basicInfo"),
			iconLeft: "information-circle-outline",
		},
		{
			key: "settings",
			label: t("common.settings"),
			iconLeft: "settings-outline",
		},
	];
	const [activeSection, setActiveSection] = useState<string>("basic");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const nameInputRef = useRef<TextInput>(null);
	const nameArInputRef = useRef<TextInput>(null);
	const descInputRef = useRef<TextInput>(null);
	const descArInputRef = useRef<TextInput>(null);
	const priceInputRef = useRef<TextInput>(null);
	const caloriesInputRef = useRef<TextInput>(null);
	const prepTimeInputRef = useRef<TextInput>(null);
	const ingredientsInputRef = useRef<TextInput>(null);
	const ingredientsArInputRef = useRef<TextInput>(null);
	const [meal, setMeal] = useState<Partial<Meal>>({
		id: "",
		name: "",
		name_ar: "",
		description: "",
		description_ar: "",
		price: 0,
		ingredients: [],
		ingredients_ar: [],
		calories: 0,
		prepTime: 0,
		period: "Breakfast",
		available: true,
		image: "",
		isVegan: false,
	});
	const periodOptions = [
		{ value: "Breakfast", label: t("periods.breakfast"), icon: "cafe-outline" },
		{ value: "Lunch", label: t("periods.lunch"), icon: "restaurant-outline" },
		{ value: "Dinner", label: t("periods.dinner"), icon: "fast-food-outline" },
	];
	const dietaryOptions = [
		{
			value: "none",
			label: "Regular",
			description: "No dietary restrictions",
		},
		{
			value: "vegetarian",
			label: "Vegetarian",
			description: "No meat, may include dairy and eggs",
		},
		{
			value: "vegan",
			label: "Vegan",
			description: "No animal products",
		},
		{
			value: "glutenFree",
			label: "Gluten Free",
			description: "No wheat or gluten",
		},
	];
	useEffect(() => {
		if (isEdit) {
			const existingMeal = MEALS.find((m) => m.id === mealId);
			if (existingMeal) setMeal(existingMeal);
		} else {
			setMeal((prev) => ({ ...prev, id: `meal-${Date.now()}` }));
		}
	}, [mealId, isEdit]);
	useEffect(() => {
		const timer = setTimeout(() => {
			if (!isEdit && nameInputRef.current) {
				nameInputRef.current.focus();
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [isEdit]);
	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!meal.name?.trim()) {
			newErrors.name = t("validation.required");
		}
		if (!meal.description?.trim()) {
			newErrors.description = t("validation.required");
		}
		if (!meal.price || meal.price <= 0) {
			newErrors.price = t("validation.invalidPrice");
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSave = () => {
		Keyboard.dismiss();
		if (!validateForm()) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			return;
		}
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			router.back();
		}, 1000);
	};
	const handleSubmitEditing = (
		nextInput: React.RefObject<TextInput | null>,
	) => {
		if (nextInput?.current) {
			setTimeout(() => {
				nextInput.current?.focus();
			}, 50);
		} else {
			Keyboard.dismiss();
		}
	};
	const handleDelete = () => {
		Alert.alert(t("meals.confirmDelete"), "", [
			{ text: t("common.cancel"), style: "cancel" },
			{
				text: t("common.delete"),
				style: "destructive",
				onPress: () => {
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
					setTimeout(() => router.back(), 500);
				},
			},
		]);
	};
	const updateField = (field: keyof Meal, value: any) => {
		setMeal((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: theme.colors.background,
					paddingTop: insets.top,
				}}
			>
				<Stack.Screen options={{ headerShown: false }} />
				<AnimatedBox
					row
					alignItems="center"
					justifyContent="space-between"
					paddingHorizontal="md"
					paddingVertical="sm"
					style={{
						height: theme.sizes.headerHeight,
						borderBottomWidth: 1,
						borderBottomColor: theme.colors.divider,
					}}
					entering={FadeIn.duration(300)}
				>
					<Box row alignItems="center">
						<Button
							title=""
							variant="ghost"
							leftIcon={isRTL ? "chevron-forward" : "chevron-back"}
							size="sm"
							onPress={() => router.back()}
							style={{ marginEnd: theme.spacing.sm }}
						/>
						<Text variant="xl" weight="semibold" numberOfLines={1}>
							{isEdit
								? isArabic && meal.name_ar
									? meal.name_ar
									: meal.name
								: t("meals.addNew")}
						</Text>
						{isEdit && (
							<Badge
								text={t(
									meal.available ? "meals.available" : "meals.unavailable",
								)}
								variant={meal.available ? "success" : "warning"}
								size="sm"
								style={{ marginStart: theme.spacing.sm }}
							/>
						)}
					</Box>
					{isEdit && (
						<Button
							title=""
							variant="ghost"
							leftIcon="trash-outline"
							size="sm"
							onPress={handleDelete}
							textColor={theme.colors.error}
						/>
					)}
				</AnimatedBox>
				<ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{
						padding: theme.spacing.md,
						paddingBottom: insets.bottom + theme.spacing.xxl,
					}}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					<AnimatedBox
						entering={FadeInUp.delay(100).duration(400)}
						marginBottom="md"
						style={{
							borderRadius: theme.radius.lg,
							overflow: "hidden",
							height: 240,
						}}
					>
						{meal.image ? (
							<Box
								style={{ height: "100%", width: "100%", position: "relative" }}
							>
								<Image
									source={{ uri: meal.image }}
									style={{ width: "100%", height: "100%" }}
									resizeMode="cover"
								/>
								<Box
									style={{
										position: "absolute",
										bottom: 0,
										left: 0,
										right: 0,
										height: 80,
										backgroundColor: "rgba(0,0,0,0.3)",
										padding: theme.spacing.md,
										justifyContent: "flex-end",
									}}
								>
									<Text
										variant="lg"
										weight="semibold"
										color="#fff"
										numberOfLines={1}
									>
										{isArabic && meal.name_ar
											? meal.name_ar
											: meal.name || t("meals.mealName")}
									</Text>
									<Box row alignItems="center" marginTop="xs">
										<Ionicons
											name="flame-outline"
											size={theme.sizes.iconSm}
											color="#fff"
											style={{ marginEnd: theme.spacing.xs }}
										/>
										<Text variant="sm" color="#fff">
											{meal.calories ? `${meal.calories} cal` : "0 cal"}
										</Text>
										<Text
											variant="sm"
											color="#fff"
											style={{ marginHorizontal: theme.spacing.xs }}
										>
											•
										</Text>
										<Ionicons
											name="time-outline"
											size={theme.sizes.iconSm}
											color="#fff"
											style={{ marginEnd: theme.spacing.xs }}
										/>
										<Text variant="sm" color="#fff">
											{meal.prepTime ? `${meal.prepTime} min` : "0 min"}
										</Text>
									</Box>
								</Box>
								<Box
									style={{
										position: "absolute",
										top: theme.spacing.sm,
										right: theme.spacing.sm,
										backgroundColor: "rgba(0,0,0,0.5)",
										borderRadius: theme.radius.round,
										padding: theme.spacing.xs,
									}}
								>
									<Ionicons
										name="camera-outline"
										size={theme.sizes.iconMd}
										color="#fff"
									/>
								</Box>
							</Box>
						) : (
							<Box
								style={{
									height: "100%",
									width: "100%",
									backgroundColor: theme.colors.cardAlt,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Ionicons
									name="camera-outline"
									size={theme.sizes.iconLg}
									color={theme.colors.primary}
									style={{ marginBottom: theme.spacing.sm }}
								/>
								<Text variant="md" weight="semibold" color="primary">
									{t("meals.addImage")}
								</Text>
							</Box>
						)}
					</AnimatedBox>
					<AnimatedBox
						entering={FadeInUp.delay(200).duration(400)}
						bg="backgroundAlt"
						rounded="lg"
						marginBottom="md"
					>
						<Tabs
							tabs={sectionTabs}
							selectedTab={activeSection}
							onSelectTab={setActiveSection}
						/>
					</AnimatedBox>
					{activeSection === "basic" && (
						<Animated.View
							entering={FadeInRight.delay(100).duration(100)}
							key={activeSection}
							style={{ gap: theme.spacing.md }}
						>
							<Box card rounded="md" padding="lg" elevation="small">
								<Box row alignItems="center" marginBottom="md">
									<Ionicons
										name="information-circle-outline"
										size={theme.sizes.iconSm}
										color={theme.colors.primary}
										style={{ marginEnd: theme.spacing.sm }}
									/>
									<Text variant="lg" weight="semibold">
										{t("meals.basicInfo")}
									</Text>
								</Box>
								<Box marginBottom="md">
									<FocusableInput
										inputRef={nameInputRef}
										label={t("meals.mealName")}
										required
										value={meal.name}
										onChangeText={(text) => updateField("name", text)}
										placeholder={t("meals.mealName")}
										placeholderTextColor={theme.colors.textMuted}
										returnKeyType="next"
										onSubmitEditing={() => handleSubmitEditing(nameArInputRef)}
										style={{ marginBottom: theme.spacing.sm }}
										error={errors.name}
									/>
									<FocusableInput
										inputRef={nameArInputRef}
										label={`${t("meals.mealName")} (العربية)`}
										value={meal.name_ar}
										onChangeText={(text) => updateField("name_ar", text)}
										placeholder={`${t("meals.mealName")} (العربية)`}
										placeholderTextColor={theme.colors.textMuted}
										returnKeyType="next"
										onSubmitEditing={() => handleSubmitEditing(descInputRef)}
										textAlign={isArabic ? "right" : "left"}
									/>
								</Box>
								<Box marginBottom="md">
									<FocusableInput
										inputRef={descInputRef}
										label={t("meals.description")}
										required
										value={meal.description}
										onChangeText={(text) => updateField("description", text)}
										placeholder={t("meals.description")}
										placeholderTextColor={theme.colors.textMuted}
										multiline={true}
										numberOfLines={4}
										returnKeyType="next"
										onSubmitEditing={() => handleSubmitEditing(descArInputRef)}
										textAlignVertical="top"
										style={{ marginBottom: theme.spacing.sm }}
										error={errors.description}
									/>
									<FocusableInput
										inputRef={descArInputRef}
										label={`${t("meals.description")} (العربية)`}
										value={meal.description_ar}
										onChangeText={(text) => updateField("description_ar", text)}
										placeholder={`${t("meals.description")} (العربية)`}
										placeholderTextColor={theme.colors.textMuted}
										multiline={true}
										numberOfLines={4}
										returnKeyType="done"
										textAlign={isArabic ? "right" : "left"}
										textAlignVertical="top"
									/>
								</Box>
								<Box marginBottom="md">
									<CategoryField
										label={t("meals.mealPeriod")}
										options={periodOptions}
										value={meal.period || "Breakfast"}
										onChange={(value) => updateField("period", value)}
										error={errors.period}
									/>
								</Box>
								<Box marginBottom="md">
									<RadioField
										label="Dietary Restrictions"
										options={dietaryOptions}
										value={meal.dietaryRestriction || "none"}
										onChange={(value) =>
											updateField("dietaryRestriction", value)
										}
										error={errors.dietaryRestriction}
									/>
								</Box>
							</Box>
							<Box card rounded="md" padding="lg" elevation="small">
								<Box row alignItems="center" marginBottom="md">
									<Ionicons
										name="list-outline"
										size={theme.sizes.iconSm}
										color={theme.colors.primary}
										style={{ marginEnd: theme.spacing.sm }}
									/>
									<Text variant="lg" weight="semibold">
										{t("meals.details")}
									</Text>
								</Box>
								<Box row gap="md" marginBottom="md">
									<Box flex={1}>
										<FocusableInput
											inputRef={priceInputRef}
											label={t("meals.price")}
											required
											value={meal.price ? meal.price.toString() : ""}
											onChangeText={(text) => {
												const numValue = Number.parseFloat(text) || 0;
												updateField("price", numValue);
											}}
											placeholder="0.00"
											placeholderTextColor={theme.colors.textMuted}
											keyboardType="numeric"
											returnKeyType="next"
											onSubmitEditing={() =>
												handleSubmitEditing(caloriesInputRef)
											}
											style={{
												paddingLeft: 36,
												fontSize: theme.typography.sizes.lg,
												fontWeight: theme.typography.weights.semibold as any,
											}}
											error={errors.price}
										/>
										<Box
											style={{
												position: "absolute",
												left: theme.spacing.md,
												top: 28,
												bottom: 0,
												justifyContent: "center",
												zIndex: 1,
											}}
										>
											<Text variant="md" color="textSecondary">
												$
											</Text>
										</Box>
									</Box>
									<Box flex={1}>
										<FocusableInput
											inputRef={caloriesInputRef}
											label={t("meals.calories")}
											value={meal.calories ? meal.calories.toString() : ""}
											onChangeText={(text) => {
												const numValue = Number.parseInt(text) || 0;
												updateField("calories", numValue);
											}}
											placeholder="0"
											placeholderTextColor={theme.colors.textMuted}
											keyboardType="numeric"
											returnKeyType="next"
											onSubmitEditing={() =>
												handleSubmitEditing(prepTimeInputRef)
											}
											style={{
												paddingRight: 40,
												fontSize: theme.typography.sizes.lg,
												fontWeight: theme.typography.weights.semibold as any,
											}}
										/>
										<Box
											style={{
												position: "absolute",
												right: theme.spacing.md,
												top: 28,
												bottom: 0,
												justifyContent: "center",
												zIndex: 1,
											}}
										>
											<Text variant="md" color="textSecondary">
												cal
											</Text>
										</Box>
									</Box>
								</Box>
								<Box marginBottom="md">
									<FocusableInput
										inputRef={prepTimeInputRef}
										label={t("meals.prepTime")}
										value={meal.prepTime ? meal.prepTime.toString() : ""}
										onChangeText={(text) => {
											const numValue = Number.parseInt(text) || 0;
											updateField("prepTime", numValue);
										}}
										placeholder="0"
										placeholderTextColor={theme.colors.textMuted}
										keyboardType="numeric"
										returnKeyType="next"
										onSubmitEditing={() =>
											handleSubmitEditing(ingredientsInputRef)
										}
										style={{
											paddingRight: 42,
											fontSize: theme.typography.sizes.lg,
											fontWeight: theme.typography.weights.semibold as any,
											maxWidth: "50%",
										}}
									/>
									<Box
										style={{
											position: "absolute",
											right: theme.spacing.md,
											top: 28,
											bottom: 0,
											justifyContent: "center",
											zIndex: 1,
										}}
									>
										<Text variant="md" color="textSecondary">
											min
										</Text>
									</Box>
								</Box>
								<Box marginBottom="md">
									<FocusableInput
										inputRef={ingredientsInputRef}
										label={t("meals.ingredients")}
										value={meal.ingredients ? meal.ingredients.join(", ") : ""}
										onChangeText={(text) => {
											const ingredients = text
												.split(",")
												.map((item) => item.trim())
												.filter(Boolean);
											updateField("ingredients", ingredients);
										}}
										placeholder={t("meals.ingredients")}
										placeholderTextColor={theme.colors.textMuted}
										multiline={true}
										numberOfLines={2}
										returnKeyType="next"
										textAlignVertical="top"
										onSubmitEditing={() =>
											handleSubmitEditing(ingredientsArInputRef)
										}
										style={{ marginBottom: theme.spacing.sm }}
									/>
									<FocusableInput
										inputRef={ingredientsArInputRef}
										label={`${t("meals.ingredients")} (العربية)`}
										value={
											meal.ingredients_ar ? meal.ingredients_ar.join(", ") : ""
										}
										onChangeText={(text) => {
											const ingredients = text
												.split(",")
												.map((item) => item.trim())
												.filter(Boolean);
											updateField("ingredients_ar", ingredients);
										}}
										placeholder={`${t("meals.ingredients")} (العربية)`}
										placeholderTextColor={theme.colors.textMuted}
										multiline={true}
										numberOfLines={2}
										returnKeyType="done"
										textAlign={isArabic ? "right" : "left"}
										textAlignVertical="top"
										onSubmitEditing={() => Keyboard.dismiss()}
									/>
								</Box>
								{meal.ingredients && meal.ingredients.length > 0 && (
									<Box
										row
										gap="xs"
										marginTop="md"
										padding="md"
										bg="backgroundAlt"
										rounded="md"
										style={{ flexWrap: "wrap" }}
									>
										{meal.ingredients.map((ingredient, idx) => (
											<Badge
												key={`ing-${idx.toString()}`}
												text={ingredient}
												variant="info"
												size="sm"
											/>
										))}
									</Box>
								)}
							</Box>
						</Animated.View>
					)}
					{activeSection === "settings" && (
						<Animated.View
							entering={FadeInRight.delay(100).duration(100)}
							key={activeSection}
						>
							<Box
								card
								rounded="md"
								padding="lg"
								marginBottom="md"
								elevation="small"
							>
								<Box row alignItems="center" marginBottom="md">
									<Ionicons
										name="settings-outline"
										size={theme.sizes.iconSm}
										color={theme.colors.primary}
										style={{ marginEnd: theme.spacing.sm }}
									/>
									<Text variant="lg" weight="semibold">
										{t("common.settings")}
									</Text>
								</Box>
								<SwitchField
									value={meal.available || false}
									onValueChange={(value) => updateField("available", value)}
									label={
										meal.available
											? t("meals.available")
											: t("meals.unavailable")
									}
									description={
										meal.available
											? t("meals.availableDesc")
											: t("meals.unavailableDesc")
									}
									leftIcon={
										meal.available
											? "checkmark-circle-outline"
											: "close-circle-outline"
									}
									style={{ marginBottom: theme.spacing.md }}
								/>
								<SwitchField
									value={meal.featured || false}
									onValueChange={(value) => updateField("featured", value)}
									label={t("meals.featured")}
									description={t("meals.featuredDesc")}
									leftIcon="star-outline"
									style={{ marginBottom: theme.spacing.md }}
								/>
								<SwitchField
									value={meal.isVegan || false}
									onValueChange={(value) => updateField("isVegan", value)}
									label="Vegan"
									description="This meal contains no animal products"
									leftIcon="leaf-outline"
								/>
							</Box>
							{isEdit && (
								<Box
									bg="error"
									padding="md"
									rounded="md"
									marginBottom="md"
									style={{ opacity: 0.9 }}
								>
									<Box row alignItems="center" marginBottom="sm">
										<Ionicons
											name="warning-outline"
											size={theme.sizes.iconMd}
											color="#fff"
											style={{ marginEnd: theme.spacing.sm }}
										/>
										<Text variant="md" weight="semibold" color="#fff">
											{t("meals.dangerZone")}
										</Text>
									</Box>
									<Text variant="sm" color="#fff" marginBottom="md">
										{t("meals.deleteMealWarning")}
									</Text>
									<Button
										title={t("common.delete")}
										variant="outline"
										size="md"
										style={{ borderColor: "#fff" }}
										textColor="#fff"
										onPress={handleDelete}
									/>
								</Box>
							)}
						</Animated.View>
					)}
					<AnimatedBox
						entering={FadeInUp.delay(300).duration(400)}
						marginTop="lg"
					>
						<Button
							title={isEdit ? t("meals.saveChanges") : t("meals.createMeal")}
							variant="primary"
							size="lg"
							loading={loading}
							fullWidth
							rounded
							leftIcon="save-outline"
							onPress={handleSave}
						/>
						{!isEdit && (
							<Button
								title={t("common.cancel")}
								variant="ghost"
								size="lg"
								fullWidth
								style={{ marginTop: theme.spacing.md }}
								onPress={() => router.back()}
							/>
						)}
					</AnimatedBox>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
});
export default MealFormScreen;
```

## File: apps/merchant-app/components/ui/Badge.tsx
```typescript
import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "./Text";
export interface BadgeProps extends ViewProps {
	text: string | number;
	variant?: "primary" | "success" | "warning" | "info" | "error" | "default";
	size?: "sm" | "md";
}
export const Badge = React.memo(
	({ text, variant = "default", size = "md", style, ...props }: BadgeProps) => {
		const theme = useTheme();
		const getBadgeStyles = () => {
			const base = {
				textColor: theme.colors.text,
				bgColor: theme.colors.backgroundAlt,
			};
			switch (variant) {
				case "primary":
					return {
						textColor: theme.colors.background,
						bgColor: theme.colors.primary,
					};
				case "success":
					return {
						textColor: theme.colors.background,
						bgColor: theme.colors.success,
					};
				case "warning":
					return {
						textColor: theme.colors.text,
						bgColor: theme.colors.warning,
					};
				case "info":
					return {
						textColor: theme.colors.background,
						bgColor: theme.colors.info,
					};
				case "error":
					return {
						textColor: theme.colors.background,
						bgColor: theme.colors.error,
					};
				default:
					return base;
			}
		};
		const getSizeStyles = () => {
			switch (size) {
				case "sm":
					return {
						paddingHorizontal: theme.spacing.sm,
						paddingVertical: theme.spacing.xs / 2,
						fontSize: "xs" as const,
					};
				default:
					return {
						paddingHorizontal: theme.spacing.sm,
						paddingVertical: theme.spacing.xs / 2 + 1,
						fontSize: "sm" as const,
					};
			}
		};
		const badgeStyle = getBadgeStyles();
		const sizeStyle = getSizeStyles();
		const badgeStyles = {
			backgroundColor: badgeStyle.bgColor,
			paddingHorizontal: sizeStyle.paddingHorizontal,
			paddingVertical: sizeStyle.paddingVertical,
			borderRadius: theme.radius.badge,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			alignSelf: "flex-start" as const,
		};
		return (
			<View style={[badgeStyles, style]} {...props}>
				<Text
					variant={sizeStyle.fontSize}
					weight="medium"
					color={badgeStyle.textColor}
				>
					{text}
				</Text>
			</View>
		);
	},
);
```

## File: apps/merchant-app/components/LanguageSelector.tsx
```typescript
import { Text } from "@/components/ui/Text";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
export const LanguageSelector = React.memo(() => {
	const { language, changeLanguage } = useLanguage();
	const theme = useTheme();
	const handleLanguageChange = useCallback((newLanguage: "en" | "ar") => {
		changeLanguage(newLanguage);
	}, []);
	return (
		<View style={{ alignItems: "flex-start" }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<TouchableOpacity
					style={{
						flex: 1,
						margin: theme.spacing.xs,
						padding: theme.spacing.sm,
						borderRadius: theme.radius.sm,
						borderWidth: 1,
						borderColor: theme.colors.primary,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor:
							language === "en" ? theme.colors.primary : "transparent",
					}}
					onPress={() => handleLanguageChange("en")}
					accessible={true}
					accessibilityRole="button"
					accessibilityLabel="Switch to English"
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons
							name="globe-outline"
							size={theme.sizes.iconSm}
							color={
								language === "en"
									? theme.colors.background
									: theme.colors.primary
							}
							style={{ marginEnd: theme.spacing.xs }}
						/>
						<Text
							variant="md"
							weight="medium"
							color={language === "en" ? "background" : "primary"}
						>
							English
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flex: 1,
						margin: theme.spacing.xs,
						padding: theme.spacing.sm,
						borderRadius: theme.radius.sm,
						borderWidth: 1,
						borderColor: theme.colors.primary,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor:
							language === "ar" ? theme.colors.primary : "transparent",
					}}
					onPress={() => handleLanguageChange("ar")}
					accessible={true}
					accessibilityRole="button"
					accessibilityLabel="Switch to Arabic"
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons
							name="globe-outline"
							size={theme.sizes.iconSm}
							color={
								language === "ar"
									? theme.colors.background
									: theme.colors.primary
							}
							style={{ marginEnd: theme.spacing.xs }}
						/>
						<Text
							variant="md"
							weight="medium"
							color={language === "ar" ? "background" : "primary"}
						>
							العربية
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
});
```

## File: apps/merchant-app/.gitignore
```
# @generated expo-cli sync-2b81b286409207a5da26e14c78851eb30d8ccbdb
# The following patterns were generated by expo-cli

expo-env.d.ts
# @end expo-cli
```

## File: apps/merchant-app/types.ts
```typescript
export interface MealCount {
	name: string;
	count: number;
	id: string | number;
}
export interface MealPrepSummary {
	period: "Breakfast" | "Lunch" | "Dinner";
	totalMeals: number;
	mealsToPrep: MealCount[];
}
export interface Alert {
	id: string | number;
	type: "warning" | "info" | "error";
	title: string;
	icon: string;
	timestamp?: string;
}
export interface StatItem {
	title: string;
	value: string | number;
	icon: string;
}
export interface OverviewStats {
	activeSubscriptions: number;
	newThisWeek: number;
}
export interface QuickActionItem {
	label: string;
	icon: string;
	action: () => void;
}
export interface Meal {
	dietaryRestriction?: string;
	featured: boolean;
	isVegan: boolean;
	id: string;
	name: string;
	name_ar?: string;
	description: string;
	description_ar?: string;
	price: number;
	ingredients: string[];
	ingredients_ar?: string[];
	calories: number;
	prepTime: number;
	period: string;
	available: boolean;
	image?: string;
}
```

## File: .nvimrc
```
23.11.0
```

## File: apps/merchant-app/app/settings.tsx
```typescript
import React, { useCallback } from "react";
import {
	TouchableOpacity,
	View,
	Appearance,
	ScrollView,
	Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { Text, Box, AnimatedBox, Avatar } from "@/components/ui";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import Animated, {
	FadeInUp,
	useAnimatedStyle,
	withTiming,
	LinearTransition,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SettingsScreen = React.memo(() => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();
	const restaurantName = "The Gourmet Spot";
	const handleThemeChange = useCallback((newTheme: "light" | "dark") => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		Appearance.setColorScheme(newTheme);
		console.log("Theme changed to:", newTheme);
	}, []);
	const ThemeOption = React.memo(
		({
			option,
		}: { option: { key: "light" | "dark"; icon: string; label: string } }) => {
			const theme = useTheme();
			const isSelected = theme.mode === option.key;
			const animatedStyle = useAnimatedStyle(() => {
				return {
					backgroundColor: withTiming(
						isSelected ? theme.colors.primaryLight : theme.colors.backgroundAlt,
						{ duration: 200 },
					),
					borderColor: withTiming(
						isSelected ? theme.colors.primary : theme.colors.divider,
						{ duration: 200 },
					),
					transform: [
						{ scale: withTiming(isSelected ? 1.0 : 0.98, { duration: 150 }) },
					],
					opacity: withTiming(isSelected ? 1 : 0.8, { duration: 200 }),
				};
			});
			const iconColor = isSelected
				? theme.colors.primary
				: theme.colors.textSecondary;
			const textColor = isSelected
				? theme.colors.primary
				: theme.colors.textSecondary;
			return (
				<AnimatedPressable
					key={option.key}
					style={[
						{
							flex: 1,
							marginHorizontal: theme.spacing.xs,
							paddingVertical: theme.spacing.md,
							paddingHorizontal: theme.spacing.sm,
							borderRadius: theme.radius.lg,
							borderWidth: 2,
							alignItems: "center",
							justifyContent: "center",
							minHeight: theme.sizes.buttonLg * 1.8,
						},
						animatedStyle,
					]}
					onPress={() => handleThemeChange(option.key)}
					accessible={true}
					accessibilityRole="button"
					accessibilityLabel={`Set theme to ${option.label}`}
					accessibilityState={{ selected: isSelected }}
				>
					<Ionicons
						name={option.icon as any}
						size={theme.sizes.iconLg}
						color={iconColor}
						style={{ marginBottom: theme.spacing.sm }}
					/>
					<Text variant="sm" weight="semibold" color={textColor}>
						{option.label}
					</Text>
				</AnimatedPressable>
			);
		},
	);
	const themeOptions = [
		{ key: "light", icon: "sunny-outline", label: t("settings.lightMode") },
		{ key: "dark", icon: "moon-outline", label: t("settings.darkMode") },
	] as const;
	const SettingsSection = React.memo(
		({
			title,
			icon,
			children,
			delay,
		}: {
			title: string;
			icon: any;
			children: React.ReactNode;
			delay: number;
		}) => (
			<AnimatedBox
				entering={FadeInUp.delay(delay).duration(500).springify().damping(18)}
				layout={LinearTransition.duration(300)}
				padding="lg"
				marginBottom="lg"
				bg="card"
				rounded="xl"
				style={{
					borderWidth: 1,
					borderColor: theme.colors.divider,
				}}
			>
				<Box row alignCenter marginBottom="md">
					<Ionicons
						name={icon}
						size={theme.sizes.iconSm}
						color={theme.colors.primary}
						style={{ marginEnd: theme.spacing.sm }}
					/>
					<Text variant="lg" weight="semibold" color="textSecondary">
						{title}
					</Text>
				</Box>
				{children}
			</AnimatedBox>
		),
	);
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<Stack.Screen options={{ headerShown: false }} />
			<Box
				row
				alignItems="center"
				paddingHorizontal="md"
				paddingVertical="sm"
				style={{
					height: theme.sizes.headerHeight,
				}}
			>
				<Text variant="xl" weight="semibold" numberOfLines={1}>
					{t("common.settings")}
				</Text>
			</Box>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: theme.spacing.md,
					paddingBottom: theme.spacing.md,
				}}
				showsVerticalScrollIndicator={false}
			>
				<AnimatedBox
					entering={FadeInUp.delay(100).duration(500).springify().damping(18)}
					row
					alignCenter
					bg="card"
					padding="md"
					rounded="xl"
					marginBottom="lg"
					style={{ borderWidth: 1, borderColor: theme.colors.divider }}
				>
					<Avatar
						text={restaurantName.charAt(0)}
						size="md"
						style={{ marginEnd: theme.spacing.md }}
					/>
					<Box alignItems="flex-start" flex={1}>
						<Text variant="sm" color="textSecondary">
							{t("settings.signedInAs") ?? "Signed in as"}
						</Text>
						<Text variant="lg" weight="semibold" numberOfLines={1}>
							{restaurantName}
						</Text>
					</Box>
					<Ionicons
						name="person-circle-outline"
						size={theme.sizes.iconLg}
						color={theme.colors.textMuted}
					/>
				</AnimatedBox>
				<SettingsSection
					title={t("settings.language")}
					icon="language-outline"
					delay={200}
				>
					<LanguageSelector />
				</SettingsSection>
				<SettingsSection
					title={t("settings.theme")}
					icon="color-palette-outline"
					delay={300}
				>
					<View
						style={{
							flexDirection: "row",
							marginHorizontal: -theme.spacing.xs,
						}}
					>
						{themeOptions.map((option) => (
							<ThemeOption key={option.key} option={option} />
						))}
					</View>
				</SettingsSection>
				<SettingsSection
					title={t("settings.appInfo")}
					icon="information-circle-outline"
					delay={400}
				>
					<Box row justifyContent="space-between" alignItems="center">
						<Text variant="md" weight="medium" color="textSecondary">
							{t("common.version")}
						</Text>
						<Text variant="md" weight="medium" color="textMuted">
							v1.0.0
						</Text>
					</Box>
				</SettingsSection>
				<AnimatedBox
					entering={FadeInUp.delay(500).duration(500).springify().damping(18)}
				>
					<TouchableOpacity
						style={{
							marginTop: theme.spacing.lg,
							padding: theme.spacing.md,
							borderRadius: theme.radius.lg,
							backgroundColor: theme.colors.cardAlt,
							borderWidth: 1,
							borderColor: theme.colors.error,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
						onPress={() => {
							Haptics.notificationAsync(
								Haptics.NotificationFeedbackType.Warning,
							);
							console.log("Logout Pressed");
						}}
					>
						<Ionicons
							name="log-out-outline"
							size={theme.sizes.iconMd}
							color={theme.colors.error}
							style={{ marginEnd: theme.spacing.sm }}
						/>
						<Text variant="md" weight="semibold" color="error">
							{t("settings.logout")}
						</Text>
					</TouchableOpacity>
				</AnimatedBox>
			</ScrollView>
		</View>
	);
});
export default SettingsScreen;
```

## File: apps/merchant-app/components/dashboard/AlertRow.tsx
```typescript
import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { Alert } from "@/types";
interface AlertRowProps {
	alert: Alert;
	onPress: () => void;
}
export const AlertRow = React.memo(({ alert, onPress }: AlertRowProps) => {
	const theme = useTheme();
	const iconColor = theme.colors[alert.type];
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => ({
				paddingHorizontal: theme.spacing.sm,
				flexDirection: "row",
				alignItems: "center",
				paddingVertical: theme.spacing.md,
				borderRadius: theme.radius.sm,
				backgroundColor: pressed ? theme.colors.backgroundAlt : undefined,
			})}
			android_ripple={{ color: theme.colors.overlay }}
		>
			<Ionicons
				name={alert.icon as any}
				size={theme.sizes.iconSm}
				color={iconColor}
				style={{ marginStart: theme.spacing.md }}
			/>
			<Box flex={1}>
				<Text variant="sm" numberOfLines={1}>
					{alert.title}
				</Text>
				{alert.timestamp && (
					<Text variant="xs" color="textMuted" marginTop={theme.spacing.xs / 2}>
						{alert.timestamp}
					</Text>
				)}
			</Box>
			<Ionicons
				name="chevron-back"
				size={theme.sizes.iconSm}
				color={theme.colors.textMuted}
			/>
		</Pressable>
	);
});
```

## File: apps/merchant-app/components/dashboard/AlertsCard.tsx
```typescript
import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutDown,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBox, Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { Alert } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
interface AlertsCardProps {
	alerts: Alert[];
	onViewAlert: (id: string | number) => void;
	onViewAllAlerts?: () => void;
}
export const AlertsCard = React.memo(
	({ alerts, onViewAlert, onViewAllAlerts }: AlertsCardProps) => {
		const theme = useTheme();
		const { t } = useTranslation();
		const hasAlerts = alerts.length > 0;
		return (
			<AnimatedBox
				entering={FadeInUp.delay(350).duration(400).springify().damping(15)}
				exiting={FadeOutDown.duration(200)}
				card
				rounded="sm"
				marginHorizontal="md"
				marginBottom="lg"
				elevation="small"
				style={{ overflow: "hidden" }}
			>
				<Box
					row
					justifyContent="space-between"
					alignItems="center"
					marginBottom="md"
					paddingHorizontal="md"
					paddingTop="md"
				>
					<Text variant="lg" weight="semibold">
						{t("dashboard.alerts")}
					</Text>
					{hasAlerts && (
						<Animated.View>
							<Pressable
								onPress={onViewAllAlerts}
								style={({ pressed }) => ({
									paddingVertical: theme.spacing.xs,
									paddingHorizontal: theme.spacing.sm,
									borderRadius: theme.spacing.sm,
									backgroundColor: pressed
										? theme.colors.backgroundAlt
										: undefined,
									opacity: pressed ? 0.5 : 1,
								})}
							>
								<Text variant="sm" color="primary" weight="medium">
									{t("dashboard.viewAll")}
								</Text>
							</Pressable>
						</Animated.View>
					)}
				</Box>
				{hasAlerts ? (
					<Box>
						{alerts.map((alert, index) => (
							<AlertItem
								key={alert.id}
								alert={alert}
								onPress={() => onViewAlert(alert.id)}
								isLast={index === alerts.length - 1}
							/>
						))}
					</Box>
				) : (
					<Box
						alignCenter
						paddingVertical="lg"
						paddingHorizontal="md"
						bg="backgroundAlt"
						style={{
							borderBottomLeftRadius: theme.radius.lg,
							borderBottomRightRadius: theme.radius.lg,
						}}
					>
						<Box
							rounded="round"
							bg="primaryLight"
							padding="md"
							marginBottom="md"
							style={{
								width: theme.sizes.avatarLg,
								height: theme.sizes.avatarLg,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Ionicons
								name="checkmark-circle"
								size={theme.sizes.iconMd}
								color={theme.colors.primary}
							/>
						</Box>
						<Text color="textSecondary" center>
							{t("dashboard.allCaughtUp")}
						</Text>
						<Text color="textMuted" variant="sm" center marginTop="xs">
							{t("dashboard.noAlerts")}
						</Text>
					</Box>
				)}
			</AnimatedBox>
		);
	},
);
interface AlertItemProps {
	alert: Alert;
	onPress: () => void;
	isLast?: boolean;
}
const AlertItem = React.memo(
	({ alert, onPress, isLast = false }: AlertItemProps) => {
		const theme = useTheme();
		const { isRTL } = useTranslation();
		const pressed = useSharedValue(0);
		const iconColor = theme.colors[alert.type];
		const handlePressIn = () => {
			pressed.value = withTiming(1, { duration: 100 });
		};
		const handlePressOut = () => {
			pressed.value = withTiming(0, { duration: 200 });
		};
		const animatedStyle = useAnimatedStyle(() => {
			return {
				transform: [
					{
						scale: withTiming(pressed.value === 1 ? 0.98 : 1, {
							duration: pressed.value === 1 ? 50 : 200,
						}),
					},
				],
				opacity: withTiming(pressed.value === 1 ? 0.5 : 1, {
					duration: pressed.value === 1 ? 50 : 200,
				}),
			};
		});
		return (
			<Animated.View
				style={[
					{
						borderBottomWidth: isLast ? 0 : 0.5,
						borderBottomColor: theme.colors.divider,
					},
					animatedStyle,
				]}
			>
				<Pressable
					onPress={onPress}
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					style={{
						flexDirection: "row",
						alignItems: "center",
						padding: theme.spacing.md,
					}}
					android_ripple={{ color: theme.colors.overlay }}
				>
					<View
						style={{
							width: theme.sizes.buttonSm,
							height: theme.sizes.buttonSm,
							borderRadius: theme.radius.round,
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: theme.colors.primaryLight,
							marginStart: theme.spacing.sm,
						}}
					>
						<Ionicons
							name={alert.icon as any}
							size={theme.sizes.iconSm}
							color={iconColor}
						/>
					</View>
					<Box
						flex={1}
						marginStart="sm"
						gap={theme.spacing.xs / 2}
						alignItems="flex-start"
					>
						<Text variant="sm" weight="medium" numberOfLines={1}>
							{alert.title}
						</Text>
						{alert.timestamp && (
							<Text variant="xs" color="textMuted">
								{alert.timestamp}
							</Text>
						)}
					</Box>
					<Box
						marginStart="sm"
						paddingVertical="xs"
						paddingHorizontal="sm"
						rounded="xs"
						bg="backgroundAlt"
					>
						<Text
							variant="xs"
							weight="medium"
							color={alert.type}
							numberOfLines={1}
						>
							{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
						</Text>
					</Box>
					<Ionicons
						name={isRTL ? "chevron-back" : "chevron-forward"}
						size={theme.sizes.iconSm}
						color={theme.colors.textMuted}
						style={{ marginStart: theme.spacing.sm }}
					/>
				</Pressable>
			</Animated.View>
		);
	},
);
```

## File: apps/merchant-app/components/dashboard/PrepCard.tsx
```typescript
import React, { useCallback } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolate,
	Extrapolation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Box, Text, Badge } from "@/components/ui";
import { MealPrepSummary } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
interface TodayPrepCardProps {
	summary: MealPrepSummary;
	onPress: () => void;
}
const PREP_CARD_WIDTH = 180;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const TodayPrepCard = React.memo(
	({ summary, onPress }: TodayPrepCardProps) => {
		const theme = useTheme();
		const { t } = useTranslation();
		const pressed = useSharedValue(0);
		const hovered = useSharedValue(0);
		const periodIcons = {
			Breakfast: "cafe-outline",
			Lunch: "restaurant-outline",
			Dinner: "fast-food-outline",
		};
		const periodColors: Record<
			"Breakfast" | "Lunch" | "Dinner",
			"info" | "primary" | "error"
		> = {
			Breakfast: "info",
			Lunch: "primary",
			Dinner: "error",
		};
		const translatedPeriod = t(`periods.${summary.period.toLowerCase()}`);
		const handlePressIn = useCallback(() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			pressed.value = withTiming(1, { duration: 100 });
		}, []);
		const handlePressOut = useCallback(() => {
			pressed.value = withTiming(0, { duration: 200 });
		}, []);
		const handleHoverIn = useCallback(() => {
			hovered.value = withTiming(1, { duration: 300 });
		}, []);
		const handleHoverOut = useCallback(() => {
			hovered.value = withTiming(0, { duration: 300 });
		}, []);
		const handlePress = useCallback(() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			onPress();
		}, [onPress]);
		const animatedCardStyle = useAnimatedStyle(() => {
			const scale = interpolate(
				pressed.value,
				[0, 1],
				[1, 0.95],
				Extrapolation.CLAMP,
			);
			const opacity = interpolate(
				pressed.value,
				[0, 1],
				[1, 0.5],
				Extrapolation.CLAMP,
			);
			return {
				transform: [{ scale }],
				opacity,
			};
		});
		return (
			<AnimatedPressable
				onPress={handlePress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onHoverIn={handleHoverIn}
				onHoverOut={handleHoverOut}
				style={[
					{
						width: PREP_CARD_WIDTH,
						margin: theme.spacing.xs / 2,
						borderRadius: theme.radius.lg,
					},
					animatedCardStyle,
				]}
			>
				<Box
					card
					rounded="lg"
					padding="md"
					elevation="small"
					style={{
						minHeight: theme.sizes.buttonLg * 4,
					}}
				>
					<Box row alignCenter marginBottom="sm">
						<Ionicons
							name={
								periodIcons[summary.period as keyof typeof periodIcons] as any
							}
							size={theme.sizes.iconSm}
							color={
								theme.colors[
									periodColors[summary.period as keyof typeof periodColors]
								]
							}
							style={{ marginEnd: theme.spacing.sm }}
						/>
						<Text variant="md" weight="semibold">
							{translatedPeriod}
						</Text>
					</Box>
					<Box marginTop="xs" flex={1} gap="sm">
						{summary.mealsToPrep.slice(0, 3).map((meal) => (
							<Box
								key={meal.id}
								row
								justifyContent="space-between"
								paddingVertical={theme.spacing.xs / 1.5}
							>
								<Text
									variant="sm"
									numberOfLines={1}
									style={{
										flexShrink: 1,
										marginEnd: theme.spacing.sm,
									}}
								>
									{meal.name}
								</Text>
								<Text variant="sm" weight="medium" color="textSecondary">
									{meal.count}
								</Text>
							</Box>
						))}
					</Box>
					<Box
						row
						justifyContent="space-between"
						alignItems="flex-end"
						paddingTop="sm"
					>
						<Badge
							text={`${summary.totalMeals} ${t("common.total")}`}
							variant={
								periodColors[summary.period as keyof typeof periodColors]
							}
							size="sm"
						/>
					</Box>
				</Box>
			</AnimatedPressable>
		);
	},
);
```

## File: apps/merchant-app/components/ui/Text.tsx
```typescript
import {
	ColorToken,
	FontSizeVariant,
	FontWeightVariant,
	SpacingToken,
	useTheme,
} from "@/hooks/useTheme";
import React, { memo } from "react";
import {
	Text as RNText,
	TextProps as RNTextProps,
	StyleProp,
	TextStyle,
} from "react-native";
interface TextProps extends RNTextProps {
	variant?: FontSizeVariant;
	weight?: FontWeightVariant;
	color?: ColorToken | string;
	center?: boolean;
	muted?: boolean;
	marginBottom?: SpacingToken | number;
	marginTop?: SpacingToken | number;
	marginStart?: SpacingToken | number;
	marginEnd?: SpacingToken | number;
	marginHorizontal?: SpacingToken | number;
	marginVertical?: SpacingToken | number;
	margin?: SpacingToken | number;
	paddingStart?: SpacingToken | number;
	paddingEnd?: SpacingToken | number;
	paddingHorizontal?: SpacingToken | number;
	paddingVertical?: SpacingToken | number;
	paddingTop?: SpacingToken | number;
	paddingBottom?: SpacingToken | number;
	padding?: SpacingToken | number;
	style?: StyleProp<TextStyle>;
	align?: TextStyle["textAlign"];
}
export const Text: React.FC<TextProps> = memo(
	({
		children,
		variant = "md",
		weight = "regular",
		color,
		center,
		muted,
		marginBottom,
		marginTop,
		marginStart,
		marginEnd,
		marginHorizontal,
		marginVertical,
		margin,
		paddingStart,
		paddingEnd,
		paddingHorizontal,
		paddingVertical,
		paddingTop,
		paddingBottom,
		padding,
		style,
		align,
		...props
	}) => {
		const theme = useTheme();
		const getSpacingValue = (
			value: SpacingToken | number | undefined,
		): number | undefined => {
			if (value === undefined) return undefined;
			return typeof value === "number" ? value : theme.spacing[value];
		};
		const getColorValue = (
			colorProp: ColorToken | string | undefined,
		): string => {
			if (colorProp === undefined) {
				return muted ? theme.colors.textSecondary : theme.colors.text;
			}
			if (typeof colorProp === "string" && colorProp in theme.colors) {
				return theme.colors[colorProp as ColorToken];
			}
			return colorProp;
		};
		const textAlign = center ? "center" : align;
		const textStyle: TextStyle = {
			fontSize: theme.typography.sizes[variant],
			fontWeight: theme.typography.weights[weight],
			color: getColorValue(color),
			textAlign,
			marginBottom: getSpacingValue(marginBottom),
			marginTop: getSpacingValue(marginTop),
			marginStart: getSpacingValue(marginStart),
			marginEnd: getSpacingValue(marginEnd),
			marginHorizontal: getSpacingValue(marginHorizontal),
			marginVertical: getSpacingValue(marginVertical),
			margin: getSpacingValue(margin),
			paddingStart: getSpacingValue(paddingStart),
			paddingEnd: getSpacingValue(paddingEnd),
			paddingHorizontal: getSpacingValue(paddingHorizontal),
			paddingVertical: getSpacingValue(paddingVertical),
			paddingTop: getSpacingValue(paddingTop),
			paddingBottom: getSpacingValue(paddingBottom),
			padding: getSpacingValue(padding),
		};
		return (
			<RNText style={[textStyle, style]} {...props}>
				{children}
			</RNText>
		);
	},
);
export default Text;
```

## File: apps/merchant-app/constants/theme.ts
```typescript
import { Platform } from "react-native";
import { DefaultTheme } from "@react-navigation/native";
const colorPalette = {
	primary: {
		50: "#EBFFF9",
		100: "#C3FFF0",
		200: "#9BFFE6",
		300: "#5FF6D8",
		400: "#22E5C8",
		500: "#0AC5AB",
		600: "#09A98F",
		700: "#07866F",
		800: "#056952",
		900: "#034C3A",
	},
	secondary: {
		50: "#F2EFFF",
		100: "#E4DFFF",
		200: "#CABFFF",
		300: "#A799FF",
		400: "#8E7AFF",
		500: "#7559FF",
		600: "#6038FF",
		700: "#4E1AFF",
		800: "#3C00FB",
		900: "#2F00C2",
	},
	neutral: {
		0: "#FFFFFF",
		50: "#F9FAFB",
		100: "#F1F5F9",
		200: "#E2E8F0",
		300: "#CBD5E1",
		400: "#94A3B8",
		500: "#64748B",
		600: "#475569",
		700: "#334155",
		800: "#1E293B",
		900: "#0F172A",
		950: "#0A0D14",
		1000: "#000000",
	},
	semantic: {
		success: "#22C55E",
		warning: "#FFBE0B",
		info: "#3B82F6",
		error: "#FF5E5B",
	},
};
const getRgba = (hex: string, alpha: number) => {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export const theme = {
	colors: {
		light: {
			primary: colorPalette.primary[500],
			primaryDark: colorPalette.primary[600],
			primaryLight: getRgba(colorPalette.primary[500], 0.1),
			secondary: colorPalette.secondary[500],
			secondaryLight: getRgba(colorPalette.secondary[500], 0.1),
			background: colorPalette.neutral[50],
			backgroundAlt: colorPalette.neutral[100],
			card: colorPalette.neutral[0],
			cardAlt: colorPalette.neutral[100],
			text: colorPalette.neutral[900],
			textSecondary: colorPalette.neutral[600],
			textMuted: colorPalette.neutral[400],
			success: colorPalette.semantic.success,
			warning: colorPalette.semantic.warning,
			info: colorPalette.semantic.info,
			error: colorPalette.semantic.error,
			divider: colorPalette.neutral[200],
			overlay: getRgba(colorPalette.neutral[950], 0.3),
			shadow: getRgba(colorPalette.neutral[900], 0.08),
			tabBar: colorPalette.neutral[0],
			tabIconDefault: colorPalette.neutral[400],
			tabIconSelected: colorPalette.primary[500],
		},
		dark: {
			primary: colorPalette.primary[400],
			primaryDark: colorPalette.primary[500],
			primaryLight: getRgba(colorPalette.primary[400], 0.15),
			secondary: colorPalette.secondary[400],
			secondaryLight: getRgba(colorPalette.secondary[400], 0.15),
			background: colorPalette.neutral[950],
			backgroundAlt: colorPalette.neutral[800],
			card: colorPalette.neutral[900],
			cardAlt: colorPalette.neutral[800],
			text: colorPalette.neutral[50],
			textSecondary: colorPalette.neutral[300],
			textMuted: colorPalette.neutral[500],
			success: colorPalette.semantic.success,
			warning: colorPalette.semantic.warning,
			info: colorPalette.semantic.info,
			error: colorPalette.semantic.error,
			divider: getRgba(colorPalette.neutral[0], 0.1),
			overlay: getRgba(colorPalette.neutral[950], 0.6),
			shadow: getRgba(colorPalette.neutral[1000], 0.3),
			tabBar: colorPalette.neutral[900],
			tabIconDefault: colorPalette.neutral[500],
			tabIconSelected: colorPalette.primary[400],
		},
	},
	spacing: {
		none: 0,
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
		xxl: 48,
		screenPadding: 16,
		cardPadding: 16,
		itemSpacing: 12,
		sectionSpacing: 24,
	} as const,
	radius: {
		none: 0,
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 24,
		round: 999,
		button: 12,
		card: 16,
		input: 12,
		badge: 12,
	} as const,
	sizes: {
		touchTarget: 44,
		smallTouchTarget: 36,
		iconXs: 16,
		iconSm: 20,
		iconMd: 24,
		iconLg: 32,
		buttonSm: 36,
		buttonMd: 44,
		buttonLg: 52,
		inputHeight: 48,
		headerHeight: 56,
		tabBarHeight: 49,
		avatarSm: 32,
		avatarMd: 44,
		avatarLg: 64,
	} as const,
	typography: {
		sizes: {
			xs: 12,
			sm: 14,
			md: 16,
			lg: 18,
			xl: 20,
			xxl: 24,
			xxxl: 30,
		} as const,
		weights: {
			regular: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800",
		} as const,
		lineHeights: {
			tight: 1.2,
			normal: 1.5,
			loose: 1.8,
		} as const,
	} as const,
	shadows: {
		small: {
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.8,
			shadowRadius: 2,
			elevation: 2,
		},
		medium: {
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.8,
			shadowRadius: 4,
			elevation: 4,
		},
		large: {
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.8,
			shadowRadius: 8,
			elevation: 8,
		},
	},
	platform: {
		topInset: Platform.OS === "ios" ? (DefaultTheme.dark ? 44 : 50) : 16,
		bottomInset: Platform.OS === "ios" ? 34 : 16,
		isIOS: Platform.OS === "ios",
		isAndroid: Platform.OS === "android",
	},
};
export type ThemeColors = typeof theme.colors.light;
export type ThemeMode = "light" | "dark";
```

## File: apps/merchant-app/data.ts
```typescript
import { Feather } from "@expo/vector-icons";
import { Alert, Meal, MealPrepSummary } from "./types";
export const TODAY_PREP_SUMMARY: MealPrepSummary[] = [
	{
		period: "Breakfast",
		totalMeals: 25,
		mealsToPrep: [
			{ id: "shashuka", name: "Shashuka", count: 15 },
			{ id: "oats", name: "Overnight Oats", count: 7 },
			{ id: "smoothie", name: "Green Smoothie", count: 3 },
		],
	},
	{
		period: "Lunch",
		totalMeals: 32,
		mealsToPrep: [
			{ id: "salad_x", name: "Quinoa Salad", count: 18 },
			{ id: "wrap_y", name: "Falafel Wrap", count: 10 },
			{ id: "soup_z", name: "Lentil Soup", count: 4 },
			{ id: "extra1", name: "Side Salad", count: 2 },
		],
	},
	{
		period: "Dinner",
		totalMeals: 28,
		mealsToPrep: [
			{ id: "salmon", name: "Grilled Salmon", count: 12 },
			{ id: "tofu_stirfry", name: "Tofu Stir-fry", count: 9 },
			{ id: "pasta_veg", name: "Veggie Pasta", count: 7 },
		],
	},
];
export const ALERTS: Alert[] = [
	{
		id: 1,
		type: "info",
		title: "New 'Keto Weekly' subscriber",
		icon: "person-add-outline",
		timestamp: "3h ago",
	},
	{
		id: 2,
		type: "warning",
		title: "Low inventory: Quinoa",
		icon: "cube-outline",
		timestamp: "1h ago",
	},
	{
		id: 3,
		type: "error",
		title: "Delivery issue Order #12345",
		icon: "car-sport-outline",
		timestamp: "Yesterday",
	},
];
export const MEALS: Meal[] = [
	{
		featured: false,
		isVegan: false,
		id: "b1",
		name: "Shakshuka",
		name_ar: "شكشوكة",
		description: "Eggs poached in spiced tomato sauce",
		description_ar: "بيض مطبوخ في صلصة طماطم متبلة",
		price: 12.99,
		ingredients: ["Eggs", "Tomatoes", "Bell Peppers", "Onions", "Spices"],
		ingredients_ar: ["بيض", "طماطم", "فلفل حلو", "بصل", "توابل"],
		calories: 380,
		prepTime: 25,
		period: "Breakfast",
		available: true,
		image:
			"https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hha3NodWthfGVufDB8fDB8fHww",
	},
	{
		featured: false,
		isVegan: false,
		id: "b2",
		name: "Overnight Oats",
		name_ar: "شوفان مبيت",
		description: "Oats soaked with yogurt and fruits",
		description_ar: "شوفان منقوع مع الزبادي والفواكه",
		price: 8.99,
		ingredients: ["Oats", "Yogurt", "Berries", "Honey", "Nuts"],
		ingredients_ar: ["شوفان", "زبادي", "توت", "عسل", "مكسرات"],
		calories: 320,
		prepTime: 10,
		period: "Breakfast",
		available: true,
		image:
			"https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG92ZXJuaWdodCUyMG9hdHN8ZW58MHx8MHx8fDA%3D",
	},
	{
		featured: false,
		isVegan: false,
		id: "l1",
		name: "Quinoa Salad",
		name_ar: "سلطة الكينوا",
		description: "Fresh salad with quinoa and vegetables",
		description_ar: "سلطة طازجة مع الكينوا والخضروات",
		price: 14.99,
		ingredients: ["Quinoa", "Cucumber", "Tomato", "Avocado", "Lemon Dressing"],
		ingredients_ar: ["كينوا", "خيار", "طماطم", "أفوكادو", "صلصة ليمون"],
		calories: 420,
		prepTime: 20,
		period: "Lunch",
		available: true,
		image:
			"https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cXVpbm9hJTIwc2FsYWR8ZW58MHx8MHx8fDA%3D",
	},
	{
		featured: false,
		isVegan: false,
		id: "l2",
		name: "Falafel Wrap",
		name_ar: "لفائف الفلافل",
		description: "Falafel with vegetables in a whole wheat wrap",
		description_ar: "فلافل مع الخضروات في خبز القمح الكامل",
		price: 10.99,
		ingredients: ["Falafel", "Lettuce", "Tomato", "Cucumber", "Tahini"],
		ingredients_ar: ["فلافل", "خس", "طماطم", "خيار", "طحينة"],
		calories: 480,
		prepTime: 15,
		period: "Lunch",
		available: true,
		image:
			"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFsYWZlbHxlbnwwfHwwfHx8MA%3D%3D",
	},
	{
		featured: false,
		isVegan: false,
		id: "d1",
		name: "Grilled Salmon",
		name_ar: "سلمون مشوي",
		description: "Fresh salmon with herbs and lemon",
		description_ar: "سلمون طازج مع الأعشاب والليمون",
		price: 18.99,
		ingredients: ["Salmon", "Lemon", "Herbs", "Olive Oil", "Garlic"],
		ingredients_ar: ["سلمون", "ليمون", "أعشاب", "زيت زيتون", "ثوم"],
		calories: 520,
		prepTime: 30,
		period: "Dinner",
		available: true,
		image:
			"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JpbGxlZCUyMHNhbG1vbnxlbnwwfHwwfHx8MA%3D%3D",
	},
	{
		featured: false,
		isVegan: false,
		id: "d2",
		name: "Tofu Stir-fry",
		name_ar: "توفو مقلي",
		description: "Tofu and vegetables in a savory sauce",
		description_ar: "توفو وخضروات في صلصة لذيذة",
		price: 13.99,
		ingredients: ["Tofu", "Broccoli", "Carrots", "Bell Peppers", "Soy Sauce"],
		ingredients_ar: ["توفو", "بروكلي", "جزر", "فلفل حلو", "صلصة الصويا"],
		calories: 380,
		prepTime: 25,
		period: "Dinner",
		available: true,
		image:
			"https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9mdSUyMHN0aXIlMjBmcnl8ZW58MHx8MHx8fDA%3D",
	},
];
```

## File: apps/merchant-app/components/dashboard/DashboardHeader.tsx
```typescript
import React from "react";
import { AnimatedBox, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
interface DashboardHeaderProps {
	currentDateString: string;
	animatedStyle: any;
}
export const DashboardHeader = React.memo(
	({ currentDateString, animatedStyle }: DashboardHeaderProps) => {
		const theme = useTheme();
		return (
			<AnimatedBox
				row
				alignItems="center"
				paddingHorizontal="md"
				paddingVertical="sm"
				style={[
					{
						height: theme.sizes.headerHeight,
					},
					animatedStyle,
				]}
			>
				<Text variant="xl" weight="semibold" numberOfLines={1}>
					{currentDateString}
				</Text>
			</AnimatedBox>
		);
	},
);
```

## File: apps/merchant-app/components/dashboard/StatsGrid.tsx
```typescript
import React from "react";
import { AnimatedBox, Box, Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import {
	FadeInUp,
	FadeOutDown,
	LinearTransition,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
interface StatItem {
	title: string;
	value: string | number;
	icon: string;
}
interface StatsGridProps {
	stats: StatItem[];
}
export const StatsGrid = React.memo(({ stats }: StatsGridProps) => {
	const theme = useTheme();
	return (
		<AnimatedBox
			layout={LinearTransition.delay(100).duration(300)}
			row
			marginHorizontal="sm"
			marginBottom="lg"
			gap="sm"
		>
			{stats.map((stat) => (
				<AnimatedBox
					key={stat.title}
					entering={FadeInUp.duration(300)}
					exiting={FadeOutDown.duration(200)}
					layout={LinearTransition.duration(300)}
					flex={1}
				>
					<Box bg="card" padding="md" rounded="lg" elevation="small">
						<Box row alignCenter marginBottom="sm" gap="sm">
							<Box
								width={theme.sizes.buttonSm}
								height={theme.sizes.buttonSm}
								rounded="sm"
								bg="primaryLight"
								alignItems="center"
								justifyContent="center"
							>
								<Ionicons
									name={stat.icon as any}
									size={theme.sizes.iconSm}
									color={theme.colors.primary}
								/>
							</Box>
							<Text variant="xs" weight="semibold" color="textSecondary">
								{stat.title}
							</Text>
						</Box>
						<Text variant="xl" weight="bold">
							{stat.value}
						</Text>
					</Box>
				</AnimatedBox>
			))}
		</AnimatedBox>
	);
});
```

## File: apps/merchant-app/components/ui/Box.tsx
```typescript
import { useTheme } from "@/hooks/useTheme";
import { ColorToken, RadiusToken, SpacingToken } from "@/hooks/useTheme";
import React, { memo } from "react";
import {
	DimensionValue,
	FlexAlignType,
	Pressable,
	StyleProp,
	View,
	ViewProps,
	ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
type JustifyContentType =
	| "flex-start"
	| "flex-end"
	| "center"
	| "space-between"
	| "space-around"
	| "space-evenly";
interface BoxProps extends ViewProps {
	flex?: number;
	row?: boolean;
	center?: boolean;
	alignCenter?: boolean;
	alignItems?: FlexAlignType;
	justifyCenter?: boolean;
	justifyContent?: JustifyContentType;
	card?: boolean;
	padding?: SpacingToken | number;
	gap?: SpacingToken | number;
	margin?: SpacingToken | number;
	marginTop?: SpacingToken | number;
	marginBottom?: SpacingToken | number;
	marginStart?: SpacingToken | number;
	marginEnd?: SpacingToken | number;
	marginHorizontal?: SpacingToken | number;
	marginVertical?: SpacingToken | number;
	paddingHorizontal?: SpacingToken | number;
	paddingBottom?: SpacingToken | number;
	paddingTop?: SpacingToken | number;
	paddingVertical?: SpacingToken | number;
	paddingStart?: SpacingToken | number;
	paddingEnd?: SpacingToken | number;
	rounded?: RadiusToken | number;
	width?: DimensionValue;
	height?: DimensionValue;
	borderWidth?: number;
	borderColor?: ColorToken;
	bg?: ColorToken | string;
	elevation?: "none" | "small" | "medium" | "large";
	style?: StyleProp<ViewStyle>;
	onPress?: () => void;
	activeOpacity?: number;
}
export const Box: React.FC<BoxProps> = memo(
	({
		children,
		flex,
		row,
		gap,
		center,
		alignCenter,
		paddingTop,
		alignItems,
		paddingBottom,
		justifyCenter,
		justifyContent,
		card,
		padding,
		margin,
		marginTop,
		marginBottom,
		marginStart,
		marginEnd,
		marginHorizontal,
		marginVertical,
		paddingHorizontal,
		paddingVertical,
		paddingStart,
		paddingEnd,
		rounded,
		width,
		height,
		borderWidth,
		borderColor,
		bg,
		elevation,
		style,
		onPress,
		activeOpacity = 0.7,
		...props
	}) => {
		const theme = useTheme();
		let finalAlignItems: FlexAlignType | undefined;
		let finalJustifyContent: JustifyContentType | undefined;
		if (center) {
			finalAlignItems = "center";
			finalJustifyContent = "center";
		} else {
			finalAlignItems = alignCenter ? "center" : alignItems;
			finalJustifyContent = justifyCenter ? "center" : justifyContent;
		}
		const getSpacingValue = (
			value: SpacingToken | number | undefined,
		): number | undefined => {
			if (value === undefined) return undefined;
			return typeof value === "number" ? value : theme.spacing[value];
		};
		const getRadiusValue = (
			value: RadiusToken | number | undefined,
		): number | undefined => {
			if (value === undefined) return undefined;
			return typeof value === "number" ? value : theme.radius[value];
		};
		const getColorValue = (
			color: ColorToken | string | undefined,
		): string | undefined => {
			if (color === undefined) return undefined;
			if (typeof color === "string" && color in theme.colors) {
				return theme.colors[color as ColorToken];
			}
			return color;
		};
		const getElevation = (level?: "none" | "small" | "medium" | "large") => {
			if (!level || level === "none") return {};
			const shadowStyle = theme.shadows[level];
			return { ...shadowStyle, shadowColor: theme.colors.shadow };
		};
		const boxStyle: ViewStyle = {
			flex,
			flexDirection: row ? "row" : "column",
			alignItems: finalAlignItems,
			justifyContent: finalJustifyContent,
			padding: getSpacingValue(padding),
			margin: getSpacingValue(margin),
			marginTop: getSpacingValue(marginTop),
			marginBottom: getSpacingValue(marginBottom),
			marginStart: getSpacingValue(marginStart),
			marginEnd: getSpacingValue(marginEnd),
			marginHorizontal: getSpacingValue(marginHorizontal),
			marginVertical: getSpacingValue(marginVertical),
			paddingHorizontal: getSpacingValue(paddingHorizontal),
			paddingVertical: getSpacingValue(paddingVertical),
			gap: getSpacingValue(gap),
			paddingTop: getSpacingValue(paddingTop),
			paddingBottom: getSpacingValue(paddingBottom),
			paddingStart: getSpacingValue(paddingStart),
			paddingEnd: getSpacingValue(paddingEnd),
			borderRadius: getRadiusValue(rounded),
			width,
			height,
			borderWidth,
			borderColor: getColorValue(borderColor),
			backgroundColor: card ? theme.colors.card : getColorValue(bg),
			...(card ? getElevation("small") : {}),
			...(elevation ? getElevation(elevation) : {}),
		};
		if (onPress) {
			return (
				<Pressable
					onPress={onPress}
					style={({ pressed }) => [
						boxStyle,
						{ opacity: pressed ? activeOpacity : 1 },
						style,
					]}
					{...props}
					android_ripple={{ color: theme.colors.overlay }}
				>
					{children}
				</Pressable>
			);
		}
		return (
			<View style={[boxStyle, style]} {...props}>
				{children}
			</View>
		);
	},
);
export default Box;
export const AnimatedBox = Animated.createAnimatedComponent(Box);
```

## File: pnpm-workspace.yaml
```yaml
packages:
  - apps/*
catalog:
  '@biomejs/biome': 1.9.4
  typescript: ~5.8.3
catalogs:
  react18:
    react: 18.3.1
    react-dom: 18.3.1
    '@types/react': ^18.3.3
    '@types/react-dom': ^18.3.0
  react-native:
    react: 19.0.0
    react-dom: 19.0.0
    react-native: 0.79.0
    '@types/react': ~19.0.10
nodeLinker: hoisted
onlyBuiltDependencies:
  - '@biomejs/biome'
```

## File: apps/merchant-app/components/ui/Tabs.tsx
```typescript
import React from "react";
import { Pressable } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
type TabItem = {
	key: string;
	label: string;
	iconLeft?: string;
	iconRight?: string;
};
export type TabType = string | TabItem;
interface TabsProps {
	tabs: TabType[];
	selectedTab: string;
	onSelectTab: (tab: string) => void;
	labelRender?: (tab: string) => string;
}
export const Tabs = React.memo(
	({ tabs, selectedTab, onSelectTab, labelRender }: TabsProps) => {
		const theme = useTheme();
		const handlePress = (tab: TabType) => {
			const tabKey = typeof tab === "string" ? tab : tab.key;
			if (tabKey !== selectedTab) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				onSelectTab(tabKey);
			}
		};
		const getTabLabel = (tab: TabType): string => {
			if (typeof tab === "string") {
				return labelRender ? labelRender(tab) : tab;
			}
			return tab.label;
		};
		const isTabSelected = (tab: TabType): boolean => {
			const tabKey = typeof tab === "string" ? tab : tab.key;
			return tabKey === selectedTab;
		};
		return (
			<Box row bg={theme.colors.backgroundAlt} rounded="md" padding="xs">
				{tabs.map((tab) => {
					const isSelected = isTabSelected(tab);
					const tabKey = typeof tab === "string" ? tab : tab.key;
					return (
						<Pressable
							key={tabKey}
							style={({ pressed }) => ({
								flex: 1,
								paddingVertical: 8,
								paddingHorizontal: 12,
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "row",
								borderRadius: theme.radius.sm,
								backgroundColor: isSelected ? theme.colors.card : undefined,
								shadowOffset: isSelected ? { width: 0, height: 1 } : undefined,
								shadowOpacity: isSelected ? 0.1 : undefined,
								shadowRadius: isSelected ? 2 : undefined,
								elevation: isSelected ? 2 : undefined,
								shadowColor: isSelected ? theme.colors.shadow : undefined,
								opacity: pressed ? 0.5 : 1,
							})}
							onPress={() => handlePress(tab)}
							android_ripple={{ color: theme.colors.overlay, borderless: true }}
						>
							{typeof tab !== "string" && tab.iconLeft && (
								<Ionicons
									name={tab.iconLeft as any}
									size={theme.sizes.iconSm}
									color={
										isSelected
											? theme.colors.primary
											: theme.colors.textSecondary
									}
									style={{ marginEnd: theme.spacing.xs }}
								/>
							)}
							<Text
								variant="sm"
								weight={isSelected ? "semibold" : "medium"}
								color={isSelected ? "primary" : "textSecondary"}
							>
								{getTabLabel(tab)}
							</Text>
							{typeof tab !== "string" && tab.iconRight && (
								<Ionicons
									name={tab.iconRight as any}
									size={theme.sizes.iconSm}
									color={
										isSelected
											? theme.colors.primary
											: theme.colors.textSecondary
									}
									style={{ marginStart: theme.spacing.xs }}
								/>
							)}
						</Pressable>
					);
				})}
			</Box>
		);
	},
);
```

## File: apps/merchant-app/constants/i18n.ts
```typescript
export const translations = {
	en: {
		common: {
			settings: "Settings",
			dashboard: "Dashboard",
			meals: "Meals",
			cancel: "Cancel",
			save: "Save",
			delete: "Delete",
			edit: "Edit",
			loading: "Loading...",
			total: "Total",
			more: "more",
			back: "Back",
			version: "Version",
		},
		search: {
			title: "Search",
			placeholder: "Search...",
			noResults: "No results found for",
			recentSearches: "Recent Searches",
			clear: "Clear",
		},
		settings: {
			title: "Settings",
			language: "Language",
			theme: "Appearance",
			notifications: "Notifications",
			about: "About",
			logout: "Logout",
			lightMode: "Light",
			darkMode: "Dark",
			systemTheme: "System",
			signedInAs: "Signed in as",
			appInfo: "App Information",
		},
		dashboard: {
			title: "Dashboard",
			todaysPrep: "Today's Prep",
			activeSubscriptions: "Active Subs",
			newThisWeek: "New This Week",
			newThisMonth: "New This Month",
			mealsToday: "Meals Today",
			alerts: "Alerts",
			viewAll: "View all",
			allCaughtUp: "You're all caught up!",
			noAlerts: "No pressing alerts at the moment",
			prepList: "Prep List:",
			today: "Today",
			week: "Week",
			month: "Month",
		},
		meals: {
			title: "Meal Management",
			addNew: "Add New Meal",
			noMeals: "No meals found",
			addFirstMeal: "Add your first meal to get started",
			mealName: "Meal Name",
			description: "Description",
			price: "Price ($)",
			calories: "Calories",
			prepTime: "Prep Time (min)",
			ingredients: "Ingredients (comma separated)",
			mealPeriod: "Meal Period",
			createMeal: "Create Meal",
			saveChanges: "Save Changes",
			confirmDelete: "Are you sure you want to delete this meal?",
			basicInfo: "Basic Information",
			details: "Details",
			available: "Available",
			unavailable: "Unavailable",
			availableDesc: "This meal is visible to customers",
			unavailableDesc: "This meal is hidden from customers",
			featured: "Featured Meal",
			featuredDesc: "Show this meal in featured sections",
			dangerZone: "Danger Zone",
			deleteMealWarning: "Once deleted, this meal cannot be recovered.",
			addImage: "Add Image",
		},
		periods: {
			breakfast: "Breakfast",
			lunch: "Lunch",
			dinner: "Dinner",
		},
		alerts: {
			warning: "Warning",
			info: "Info",
			error: "Error",
		},
	},
	ar: {
		common: {
			settings: "الإعدادات",
			dashboard: "لوحة التحكم",
			meals: "الوجبات",
			cancel: "إلغاء",
			save: "حفظ",
			delete: "حذف",
			edit: "تعديل",
			loading: "جاري التحميل...",
			total: "المجموع",
			more: "المزيد",
			back: "رجوع",
			version: "الإصدار",
		},
		search: {
			title: "بحث",
			placeholder: "بحث...",
			noResults: "لا توجد نتائج لـ",
			recentSearches: "عمليات البحث الأخيرة",
			clear: "مسح",
		},
		settings: {
			title: "الإعدادات",
			language: "اللغة",
			theme: "المظهر",
			notifications: "الإشعارات",
			about: "حول",
			logout: "تسجيل الخروج",
			lightMode: "فاتح",
			darkMode: "داكن",
			systemTheme: "النظام",
			signedInAs: "مسجل الدخول كـ",
			appInfo: "معلومات التطبيق",
		},
		dashboard: {
			title: "لوحة التحكم",
			todaysPrep: "تحضير اليوم",
			activeSubscriptions: "الاشتراكات النشطة",
			newThisWeek: "جديد هذا الأسبوع",
			newThisMonth: "جديد هذا الشهر",
			mealsToday: "وجبات اليوم",
			alerts: "التنبيهات",
			viewAll: "عرض الكل",
			allCaughtUp: "أنت على اطلاع بكل شيء!",
			noAlerts: "لا توجد تنبيهات ملحة في الوقت الحالي",
			prepList: "قائمة التحضير:",
			today: "اليوم",
			week: "الأسبوع",
			month: "الشهر",
		},
		meals: {
			title: "إدارة الوجبات",
			addNew: "إضافة وجبة جديدة",
			noMeals: "لم يتم العثور على وجبات",
			addFirstMeal: "أضف وجبتك الأولى للبدء",
			mealName: "اسم الوجبة",
			description: "الوصف",
			price: "السعر ($)",
			calories: "السعرات الحرارية",
			prepTime: "وقت التحضير (دقيقة)",
			ingredients: "المكونات (مفصولة بفواصل)",
			mealPeriod: "فترة الوجبة",
			createMeal: "إنشاء وجبة",
			saveChanges: "حفظ التغييرات",
			confirmDelete: "هل أنت متأكد من حذف هذه الوجبة؟",
			basicInfo: "المعلومات الأساسية",
			details: "التفاصيل",
			available: "متاح",
			unavailable: "غير متاح",
			availableDesc: "هذه الوجبة مرئية للعملاء",
			unavailableDesc: "هذه الوجبة مخفية عن العملاء",
			featured: "وجبة مميزة",
			featuredDesc: "عرض هذه الوجبة في الأقسام المميزة",
			dangerZone: "منطقة الخطر",
			deleteMealWarning: "بمجرد الحذف، لا يمكن استعادة هذه الوجبة.",
			addImage: "إضافة صورة",
		},
		periods: {
			breakfast: "الإفطار",
			lunch: "الغداء",
			dinner: "العشاء",
		},
		alerts: {
			warning: "تحذير",
			info: "معلومات",
			error: "خطأ",
		},
	},
};
export type Language = keyof typeof translations;
```

## File: .gitignore
```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
next-env.d.ts
#sveltekit
.svelte-kit
# nitro
.nitro/
.output/

# expo
.expo
expo-env.d.ts
ios/
android/
*.gen.ts

# production
build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env
.env*.local

# typescript
*.tsbuildinfo
dist/

# turbo
.turbo




# Output
.cache
.output
.vercel
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
.maestro/tests/
messages.js
```

## File: apps/merchant-app/app/_layout.tsx
```typescript
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "@/hooks/useTranslation";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
	"Sending `onAnimatedValueUpdate` with no listeners registered.",
]);
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	const { isDark, navTheme, colors } = useTheme();
	const { t } = useTranslation();
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	useEffect(() => {
		if (error) throw error;
	}, [error]);
	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);
	if (!loaded) {
		return null;
	}
	return (
		<SafeAreaProvider>
			<ThemeProvider value={navTheme}>
				<Tabs
					screenOptions={{
						headerShown: false,
						tabBarActiveTintColor: colors.primary,
						tabBarInactiveTintColor: colors.textMuted,
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							title: t("common.dashboard"),
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="home-outline" size={size} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="meals"
						options={{
							title: t("common.meals"),
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="restaurant-outline" size={size} color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name="settings"
						options={{
							title: t("common.settings"),
							tabBarIcon: ({ color, size }) => (
								<Ionicons name="settings-outline" size={size} color={color} />
							),
						}}
					/>
				</Tabs>
				<StatusBar style={isDark ? "light" : "dark"} />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
```

## File: apps/merchant-app/app/index.tsx
```typescript
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { TodayPrepCard } from "@/components/dashboard/PrepCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { AnimatedBox, Box } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { Text } from "@/components/ui/Text";
import { ALERTS, TODAY_PREP_SUMMARY } from "@/data";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback, useMemo } from "react";
import { FlatList, ScrollView, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const PREP_CARD_WIDTH = 170;
const HomeScreen = React.memo(() => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t, language } = useTranslation();
	const [selectedTab, setSelectedTab] = useState("Today");
	const tabItems = useMemo(() => {
		return ["Today", "Week", "Month"];
	}, [t]);
	const currentStats = useMemo(() => {
		switch (selectedTab) {
			case "Week":
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+3",
						icon: "add-circle-outline",
					},
				];
			case "Month":
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+12",
						icon: "add-circle-outline",
					},
				];
			default:
				return [
					{
						title: t("dashboard.newThisWeek"),
						value: 52,
						icon: "people-outline",
					},
					{
						title: t("dashboard.newThisMonth"),
						value: "+12",
						icon: "add-circle-outline",
					},
				];
		}
	}, [selectedTab, t]);
	const currentDateString = useMemo(
		() =>
			new Date().toLocaleDateString(language, {
				weekday: "long",
				month: "short",
				day: "numeric",
			}),
		[language],
	);
	const handleSelectTab = useCallback(
		(tab: string) => {
			if (tab !== selectedTab) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				setSelectedTab(tab);
			}
		},
		[selectedTab],
	);
	const handleViewSchedule = useCallback((period?: string) => {
		console.log("Navigate to Schedule Screen, Filter:", period || "Full");
	}, []);
	const handleViewAlert = useCallback((id: string | number) => {
		console.log("Navigate to Alert Details Screen, ID:", id);
	}, []);
	const handleViewAllAlerts = useCallback(() => {
		console.log("Navigate to All Alerts Screen");
	}, []);
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<ScrollView
				contentContainerStyle={{
					paddingBottom: theme.spacing.md,
				}}
				showsVerticalScrollIndicator={false}
			>
				<Box
					row
					alignItems="center"
					paddingHorizontal="md"
					paddingVertical="sm"
					style={{
						height: theme.sizes.headerHeight,
					}}
				>
					<Text variant="xl" weight="semibold" numberOfLines={1}>
						{currentDateString}
					</Text>
				</Box>
				<AnimatedBox
					marginHorizontal="md"
					gap="lg"
					entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
				>
					<Tabs
						tabs={tabItems}
						selectedTab={selectedTab}
						onSelectTab={handleSelectTab}
						labelRender={(tab) => t(`dashboard.${tab.toLowerCase()}`)}
					/>
					<StatsGrid stats={currentStats} key={selectedTab} />
				</AnimatedBox>
				<Animated.Text
					entering={FadeInUp.duration(400)}
					style={{
						fontSize: theme.typography.sizes.lg,
						fontWeight: theme.typography.weights.semibold,
						color: theme.colors.text,
						marginHorizontal: theme.spacing.md,
						marginBottom: theme.spacing.sm,
						alignSelf: "flex-start",
					}}
				>
					{t("dashboard.todaysPrep")}
				</Animated.Text>
				<Animated.View entering={FadeInUp.delay(300).duration(400).damping(15)}>
					<FlatList
						horizontal
						data={TODAY_PREP_SUMMARY}
						keyExtractor={(item) => item.period}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: theme.spacing.md,
							paddingVertical: theme.spacing.sm,
							gap: theme.spacing.sm,
						}}
						snapToInterval={PREP_CARD_WIDTH + theme.spacing.sm}
						decelerationRate="fast"
						renderItem={({ item }) => (
							<TodayPrepCard
								summary={item}
								onPress={() => handleViewSchedule(item.period)}
							/>
						)}
					/>
				</Animated.View>
				<AlertsCard
					alerts={ALERTS}
					onViewAlert={handleViewAlert}
					onViewAllAlerts={handleViewAllAlerts}
				/>
			</ScrollView>
		</View>
	);
});
export default HomeScreen;
```

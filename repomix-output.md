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
      _layout.tsx
      +not-found.tsx
      index.tsx
      settings.tsx
    components/
      dashboard/
        AlertRow.tsx
        AlertsCard.tsx
        DashboardHeader.tsx
        PrepCard.tsx
        StatsGrid.tsx
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
    data.ts
    types.ts
.gitignore
.npmrc
.nvimrc
pnpm-workspace.yaml
```

# Files

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
```

## File: .npmrc
```
node-linker=hoisted
engine-strict=true
```

## File: apps/merchant-app/components/dashboard/PrepCard.tsx
```typescript
import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text, Badge } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { MealPrepSummary } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
interface TodayPrepCardProps {
	summary: MealPrepSummary;
	theme: AppTheme;
	onPress: () => void;
}
const MAX_MEALS_TO_SHOW = 3;
const PREP_CARD_WIDTH = 180;
export const TodayPrepCard: React.FC<TodayPrepCardProps> = React.memo(
	({ summary, theme, onPress }) => {
		const { t } = useTranslation();
		const periodIcons = {
			Breakfast: "cafe-outline",
			Lunch: "restaurant-outline",
			Dinner: "fast-food-outline",
		};
		const periodColors: Record<
			"Breakfast" | "Lunch" | "Dinner",
			"info" | "primary" | "error"
		> = { Breakfast: "info", Lunch: "primary", Dinner: "error" };
		const translatedPeriod = t(`periods.${summary.period.toLowerCase()}`);
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					localStyles.prepCardContainer,
					{ borderRadius: theme.radius.lg },
					pressed && { opacity: 0.8 },
				]}
				android_ripple={{ color: theme.colors.overlay }}
			>
				<Box
					style={[
						localStyles.prepCard,
						{
							backgroundColor: theme.colors.card,
							borderRadius: theme.radius.lg,
							shadowColor: theme.colors.shadow,
						},
					]}
					elevation="small"
				>
					<Box
						row
						alignCenter
						marginBottom="sm"
						style={{ flexDirection: "row" }}
					>
						<Ionicons
							name={periodIcons[summary.period] as any}
							size={theme.sizes.iconSm}
							color={theme.colors[periodColors[summary.period]]}
							style={{
								marginEnd: theme.spacing.sm,
							}}
						/>
						<Text variant="md" weight="semibold">
							{translatedPeriod}
						</Text>
					</Box>
					<Text
						variant="sm"
						weight="medium"
						color="textSecondary"
						marginBottom="xs"
						style={{ alignSelf: "flex-start" }}
					>
						{t("dashboard.prepList")}
					</Text>
					<Box style={localStyles.prepListContainer}>
						{summary.mealsToPrep.slice(0, MAX_MEALS_TO_SHOW).map((meal) => (
							<Box
								key={meal.id}
								row
								justifyContent="space-between"
								paddingVertical={theme.spacing.xs / 1.5}
								style={{ flexDirection: "row" }}
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
						style={{ flexDirection: "row" }}
					>
						<Badge
							text={`${summary.totalMeals} ${t("common.total")}`}
							variant={periodColors[summary.period]}
							size="sm"
						/>
					</Box>
				</Box>
			</Pressable>
		);
	},
);
const localStyles = StyleSheet.create({
	prepCardContainer: { width: PREP_CARD_WIDTH },
	prepCard: { padding: 16, minHeight: 170, justifyContent: "space-between" },
	prepListContainer: { marginTop: 4, flexGrow: 1 },
});
```

## File: apps/merchant-app/components/layout/ScreenContainer.tsx
```typescript
import { useTheme } from "@/hooks/useTheme";
import { Screen } from "expo-router/build/views/Screen";
import React from "react";
import {
	RefreshControlProps,
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
} from "react-native";
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
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
	children,
	scrollable = true,
	screenOptions = { headerShown: false },
	header,
	padded = true,
	refreshControl,
	contentContainerStyle,
	bottomInset = true,
}) => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		content: {
			flex: 1,
			paddingHorizontal: padded ? theme.spacing.screenPadding : 0,
		},
		scrollContent: {
			flexGrow: 1,
			paddingBottom: bottomInset
				? insets.bottom || theme.spacing.xl
				: theme.spacing.xl,
		},
	});
	const Container = header ? View : SafeAreaView;
	return (
		<>
			<Screen options={screenOptions} />
			<StatusBar
				barStyle={theme.isDark ? "light-content" : "dark-content"}
				backgroundColor={theme.colors.background}
			/>
			<Container style={styles.container}>
				{header}
				{scrollable ? (
					<ScrollView
						style={styles.content}
						contentContainerStyle={[
							styles.scrollContent,
							contentContainerStyle,
						]}
						showsVerticalScrollIndicator={false}
						refreshControl={refreshControl}
						keyboardShouldPersistTaps="handled"
					>
						{children}
					</ScrollView>
				) : (
					<View style={styles.content}>{children}</View>
				)}
			</Container>
		</>
	);
};
```

## File: apps/merchant-app/components/ui/Avatar.tsx
```typescript
import { ThemeTokens, useTheme } from "@/hooks/useTheme";
import React from "react";
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	View,
	ViewProps,
} from "react-native";
import { Text } from "./Text";
interface AvatarProps extends ViewProps {
	size?: "sm" | "md" | "lg" | number;
	source?: ImageSourcePropType;
	text?: string;
	color?: ThemeTokens["colors"];
	backgroundColor?: ThemeTokens["colors"];
}
export const Avatar: React.FC<AvatarProps> = ({
	size = "md",
	source,
	text,
	color,
	backgroundColor,
	style,
	...props
}) => {
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
	const getFontSize = () => {
		if (typeof size === "number") return size / 2;
		switch (size) {
			case "sm":
				return theme.typography.sizes.sm;
			case "md":
				return theme.typography.sizes.lg;
			case "lg":
				return theme.typography.sizes.xl;
			default:
				return theme.typography.sizes.lg;
		}
	};
	const avatarSize = getSize();
	const bgColor = backgroundColor
		? theme.colors[backgroundColor]
		: theme.colors.primaryLight;
	const textColor = color ? theme.colors[color] : theme.colors.primary;
	const styles = StyleSheet.create({
		container: {
			width: avatarSize,
			height: avatarSize,
			borderRadius: avatarSize / 2,
			backgroundColor: bgColor,
			alignItems: "center",
			justifyContent: "center",
			overflow: "hidden",
		},
		image: {
			width: avatarSize,
			height: avatarSize,
		},
		textStyle: {
			fontSize: getFontSize(),
			lineHeight: getFontSize() * 1.2,
		},
	});
	return (
		<View style={[styles.container, style]} {...props}>
			{source ? (
				<Image source={source} style={styles.image} resizeMode="cover" />
			) : (
				<Text weight="bold" color={textColor} style={styles.textStyle}>
					{text ? text.charAt(0).toUpperCase() : "?"}
				</Text>
			)}
		</View>
	);
};
```

## File: apps/merchant-app/components/ui/Button.tsx
```typescript
import React from "react";
import {
	TouchableOpacity,
	TouchableOpacityProps,
	StyleSheet,
	StyleProp,
	ViewStyle,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
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
	style?: StyleProp<ViewStyle>;
	textColor?: string;
}
export const Button: React.FC<ButtonProps> = ({
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
}) => {
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
	const styles = StyleSheet.create({
		button: {
			height: sizeStyle.height,
			paddingHorizontal: sizeStyle.paddingHorizontal,
			borderRadius: rounded ? theme.radius.round : theme.radius.button,
			backgroundColor: variantStyle.backgroundColor,
			borderWidth: variantStyle.borderWidth || 0,
			borderColor: variantStyle.borderColor,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			width: fullWidth ? "100%" : undefined,
		},
		icon: {
			marginRight: leftIcon && title ? theme.spacing.xs : 0,
			marginLeft: rightIcon && title ? theme.spacing.xs : 0,
		},
	});
	return (
		<TouchableOpacity
			style={[styles.button, style]}
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
							style={styles.icon}
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
							style={styles.icon}
						/>
					)}
				</>
			)}
		</TouchableOpacity>
	);
};
```

## File: apps/merchant-app/components/ui/Card.tsx
```typescript
import React from "react";
import {
	TouchableOpacity,
	StyleSheet,
	TouchableOpacityProps,
	StyleProp,
	ViewStyle,
	View,
} from "react-native";
import { RadiusToken, SpacingToken, useTheme } from "@/hooks/useTheme";
interface CardProps extends TouchableOpacityProps {
	elevation?: "none" | "small" | "medium" | "large";
	padding?: SpacingToken | number;
	rounded?: RadiusToken;
	style?: StyleProp<ViewStyle>;
	children?: React.ReactNode;
}
export const Card: React.FC<CardProps> = ({
	children,
	elevation = "small",
	padding = "md",
	rounded = "card",
	style,
	onPress,
	...props
}) => {
	const theme = useTheme();
	const getElevation = () => {
		if (elevation === "none") return {};
		const shadowStyle = theme.shadows[elevation];
		return { ...shadowStyle, shadowColor: theme.colors.shadow };
	};
	const getPaddingValue = () => {
		return typeof padding === "number" ? padding : theme.spacing[padding];
	};
	const getRadiusValue = () => {
		return theme.radius[rounded];
	};
	const styles = StyleSheet.create({
		card: {
			backgroundColor: theme.colors.card,
			borderRadius: getRadiusValue(),
			padding: getPaddingValue(),
			...getElevation(),
		},
	});
	const ContainerComponent = onPress ? TouchableOpacity : View;
	return (
		<ContainerComponent
			activeOpacity={onPress ? 0.7 : 1}
			style={[styles.card, style]}
			onPress={onPress}
			{...props}
		>
			{children}
		</ContainerComponent>
	);
};
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

## File: apps/merchant-app/data.ts
```typescript
import { Alert, MealPrepSummary } from "./types";
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
```

## File: apps/merchant-app/app/+not-found.tsx
```typescript
import React from "react";
import { StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
import { Text, Button } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
export default function NotFoundScreen() {
	const theme = useTheme();
	const handleGoHome = () => {
		router.replace("/");
	};
	return (
		<ScreenContainer scrollable={false} padded={false}>
			<Stack.Screen options={{ title: "Not Found", headerShown: false }} />
			<Animated.View
				style={[styles.container, { backgroundColor: theme.colors.background }]}
				entering={FadeIn.duration(300)}
				exiting={FadeOut.duration(200)}
			>
				<Ionicons
					name="alert-circle-outline"
					size={theme.sizes.iconLg * 2.5}
					color={theme.colors.textMuted}
					style={styles.icon}
				/>
				<Text variant="xxl" weight="bold" center marginBottom="sm">
					Oops! Page Not Found
				</Text>
				<Text variant="md" color="textSecondary" center marginBottom="xl">
					We can't seem to find the page you're looking for. It might have been
					moved or doesn't exist.
				</Text>
				<Button
					title="Go to Dashboard"
					onPress={handleGoHome}
					leftIcon="home-outline"
					size="lg"
				/>
			</Animated.View>
		</ScreenContainer>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	icon: {
		marginBottom: 24,
	},
});
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
import { router, Stack } from "expo-router";
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
export default function SettingsScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t, isRTL } = useTranslation();
	const restaurantName = "The Gourmet Spot";
	const handleBack = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.back();
	};
	const handleThemeChange = useCallback((newTheme: "light" | "dark") => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		Appearance.setColorScheme(newTheme);
		console.log("Theme changed to:", newTheme);
	}, []);
	const ThemeOption = ({
		option,
	}: { option: { key: "light" | "dark"; icon: string; label: string } }) => {
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
						alignItems: "center" as const,
						justifyContent: "center" as const,
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
	};
	const themeOptions = [
		{ key: "light", icon: "sunny-outline", label: t("settings.lightMode") },
		{ key: "dark", icon: "moon-outline", label: t("settings.darkMode") },
	] as const;
	const SettingsSection = ({
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
				<Box width={theme.sizes.touchTarget * 1.5} alignItems="flex-start">
					<TouchableOpacity
						onPress={handleBack}
						style={{
							width: theme.sizes.buttonMd,
							height: theme.sizes.buttonMd,
							borderRadius: theme.radius.md,
							backgroundColor: theme.colors.backgroundAlt,
							alignItems: "center",
							justifyContent: "center",
						}}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					>
						<Ionicons
							name={isRTL ? "chevron-forward" : "chevron-back"}
							size={theme.sizes.iconMd}
							color={theme.colors.text}
						/>
					</TouchableOpacity>
				</Box>
				<Text
					variant="xl"
					weight="semibold"
					style={{ flex: 1, textAlign: "center" }}
					numberOfLines={1}
				>
					{t("common.settings")}
				</Text>
				<Box width={theme.sizes.touchTarget * 1.5} />
			</Box>
			<ScrollView
				contentContainerStyle={{
					padding: theme.spacing.md,
					paddingTop: theme.spacing.sm,
					paddingBottom: theme.spacing.xl,
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
}
```

## File: apps/merchant-app/components/dashboard/AlertsCard.tsx
```typescript
import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Animated, {
	FadeInUp,
	FadeOutDown,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBox, Box, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Alert } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
interface AlertsCardProps {
	alerts: Alert[];
	theme: AppTheme;
	onViewAlert: (id: string | number) => void;
	onViewAllAlerts?: () => void;
}
export const AlertsCard: React.FC<AlertsCardProps> = React.memo(
	({ alerts, theme, onViewAlert, onViewAllAlerts }) => {
		const { t } = useTranslation();
		const hasAlerts = alerts.length > 0;
		return (
			<AnimatedBox
				entering={FadeInUp.delay(350).duration(400).springify().damping(15)}
				exiting={FadeOutDown.duration(200)}
				bg="card"
				rounded="lg"
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
								style={({ pressed }) => [
									{
										paddingVertical: theme.spacing.xs,
										paddingHorizontal: theme.spacing.sm,
										borderRadius: theme.radius.sm,
										backgroundColor: pressed
											? theme.colors.primaryLight
											: undefined,
										transform: [{ scale: pressed ? 0.96 : 1 }],
									},
								]}
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
								theme={theme}
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
	theme: AppTheme;
	onPress: () => void;
	isLast?: boolean;
}
const AlertItem: React.FC<AlertItemProps> = React.memo(
	({ alert, theme, onPress, isLast = false }) => {
		const iconColor = theme.colors[alert.type];
		const { isRTL } = useTranslation();
		const pressed = useSharedValue(0);
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
							duration: pressed.value === 1 ? 100 : 200,
						}),
					},
				],
				backgroundColor:
					pressed.value === 1 ? theme.colors.backgroundAlt : "transparent",
			};
		});
		return (
			<Animated.View
				style={[
					{
						borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
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
						marginStart={"sm"}
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
						marginStart={"sm"}
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

## File: apps/merchant-app/components/ui/Badge.tsx
```typescript
import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Text } from "./Text";
export interface BadgeProps extends ViewProps {
	text: string | number;
	variant?: "primary" | "success" | "warning" | "info" | "error" | "default";
	size?: "sm" | "md";
}
export const Badge: React.FC<BadgeProps> = ({
	text,
	variant = "default",
	size = "md",
	style,
	...props
}) => {
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
				return { textColor: theme.colors.text, bgColor: theme.colors.warning };
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
	const styles = StyleSheet.create({
		badge: {
			backgroundColor: badgeStyle.bgColor,
			paddingHorizontal: sizeStyle.paddingHorizontal,
			paddingVertical: sizeStyle.paddingVertical,
			borderRadius: theme.radius.badge,
			alignItems: "center",
			justifyContent: "center",
			alignSelf: "flex-start",
		},
	});
	return (
		<View style={[styles.badge, style]} {...props}>
			<Text
				variant={sizeStyle.fontSize}
				weight="medium"
				color={badgeStyle.textColor}
			>
				{text}
			</Text>
		</View>
	);
};
```

## File: apps/merchant-app/components/ui/Tabs.tsx
```typescript
import React from "react";
import { Pressable } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Box } from "./Box";
import { Text } from "./Text";
import { AppTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
interface TabsProps {
	tabs: string[];
	selectedTab: string;
	onSelectTab: (tab: string) => void;
	theme: AppTheme;
	labelRender: (tab: string) => string;
}
const AnimatedBox = Animated.createAnimatedComponent(Box);
export const Tabs: React.FC<TabsProps> = React.memo(
	({ tabs, selectedTab, onSelectTab, theme, labelRender }) => {
		const handlePress = (tab: string) => {
			if (tab !== selectedTab) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				onSelectTab(tab);
			}
		};
		return (
			<AnimatedBox
				entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
				style={{
					flexDirection: "row",
				}}
				bg="backgroundAlt"
				rounded="md"
				padding="xs"
				row
			>
				{tabs.map((tab) => (
					<Pressable
						key={tab}
						style={({ pressed }) => [
							{
								flex: 1,
								paddingVertical: 8,
								paddingHorizontal: 12,
								alignItems: "center",
								justifyContent: "center",
							},
							{ borderRadius: theme.radius.sm },
							tab === selectedTab && [
								{
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.1,
									shadowRadius: 2,
									elevation: 2,
								},
								{
									backgroundColor: theme.colors.card,
									shadowColor: theme.colors.shadow,
								},
							],
							pressed && { opacity: 0.5 },
						]}
						onPress={() => handlePress(tab)}
						android_ripple={{ color: theme.colors.overlay, borderless: true }}
					>
						<Text
							variant="sm"
							weight={tab === selectedTab ? "semibold" : "medium"}
							color={tab === selectedTab ? "primary" : "textSecondary"}
						>
							{labelRender(tab)}
						</Text>
					</Pressable>
				))}
			</AnimatedBox>
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
import React, { memo, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
export const LanguageSelector: React.FC = memo(() => {
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
							style={{ marginRight: theme.spacing.xs }}
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
							style={{ marginRight: theme.spacing.xs }}
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

## File: .nvimrc
```
23.11.0
```

## File: apps/merchant-app/components/dashboard/AlertRow.tsx
```typescript
import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Box, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Alert } from "@/types";
interface AlertRowProps {
	alert: Alert;
	theme: AppTheme;
	onPress: () => void;
}
export const AlertRow: React.FC<AlertRowProps> = React.memo(
	({ alert, theme, onPress }) => {
		const iconColor = theme.colors[alert.type];
		return (
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [
					{
						paddingHorizontal: theme.spacing.sm,
						flexDirection: "row",
						alignItems: "center",
						paddingVertical: theme.spacing.md,
						borderRadius: theme.radius.sm,
					},
					pressed && {
						backgroundColor: theme.colors.backgroundAlt,
					},
				]}
				android_ripple={{ color: theme.colors.overlay }}
			>
				<Ionicons
					name={alert.icon as any}
					size={theme.sizes.iconSm}
					color={iconColor}
					style={{
						marginStart: theme.spacing.md,
					}}
				/>
				<Box flex={1}>
					<Text variant="sm" numberOfLines={1}>
						{alert.title}
					</Text>
					{alert.timestamp && (
						<Text
							variant="xs"
							color="textMuted"
							marginTop={theme.spacing.xs / 2}
						>
							{alert.timestamp}
						</Text>
					)}
				</Box>
				<Ionicons
					name={"chevron-back"}
					size={theme.sizes.iconSm}
					color={theme.colors.textMuted}
				/>
			</Pressable>
		);
	},
);
```

## File: apps/merchant-app/components/dashboard/DashboardHeader.tsx
```typescript
import { Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { EdgeInsets } from "react-native-safe-area-context";
import { useTranslation } from "@/hooks/useTranslation";
interface DashboardHeaderProps {
	theme: AppTheme;
	insets: EdgeInsets;
	animatedStyle: any;
	currentDateString: string;
	onSettingsPress: () => void;
	headerHeight: number;
}
export const DashboardHeader: React.FC<DashboardHeaderProps> = memo(
	({
		theme,
		insets,
		animatedStyle,
		currentDateString,
		onSettingsPress,
		headerHeight,
	}) => {
		const { t } = useTranslation();
		return (
			<Animated.View
				style={[
					{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						zIndex: 100,
					},
					{
						backgroundColor: theme.colors.background,
						paddingTop: insets.top,
						height: headerHeight + insets.top,
						paddingHorizontal: theme.spacing.md,
						paddingBottom: theme.spacing.sm,
					},
					animatedStyle,
				]}
			>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<View>
						<Text
							variant="xs"
							color="textSecondary"
							weight="medium"
							style={{
								textTransform: "uppercase",
								letterSpacing: 0.5,
								alignSelf: "flex-start",
							}}
						>
							{t("dashboard.title")}
						</Text>
						<Text variant="xl" weight="semibold">
							{currentDateString}
						</Text>
					</View>
					<Pressable
						onPress={onSettingsPress}
						style={({ pressed }) => [
							{
								padding: 8,
								borderRadius: 20,
							},
							pressed && { backgroundColor: theme.colors.overlay },
						]}
						android_ripple={{ color: theme.colors.overlay, borderless: true }}
						accessible={true}
						accessibilityLabel={t("common.settings")}
						accessibilityRole="button"
					>
						<Ionicons
							name="settings-outline"
							size={theme.sizes.iconMd}
							color={theme.colors.textSecondary}
						/>
					</Pressable>
				</View>
			</Animated.View>
		);
	},
);
```

## File: apps/merchant-app/components/dashboard/StatsGrid.tsx
```typescript
import { AnimatedBox, Box, Text } from "@/components/ui";
import { AppTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	FadeInUp,
	FadeOutDown,
	LinearTransition,
} from "react-native-reanimated";
interface StatItem {
	title: string;
	value: string | number;
	icon: string;
}
interface StatsGridProps {
	stats: StatItem[];
	theme: AppTheme;
}
export const StatsGrid: React.FC<StatsGridProps> = React.memo(
	({ stats, theme }) => {
		return (
			<AnimatedBox
				layout={LinearTransition.delay(100).duration(300)}
				row
				marginHorizontal="md"
				marginBottom="lg"
				gap={"sm"}
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
							<Box row alignCenter marginBottom="sm" gap={"sm"}>
								<Box
									width={theme.sizes.buttonSm}
									height={theme.sizes.buttonSm}
									alignItems="center"
									justifyContent="center"
									rounded={"sm"}
									bg="primaryLight"
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

## File: apps/merchant-app/constants/i18n.ts
```typescript
export const translations = {
	en: {
		common: {
			settings: "Settings",
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

## File: apps/merchant-app/app/_layout.tsx
```typescript
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
	"Sending `onAnimatedValueUpdate` with no listeners registered.",
]);
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
	const { isDark, navTheme, colors } = useTheme();
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
				<Stack
					screenOptions={{
						headerShown: false,
						animation: "slide_from_right",
						contentStyle: {
							backgroundColor: colors.background,
						},
					}}
				>
					<Stack.Screen name="index" />
					<Stack.Screen name="settings" />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style={isDark ? "light" : "dark"} />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
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

## File: apps/merchant-app/app/index.tsx
```typescript
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodayPrepCard } from "@/components/dashboard/PrepCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { Box, Text } from "@/components/ui";
import { Tabs } from "@/components/ui/Tabs";
import { ALERTS, TODAY_PREP_SUMMARY } from "@/data";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState, useCallback, useRef, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	FadeInUp,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const HEADER_HEIGHT = 65;
const PREP_CARD_WIDTH = 170;
const HomeScreen: React.FC = () => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { t, language } = useTranslation();
	const [refreshing, setRefreshing] = useState(false);
	const [selectedTab, setSelectedTab] = useState("Today");
	const scrollY = useSharedValue(0);
	const scrollRef = useRef<Animated.FlatList<any>>(null);
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
	}, [selectedTab]);
	const currentDateString = useMemo(
		() =>
			new Date().toLocaleDateString(language, {
				weekday: "long",
				month: "short",
				day: "numeric",
			}),
		[],
	);
	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setTimeout(() => setRefreshing(false), 1200);
	}, []);
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
	const handleSettingsPress = useCallback(() => {
		router.push("/settings");
	}, []);
	const scrollHandler = useAnimatedScrollHandler((event) => {
		const offsetY = event.contentOffset.y;
		scrollY.value = withTiming(offsetY, { duration: 150 });
	});
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: theme.colors.background,
			shadowColor: theme.colors.shadow,
			shadowRadius: 3,
			shadowOpacity: scrollY.value > 2 ? (theme.isDark ? 0.3 : 0.1) : 0,
			borderBottomWidth: scrollY.value > 2 ? StyleSheet.hairlineWidth : 0,
			borderBottomColor: theme.colors.divider,
			elevation: scrollY.value > 2 ? 3 : 0,
			zIndex: 1000,
		};
	});
	const renderHeader = useCallback(
		() => (
			<>
				<Box marginHorizontal="md" marginBottom="lg">
					<Tabs
						tabs={tabItems}
						selectedTab={selectedTab}
						onSelectTab={handleSelectTab}
						theme={theme}
						labelRender={(tab) => t(`dashboard.${tab.toLowerCase()}`)}
					/>
				</Box>
				<StatsGrid stats={currentStats} theme={theme} key={selectedTab} />
				<Text
					variant="lg"
					weight="semibold"
					marginHorizontal="md"
					marginBottom="sm"
				>
					{t("dashboard.todaysPrep")}
				</Text>
				<Animated.View
					entering={FadeInUp.delay(300).duration(400).springify().damping(15)}
				>
					<FlatList
						horizontal
						data={TODAY_PREP_SUMMARY}
						keyExtractor={(item) => item.period}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={[
							{
								paddingHorizontal: theme.spacing.md,
								paddingVertical: theme.spacing.sm,
								gap: theme.spacing.sm,
							},
						]}
						snapToInterval={PREP_CARD_WIDTH + theme.spacing.sm}
						decelerationRate="fast"
						renderItem={({ item }) => (
							<TodayPrepCard
								summary={item}
								theme={theme}
								onPress={() => handleViewSchedule(item.period)}
							/>
						)}
					/>
				</Animated.View>
				<AlertsCard
					alerts={ALERTS}
					theme={theme}
					onViewAlert={handleViewAlert}
					onViewAllAlerts={handleViewAllAlerts}
				/>
			</>
		),
		[
			selectedTab,
			currentStats,
			theme,
			handleSelectTab,
			handleViewSchedule,
			handleViewAlert,
			handleViewAllAlerts,
			t,
			tabItems,
		],
	);
	return (
		<View style={[{ flex: 1, backgroundColor: theme.colors.background }]}>
			<DashboardHeader
				theme={theme}
				insets={insets}
				animatedStyle={headerAnimatedStyle}
				currentDateString={currentDateString}
				onSettingsPress={handleSettingsPress}
				headerHeight={HEADER_HEIGHT}
			/>
			<Animated.FlatList
				ref={scrollRef}
				data={[1]}
				keyExtractor={() => "main"}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingTop: HEADER_HEIGHT + insets.top + theme.spacing.md,
					paddingBottom: insets.bottom + theme.spacing.xxl,
				}}
				getItemLayout={(_, index) => ({
					length: PREP_CARD_WIDTH + theme.spacing.sm,
					offset: (PREP_CARD_WIDTH + theme.spacing.sm) * index,
					index,
				})}
				renderItem={() => renderHeader()}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor={theme.colors.primary}
						colors={[theme.colors.primary]}
						progressBackgroundColor={theme.colors.card}
						progressViewOffset={HEADER_HEIGHT + insets.top + theme.spacing.sm}
					/>
				}
			/>
		</View>
	);
};
export default HomeScreen;
```

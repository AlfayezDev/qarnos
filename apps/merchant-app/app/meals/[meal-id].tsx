import { AnimatedBox, Badge, Box, Button, Text } from "@/components/ui";
import FocusableInput from "@/components/fields/FocusableInput";
import SwitchField from "@/components/fields/SwitchField";
import CategoryField from "@/components/fields/CategoryField";
import RadioField from "@/components/fields/RadioField";
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

const MealFormScreen = () => {
	const { "meal-id": mealId } = useLocalSearchParams<{ "meal-id": string }>();
	const theme = useTheme();
	const { t, language, isRTL } = useTranslation();
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
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const isArabic = language === "ar";
	const isEdit = mealId !== "new";
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
					{}
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
					{}
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
							theme={theme}
						/>
					</AnimatedBox>
					{}
					{activeSection === "basic" && (
						<Animated.View
							entering={FadeInRight.delay(100).duration(100)}
							key={activeSection}
							style={{ gap: theme.spacing.md }}
						>
							{}
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
								{}
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
								{}
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
								{}
								<Box marginBottom="md">
									<CategoryField
										label={t("meals.mealPeriod")}
										options={periodOptions}
										value={meal.period || "Breakfast"}
										onChange={(value) => updateField("period", value)}
										error={errors.period}
									/>
								</Box>

								{/* Added Radio Field as dietary restrictions example */}
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
							{}
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
								{}
								<Box row gap="md" marginBottom="md">
									{}
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
									{}
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
								{}
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
								{}
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
								{}
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
					{}
					{activeSection === "settings" && (
						<Animated.View
							entering={FadeInRight.delay(100).duration(100)}
							key={activeSection}
						>
							{}
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

								{/* Using SwitchField instead of the custom implementation */}
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

								{/* Example of additional switch options */}
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
							{}
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
					{}
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
};

export default MealFormScreen;

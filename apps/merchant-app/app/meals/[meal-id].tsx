import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInRight, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBox, Box, Button, Text } from "@/components/ui";
import { TabType, Tabs } from "@/components/ui/Tabs";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { MealFormHeader } from "@/components/meal/MealFormHeader";
import { MealImagePreview } from "@/components/meal/MealImagePreview";
import {
	Form,
	FormCategory,
	FormInput,
	FormRadio,
	FormSwitch,
} from "@/components/compound/form";
import { mealSchema } from "@/schemas/mealSchema";
import {
	caloriesSchema,
	descriptionSchema,
	nameSchema,
	priceSchema,
} from "@/utils/validation";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

import { useMealForm } from "@/hooks/useMealForm";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/stores/translationStore";

const MealFormScreen = () => {
	const { "meal-id": mealId } = useLocalSearchParams<{ "meal-id": string }>();
	const theme = useTheme();
	const { t, language } = useTranslation();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { isTablet, isLandscape } = useResponsiveLayout();
	const isArabic = language === "ar";
	const useTwoColumnLayout = isTablet && isLandscape;
	const [activeSection, setActiveSection] = useState<string>("basic");

	const {
		meal,
		loading,
		isEdit,
		handleFormSubmit,
		handleDelete,
		handleSelectImage,
	} = useMealForm(mealId);

	const periodOptions = [
		{ value: "Breakfast", label: t("periods.breakfast"), icon: "cafe-outline" },
		{ value: "Lunch", label: t("periods.lunch"), icon: "restaurant-outline" },
		{ value: "Dinner", label: t("periods.dinner"), icon: "fast-food-outline" },
	];

	const dietaryOptions = [
		{ value: "none", label: "Regular", description: "No dietary restrictions" },
		{
			value: "vegetarian",
			label: "Vegetarian",
			description: "No meat, may include dairy and eggs",
		},
		{ value: "vegan", label: "Vegan", description: "No animal products" },
		{
			value: "glutenFree",
			label: "Gluten Free",
			description: "No wheat or gluten",
		},
	];

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

	return (
		<ErrorBoundary>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: theme.colors.background,
						paddingTop: insets.top,
					}}
				>
					<Stack.Screen options={{ headerShown: false }} />
					<MealFormHeader
						title={t("meals.addNew")}
						isEdit={isEdit}
						mealName={meal?.name}
						mealNameAr={meal?.name_ar}
						onDelete={handleDelete}
					/>

					<ScrollView
						style={{ flex: 1 }}
						contentContainerStyle={{
							padding: theme.spacing.md,
							paddingBottom: insets.bottom + theme.spacing.xxl,
							gap: theme.spacing.md,
						}}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						<MealImagePreview
							image={meal?.image}
							name={meal?.name}
							nameAr={meal?.name_ar}
							calories={meal?.calories}
							prepTime={meal?.prepTime}
							onSelectImage={handleSelectImage}
						/>

						<AnimatedBox
							entering={FadeInUp.delay(200).duration(400)}
							bg="backgroundAlt"
							rounded="lg"
						>
							<Tabs
								tabs={sectionTabs}
								selectedTab={activeSection}
								onSelectTab={setActiveSection}
								accessibilityLabel="Section Tabs"
							/>
						</AnimatedBox>

						<Form
							schema={mealSchema}
							initialValues={meal}
							onSubmit={handleFormSubmit}
						>
							{activeSection === "basic" && (
								<Animated.View
									entering={FadeInRight.delay(100).duration(100)}
									key={activeSection}
									style={
										useTwoColumnLayout
											? {
													flexDirection: "row",
													flexWrap: "wrap",
													justifyContent: "space-between",
												}
											: { gap: theme.spacing.md }
									}
								>
									<View
										style={[
											useTwoColumnLayout ? { width: "48%" } : { width: "100%" },
										]}
									>
										<Box
											card
											rounded="md"
											padding="lg"
											elevation="small"
											gap={"md"}
										>
											<Box row alignItems="center">
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

											<Box gap={"md"}>
												<FormInput
													name="name"
													label={t("meals.mealName")}
													required
													placeholder={t("meals.mealName")}
													schema={nameSchema}
												/>
												<FormInput
													name="name_ar"
													label={`${t("meals.mealName")} (العربية)`}
													placeholder={`${t("meals.mealName")} (العربية)`}
													textAlign={isArabic ? "right" : "left"}
												/>
											</Box>

											<Box>
												<FormInput
													name="description"
													label={t("meals.description")}
													required
													placeholder={t("meals.description")}
													multiline={true}
													numberOfLines={4}
													textAlignVertical="top"
													schema={descriptionSchema}
												/>
												<FormInput
													name="description_ar"
													label={`${t("meals.description")} (العربية)`}
													placeholder={`${t("meals.description")} (العربية)`}
													multiline={true}
													numberOfLines={4}
													textAlign={isArabic ? "right" : "left"}
													textAlignVertical="top"
												/>
											</Box>

											<FormCategory
												name="period"
												label={t("meals.mealPeriod")}
												options={periodOptions}
												required
											/>

											<FormRadio
												name="dietaryRestriction"
												label="Dietary Restrictions"
												options={dietaryOptions}
											/>
										</Box>
									</View>

									<View
										style={
											useTwoColumnLayout
												? { width: "48%", marginTop: 0 }
												: { width: "100%", marginTop: theme.spacing.md }
										}
									>
										<Box
											card
											rounded="md"
											padding="lg"
											elevation="small"
											gap={"md"}
										>
											<Box row alignItems="center">
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

											<Box row gap="md">
												<Box flex={1}>
													<FormInput
														name="price"
														label={t("meals.price")}
														required
														placeholder="0.00"
														keyboardType="numeric"
														schema={priceSchema}
														style={{
															paddingLeft: 36,
															fontSize: theme.typography.sizes.lg,
															fontWeight: theme.typography.weights.semibold,
														}}
													/>
													<Box
														style={{
															position: "absolute",
															left: theme.spacing.md,
															top: 20,
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
													<FormInput
														name="calories"
														label={t("meals.calories")}
														placeholder="0"
														keyboardType="numeric"
														schema={caloriesSchema}
													/>
													<Box
														style={{
															position: "absolute",
															right: theme.spacing.md,
															top: 20,
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
										</Box>
									</View>
								</Animated.View>
							)}

							{activeSection === "settings" && (
								<AnimatedBox
									entering={FadeInRight.delay(100).duration(100)}
									key={activeSection}
									gap={"md"}
								>
									<Box
										card
										rounded="md"
										padding="lg"
										elevation="small"
										gap={"md"}
									>
										<Box row alignItems="center">
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

										<FormSwitch
											name="available"
											label={
												meal?.available
													? t("meals.available")
													: t("meals.unavailable")
											}
											description={
												meal?.available
													? t("meals.availableDesc")
													: t("meals.unavailableDesc")
											}
											leftIcon={
												meal?.available
													? "checkmark-circle-outline"
													: "close-circle-outline"
											}
										/>

										<FormSwitch
											name="featured"
											label={t("meals.featured")}
											description={t("meals.featuredDesc")}
											leftIcon="star-outline"
										/>

										<FormSwitch
											name="isVegan"
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
											style={{ opacity: 0.9 }}
											gap={"xs"}
										>
											<Box row alignItems="center">
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

											<Text variant="sm" color="#fff">
												{t("meals.deleteMealWarning")}
											</Text>

											<Button
												title={t("common.delete")}
												variant="outline"
												size="md"
												style={{ borderColor: "#fff" }}
												textColor="#fff"
												onPress={handleDelete}
												accessibilityLabel={t("common.delete")}
											/>
										</Box>
									)}
								</AnimatedBox>
							)}

							<AnimatedBox
								entering={FadeInUp.delay(300).duration(400)}
								marginTop="lg"
							>
								<Form.SubmitButton>
									{({ onPress, isValid, isDirty }) => (
										<Button
											title={
												isEdit ? t("meals.saveChanges") : t("meals.createMeal")
											}
											variant="primary"
											size="lg"
											loading={loading}
											fullWidth
											rounded
											leftIcon="save-outline"
											onPress={onPress}
											disabled={!isValid || !isDirty}
											accessibilityLabel={
												isEdit ? t("meals.saveChanges") : t("meals.createMeal")
											}
										/>
									)}
								</Form.SubmitButton>

								{!isEdit && (
									<Button
										title={t("common.cancel")}
										variant="ghost"
										size="lg"
										fullWidth
										style={{ marginTop: theme.spacing.md }}
										onPress={() => router.back()}
										accessibilityLabel={t("common.cancel")}
									/>
								)}
							</AnimatedBox>
						</Form>
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		</ErrorBoundary>
	);
};

export default MealFormScreen;

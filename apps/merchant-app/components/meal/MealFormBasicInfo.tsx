import React from "react";
import { TextInput } from "react-native";
import { Box, Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import FocusableInput from "@/components/fields/FocusableInput";
import { CategoryField } from "@/components/fields/CategoryField";
import { RadioField } from "@/components/fields/RadioField";
import { Meal } from "@/types";

interface MealFormBasicInfoProps {
	meal: Partial<Meal>;
	errors: Record<string, string>;
	updateField: (field: keyof Meal, value: any) => void;
	nameInputRef: React.RefObject<TextInput>;
	nameArInputRef: React.RefObject<TextInput>;
	descInputRef: React.RefObject<TextInput>;
	descArInputRef: React.RefObject<TextInput>;
	handleSubmitEditing: (nextInput: React.RefObject<TextInput | null>) => void;
	periodOptions: Array<{
		value: string;
		label: string;
		icon: string;
	}>;
	dietaryOptions: Array<{
		value: string;
		label: string;
		description: string;
	}>;
}

export const MealFormBasicInfo: React.FC<MealFormBasicInfoProps> = ({
	meal,
	errors,
	updateField,
	nameInputRef,
	nameArInputRef,
	descInputRef,
	descArInputRef,
	handleSubmitEditing,
	periodOptions,
	dietaryOptions,
}) => {
	const theme = useTheme();
	const { t, language } = useTranslation();
	const isArabic = language === "ar";

	return (
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
					accessibilityLabel={t("meals.mealName")}
					accessibilityRole="none"
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
					accessibilityLabel={`${t("meals.mealName")} (العربية)`}
					accessibilityRole="none"
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
					accessibilityLabel={t("meals.description")}
					accessibilityRole="none"
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
					accessibilityLabel={`${t("meals.description")} (العربية)`}
					accessibilityRole="none"
				/>
			</Box>
			<Box marginBottom="md">
				<CategoryField
					label={t("meals.mealPeriod")}
					options={periodOptions}
					value={meal.period || "Breakfast"}
					onChange={(value) => updateField("period", value)}
					error={errors.period}
					required
				/>
			</Box>
			<Box marginBottom="md">
				<RadioField
					label="Dietary Restrictions"
					options={dietaryOptions}
					value={meal.dietaryRestriction || "none"}
					onChange={(value) => updateField("dietaryRestriction", value)}
					error={errors.dietaryRestriction}
				/>
			</Box>
		</Box>
	);
};

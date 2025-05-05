import { useCallback, useEffect } from "react";
import { Keyboard } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMealStore } from "@/stores/mealStore";
import { MealSchemaType } from "@/schemas/mealSchema";
import { Meal } from "@/types";

export const useMealForm = (mealId?: string) => {
	const router = useRouter();
	const {
		meals,
		selectedMeal,
		loading,
		setSelectedMeal,
		setLoading,
		addMeal,
		updateMeal,
		deleteMeal,
	} = useMealStore();

	const isEdit = mealId !== "new" && !!mealId;

	useEffect(() => {
		if (isEdit && mealId) {
			setSelectedMeal(mealId);
		} else {
			setSelectedMeal("");
		}
	}, [mealId, isEdit, setSelectedMeal]);

	const handleFormSubmit = useCallback(
		(values: MealSchemaType) => {
			Keyboard.dismiss();
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			setLoading(true);

			setTimeout(() => {
				if (isEdit && values.id) {
					updateMeal(values as Meal);
				} else {
					const newMeal = {
						...values,
						id: values.id || `meal-${Date.now()}`,
					} as Meal;
					addMeal(newMeal);
				}
				setLoading(false);
				router.back();
			}, 500);
		},
		[isEdit, router, setLoading, updateMeal, addMeal],
	);

	const handleDelete = useCallback(() => {
		if (isEdit && mealId) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
			deleteMeal(mealId);
		}
		router.back();
	}, [isEdit, mealId, deleteMeal, router]);

	const handleSelectImage = useCallback(() => {
		console.log("Select image");
	}, []);

	return {
		meal: selectedMeal || {
			id: `meal-${Date.now()}`,
			name: "",
			name_ar: "",
			description: "",
			description_ar: "",
			price: 0,
			calories: 0,
			prepTime: 0,
			period: "Breakfast",
			available: true,
			image: "",
			isVegan: false,
			featured: false,
		},
		loading,
		isEdit,
		handleFormSubmit,
		handleDelete,
		handleSelectImage,
	};
};

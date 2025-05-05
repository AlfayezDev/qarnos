import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Meal } from "@/types";
import { MEALS } from "@/data";

interface MealState {
	meals: Meal[];
	selectedMeal: Meal | null;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	setSelectedMeal: (id: string) => void;
	addMeal: (meal: Meal) => void;
	updateMeal: (meal: Meal) => void;
	deleteMeal: (id: string) => void;
}

export const useMealStore = create<MealState>()(
	immer((set, get) => ({
		meals: MEALS,
		selectedMeal: null,
		loading: false,
		setLoading: (loading) => set({ loading }),
		setSelectedMeal: (id) => {
			const meal = get().meals.find((m) => m.id === id) || null;
			set({ selectedMeal: meal });
		},
		addMeal: (meal) =>
			set((state) => {
				state.meals.push(meal);
			}),
		updateMeal: (meal) =>
			set((state) => {
				const index = state.meals.findIndex((m) => m.id === meal.id);
				if (index !== -1) {
					state.meals[index] = meal;
				}
			}),
		deleteMeal: (id) =>
			set((state) => {
				state.meals = state.meals.filter((m) => m.id !== id);
			}),
	})),
);

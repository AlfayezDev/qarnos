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

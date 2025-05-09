export interface BaseModel {
	id: string;
	createdAt?: string;
	updatedAt?: string;
}
export type Period = "Breakfast" | "Lunch" | "Dinner";
export type AlertType = "warning" | "info" | "error" | "success";
export type DietaryRestriction =
	| "none"
	| "vegetarian"
	| "vegan"
	| "glutenFree"
	| "dairyFree";
export interface MealCount {
	name: string;
	name_ar: string;
	count: number;
	id: string;
}
export interface MealPrepSummary {
	period: Period;
	totalMeals: number;
	mealsToPrep: MealCount[];
}
export interface Alert extends BaseModel {
	type: AlertType;
	title: string;
	title_ar?: string;
	icon: string;
	timestamp?: string;
	message?: string;
	message_ar?: string;
	read?: boolean;
}
export interface StatItem {
	title: string;
	title_ar?: string;
	value: string | number;
	icon: string;
	change?: number;
	changeDirection?: "up" | "down" | "neutral";
}
export interface OverviewStats {
	activeSubscriptions: number;
	newThisWeek: number;
	newThisMonth?: number;
	totalMeals?: number;
	revenue?: {
		daily?: number;
		weekly?: number;
		monthly?: number;
	};
}
export interface QuickActionItem {
	label: string;
	label_ar?: string;
	icon: string;
	action: () => void;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}
export interface Ingredient {
	name: string;
	name_ar?: string;
	quantity?: number;
	unit?: string;
}
export interface Meal extends BaseModel {
	dietaryRestriction?: DietaryRestriction;
	featured: boolean;
	isVegan: boolean;
	name: string;
	name_ar?: string;
	description: string;
	description_ar?: string;
	price: number;
	calories: number;
	prepTime: number;
	period: Period;
	available: boolean;
	image?: string;
	nutritionalInfo?: {
		protein?: number;
		carbs?: number;
		fat?: number;
		sugar?: number;
		sodium?: number;
	};
	allergens?: string[];
	tags?: string[];
}
export type RootStackParamList = {
	Home: undefined;
	Meals: undefined;
	MealDetails: {
		mealId: string;
	};
	Settings: undefined;
};
export interface ThemeTypography {
	sizes: {
		xs: number;
		sm: number;
		md: number;
		lg: number;
		xl: number;
		xxl: number;
		xxxl: number;
	};
	weights: {
		regular: string;
		medium: string;
		semibold: string;
		bold: string;
		extrabold: string;
	};
	lineHeights: {
		tight: number;
		normal: number;
		loose: number;
	};
}
export interface FieldCommonProps {
	label?: string;
	label_ar?: string;
	error?: string;
	error_ar?: string;
	required?: boolean;
	disabled?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}
export interface InputFieldProps extends FieldCommonProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	placeholder_ar?: string;
	keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
	secureTextEntry?: boolean;
	multiline?: boolean;
	numberOfLines?: number;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	rightIcon?: string;
	leftIcon?: string;
}
export interface SelectOption {
	value: string;
	label: string;
	label_ar?: string;
	icon?: string;
	description?: string;
	description_ar?: string;
}
export interface UserProfile {
	id: string;
	email: string;
	name: string;
	name_ar?: string;
	role: "admin" | "staff" | "cook";
	avatarUrl?: string;
	preferences?: {
		language?: "en" | "ar";
		theme?: "light" | "dark" | "system";
		notifications?: boolean;
	};
}

export interface Customer extends BaseModel {
	name: string;
	name_ar?: string;
	subscriptionType: string;
	subscriptionType_ar?: string;
	totalSpent: number;
	orders: number;
	joinDate: string;
}

export type MealId = Meal["id"];
export type AlertId = Alert["id"];
export {};

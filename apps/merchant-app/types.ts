export interface BaseModel {
	id: string;
	createdAt?: string;
	updatedAt?: string;
}

// General types
export type Period = "Breakfast" | "Lunch" | "Dinner";
export type AlertType = "warning" | "info" | "error" | "success";
export type DietaryRestriction =
	| "none"
	| "vegetarian"
	| "vegan"
	| "glutenFree"
	| "dairyFree";

// Enhanced meal types
export interface MealCount {
	name: string;
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
	icon: string;
	timestamp?: string;
	message?: string;
	read?: boolean;
}

export interface StatItem {
	title: string;
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
	icon: string;
	action: () => void;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

export interface Ingredient {
	name: string;
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
	// Additional properties
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

// Enhanced navigation types
export type RootStackParamList = {
	Home: undefined;
	Meals: undefined;
	MealDetails: {
		mealId: string;
	};
	Settings: undefined;
};

// Theme types
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

// Form field common props
export interface FieldCommonProps {
	label?: string;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

// Input field props
export interface InputFieldProps extends FieldCommonProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
	secureTextEntry?: boolean;
	multiline?: boolean;
	numberOfLines?: number;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	rightIcon?: string;
	leftIcon?: string;
}

// Select field options
export interface SelectOption {
	value: string;
	label: string;
	icon?: string;
	description?: string;
}

// User profile and authentication types
export interface UserProfile {
	id: string;
	email: string;
	name: string;
	role: "admin" | "staff" | "cook";
	avatarUrl?: string;
	preferences?: {
		language?: "en" | "ar";
		theme?: "light" | "dark" | "system";
		notifications?: boolean;
	};
}

// Enhanced type exports to ensure proper type checking
export type MealId = Meal["id"];
export type AlertId = Alert["id"];

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

export const MEALS = [
	{
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

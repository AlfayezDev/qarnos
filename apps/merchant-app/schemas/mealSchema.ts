import { z } from "zod";
import {
	nameSchema,
	priceSchema,
	caloriesSchema,
	descriptionSchema,
	imageUrlSchema,
	createFormSchema,
} from "@/utils/validation";

export const mealSchema = z.object({
	id: z.string().optional(),
	name: nameSchema,
	name_ar: z.string().optional(),
	description: descriptionSchema,
	description_ar: z.string().optional(),
	price: priceSchema,
	calories: caloriesSchema,
	prepTime: z
		.number()
		.positive("Prep time must be greater than 0")
		.int("Prep time must be a whole number")
		.or(z.string().regex(/^\d+$/).transform(Number)),
	period: z.enum(["Breakfast", "Lunch", "Dinner"], {
		errorMap: () => ({ message: "Please select a valid meal period" }),
	}),

	available: z.boolean().default(true),
	featured: z.boolean().default(false),
	isVegan: z.boolean().default(false),
	image: imageUrlSchema.optional(),
	dietaryRestriction: z
		.enum(["none", "vegetarian", "vegan", "glutenFree", "dairyFree"])
		.optional(),
});

export type MealSchemaType = z.infer<typeof mealSchema>;

export const mealFormSchema = createFormSchema(mealSchema);

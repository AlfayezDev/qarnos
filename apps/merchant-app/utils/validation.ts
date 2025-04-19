import { z, AnyZodObject, ZodTypeAny } from "zod";

export const createFormSchema = <T extends AnyZodObject>(schema: T) => {
	type SchemaOutputType = z.infer<T>;

	return {
		schema,
		validateField: (
			field: keyof SchemaOutputType,
			value: any,
		): { valid: boolean; error?: string } => {
			const fieldSchema = schema.shape[field as string] as
				| ZodTypeAny
				| undefined;

			if (!fieldSchema) {
				console.warn(`Schema not found for field: ${String(field)}`);

				return { valid: true };
			}

			const result = fieldSchema.safeParse(value);

			if (result.success) {
				return { valid: true };
			}

			const [error] = result.error.errors;
			return {
				valid: false,
				error: error?.message,
			};
		},

		validateForm: (
			values: Partial<SchemaOutputType>,
		): {
			valid: boolean;

			errors: Partial<Record<keyof SchemaOutputType, string>>;
		} => {
			const result = schema.safeParse(values);

			if (result.success) {
				return { valid: true, errors: {} };
			}

			const errors: Partial<Record<keyof SchemaOutputType, string>> = {};
			result.error.errors.forEach((error) => {
				if (error.path.length > 0) {
					const field = error.path[0] as keyof SchemaOutputType;

					if (!errors[field]) {
						errors[field] = error.message;
					}
				}
			});

			return { valid: false, errors };
		},
	};
};

export const nameSchema = z
	.string()
	.min(1, "Name is required")
	.max(100, "Name is too long");

export const priceSchema = z.preprocess(
	(val) => (val === "" ? undefined : val),
	z.coerce
		.number({
			invalid_type_error: "Price must be a number",
			required_error: "Price is required",
		})
		.positive("Price must be greater than 0")
		.finite("Price must be a finite number"),
);

export const caloriesSchema = z.preprocess(
	(val) => (val === "" ? undefined : val),
	z.coerce
		.number({
			invalid_type_error: "Calories must be a number",
			required_error: "Calories are required",
		})
		.nonnegative("Calories cannot be negative")
		.int("Calories must be a whole number"),
);

export const descriptionSchema = z
	.string()
	.trim()
	.min(1, "Description is required")
	.min(10, "Description must be at least 10 characters")
	.max(1000, "Description must be less than 1000 characters");

export const ingredientsSchema = z
	.array(z.string().trim().min(1, "Ingredient cannot be empty"))
	.min(1, "At least one ingredient is required");

export const imageUrlSchema = z
	.string()
	.trim()
	.url("Image must be a valid URL")
	.optional()
	.or(z.literal(""));

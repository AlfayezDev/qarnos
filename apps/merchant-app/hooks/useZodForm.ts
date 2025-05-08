import { useState, useMemo } from "react";
import { z, ZodObject, AnyZodObject } from "zod";

const createFormSchema = <T extends AnyZodObject>(schema: T) => {
	type SchemaOutputType = z.infer<T>;

	return {
		validateField: (field: keyof SchemaOutputType, value: any) => {
			if (!(schema instanceof ZodObject)) {
				console.error("Schema provided to createFormSchema is not a ZodObject");
				return {
					valid: false,
					error: "Invalid schema type for field validation.",
				};
			}

			const fieldSchema = schema.shape[field as string];

			if (!fieldSchema) {
				console.warn(`Field "${String(field)}" not found in schema shape.`);
				return { valid: true };
			}
			const result = fieldSchema.safeParse(value);
			if (!result.success) {
				return {
					valid: false,
					error: result.error.errors[0]?.message ?? "Invalid value",
				};
			}
			return { valid: true };
		},
		validateForm: (values: Partial<SchemaOutputType>) => {
			const result = schema.safeParse(values);
			if (!result.success) {
				const errors: Record<string, string> = {};
				result.error.errors.forEach((err) => {
					if (err.path.length > 0) {
						const fieldKey = err.path[0] as string;
						if (!errors[fieldKey]) {
							errors[fieldKey] = err.message;
						}
					}
				});
				return { valid: false, errors };
			}
			return { valid: true, errors: {} };
		},
	};
};

export function useZodForm<T extends AnyZodObject>(
	schema: T,
	initialValues: Partial<z.infer<T>> = {},
) {
	type SchemaOutputType = z.infer<T>;

	const [values, setValues] =
		useState<Partial<SchemaOutputType>>(initialValues);

	const [errors, setErrors] = useState<
		Partial<Record<keyof SchemaOutputType, string>>
	>({});
	const [touched, setTouched] = useState<
		Partial<Record<keyof SchemaOutputType, boolean>>
	>({});

	const formSchema = useMemo(() => createFormSchema(schema), [schema]);

	const setValue = (field: keyof SchemaOutputType, value: any) => {
		setValues((prev) => ({ ...prev, [field]: value }));

		const validation = formSchema.validateField(field, value);

		if (!validation.valid && validation.error) {
			setErrors((prev) => ({ ...prev, [field]: validation.error }));
		} else {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const handleBlur = (field: keyof SchemaOutputType) => {
		setTouched((prev) => ({ ...prev, [field]: true }));

		const value = values[field];
		const validation = formSchema.validateField(field, value);

		if (!validation.valid && validation.error) {
			setErrors((prev) => ({ ...prev, [field]: validation.error }));
		} else {
			setErrors((prev) => {
				const newErrors = { ...prev };

				if (validation.valid && newErrors[field]) {
					delete newErrors[field];
				}
				return newErrors;
			});
		}
	};

	const validateForm = () => {
		const result = formSchema.validateForm(values);

		setErrors(result.errors as Partial<Record<keyof SchemaOutputType, string>>);
		return result.valid;
	};
	const resetForm = (newValues: Partial<SchemaOutputType> = initialValues) => {
		setValues(newValues);
		setErrors({});
		setTouched({});
	};

	const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
	const isDirty = useMemo(() => Object.keys(touched).length > 0, [touched]);

	return {
		values,
		errors,
		touched,
		setValue,
		handleBlur,
		validateForm,
		resetForm,
		isDirty,
		isValid,
	};
}

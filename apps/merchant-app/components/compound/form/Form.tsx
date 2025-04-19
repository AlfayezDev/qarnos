import { useZodForm } from "@/hooks/useZodForm";
import React, { createContext, useContext, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { z, AnyZodObject } from "zod";

type ZodFormInfer<T extends AnyZodObject> = z.infer<T>;

interface FormContextType<T extends AnyZodObject> {
	values: Partial<ZodFormInfer<T>>;

	errors: Partial<Record<keyof ZodFormInfer<T>, string>>;
	touched: Partial<Record<keyof ZodFormInfer<T>, boolean>>;
	setValue: (field: keyof ZodFormInfer<T>, value: any) => void;
	handleBlur: (field: keyof ZodFormInfer<T>) => void;
	validateForm: () => boolean;
	handleSubmit?: () => void;
	resetForm: (newValues?: Partial<ZodFormInfer<T>>) => void;
	isDirty: boolean;
	isValid: boolean;
}

const FormContext = createContext<FormContextType<any> | null>(null);

interface FormProps<T extends AnyZodObject> {
	schema: T;
	initialValues?: Partial<ZodFormInfer<T>>;
	onSubmit?: (values: ZodFormInfer<T>) => void;
	children:
		| React.ReactNode
		| ((props: {
				values: Partial<ZodFormInfer<T>>;

				errors: Partial<Record<keyof ZodFormInfer<T>, string>>;
				touched: Partial<Record<keyof ZodFormInfer<T>, boolean>>;
				handleSubmit: () => void;
				isValid: boolean;
				isDirty: boolean;
		  }) => React.ReactNode);
	style?: ViewStyle;
}

function Form<T extends AnyZodObject>({
	schema,
	initialValues = {},
	onSubmit,
	children,
	style,
}: FormProps<T>) {
	const {
		values,
		errors,
		touched,
		setValue,
		handleBlur,
		validateForm,
		resetForm,
		isDirty,
		isValid,
	} = useZodForm(schema, initialValues);

	const contextValue = useMemo(
		(): FormContextType<T> => ({
			values,
			errors,
			touched,
			setValue,
			handleBlur,
			validateForm,
			resetForm,
			isDirty,
			isValid,
		}),
		[
			values,
			errors,
			touched,
			setValue,
			handleBlur,
			validateForm,
			resetForm,
			isDirty,
			isValid,
		],
	);

	const handleSubmit = () => {
		if (validateForm()) {
			const result = schema.safeParse(values);
			if (result.success && onSubmit) {
				onSubmit(result.data as ZodFormInfer<T>);
			} else {
				console.error(
					"Form validation passed but schema parsing failed.",
					result.error,
				);
			}
		}
	};

	return (
		<FormContext.Provider value={contextValue}>
			<View style={[styles.container, style]}>
				{typeof children === "function"
					? children({
							values,
							errors,
							touched,
							handleSubmit,
							isValid,
							isDirty,
						})
					: children}
			</View>
		</FormContext.Provider>
	);
}

export function useForm<T extends AnyZodObject>() {
	const context = useContext<FormContextType<T> | null>(FormContext);
	if (!context) {
		throw new Error("useForm must be used within a Form component");
	}

	return context;
}

interface FieldProps<T extends AnyZodObject> {
	name: keyof ZodFormInfer<T>;
	children: (fieldProps: {
		value: any;
		error?: string;
		onChange: (value: any) => void;
		onBlur: () => void;
		touched: boolean;
	}) => React.ReactNode;
}

function Field<T extends AnyZodObject>({ name, children }: FieldProps<T>) {
	const { values, errors, touched, setValue, handleBlur } = useForm<T>();

	const fieldProps = {
		value: values[name],
		error: errors[name],
		onChange: (value: any) => setValue(name, value),
		onBlur: () => handleBlur(name),
		touched: !!touched[name],
	};

	return <>{children(fieldProps)}</>;
}

interface SubmitButtonProps {
	children: (props: {
		onPress: () => void;
		isValid: boolean;
		isDirty: boolean;
	}) => React.ReactNode;
}

function SubmitButton({ children }: SubmitButtonProps) {
	const { handleSubmit, isValid, isDirty } = useForm();

	const handlePress = () => {
		handleSubmit?.();
	};

	return <>{children({ onPress: handlePress, isValid, isDirty })}</>;
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
});

Form.Field = Field;
Form.SubmitButton = SubmitButton;

export { Form };

import React from "react";
import { Form } from "./Form";
import {
	CategoryField,
	CategoryOption,
} from "@/components/fields/CategoryField";

interface FormCategoryProps {
	name: string;
	label?: string;
	options: CategoryOption[];
	required?: boolean;
	disabled?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

export const FormCategory: React.FC<FormCategoryProps> = ({
	name,
	label,
	options,
	required = false,
	disabled = false,
	accessibilityLabel,
	accessibilityHint,
}) => {
	return (
		<Form.Field name={name}>
			{({ value, error, onChange }) => (
				<CategoryField
					options={options}
					value={value || ""}
					onChange={onChange}
					label={label}
					error={error}
					required={required}
					disabled={disabled}
					accessibilityLabel={accessibilityLabel || label}
					accessibilityHint={accessibilityHint}
				/>
			)}
		</Form.Field>
	);
};

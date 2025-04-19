import React from "react";
import { Form } from "./Form";
import { RadioField, RadioOption } from "@/components/fields/RadioField";

interface FormRadioProps {
	name: string;
	label?: string;
	options: RadioOption[];
	horizontal?: boolean;
	required?: boolean;
	disabled?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

export const FormRadio: React.FC<FormRadioProps> = ({
	name,
	label,
	options,
	horizontal = false,
	required = false,
	disabled = false,
	accessibilityLabel,
	accessibilityHint,
}) => {
	return (
		<Form.Field name={name}>
			{({ value, error, onChange }) => (
				<RadioField
					options={options}
					value={value || ""}
					onChange={onChange}
					label={label}
					horizontal={horizontal}
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

import React from "react";
import { Form } from "./Form";
import { SwitchField } from "@/components/fields/SwitchField";

interface FormSwitchProps {
	name: string;
	label?: string;
	description?: string;
	leftIcon?: string;
	disabled?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
	name,
	label,
	description,
	leftIcon,
	disabled = false,
	accessibilityLabel,
	accessibilityHint,
}) => {
	return (
		<Form.Field name={name}>
			{({ value, error, onChange }) => (
				<SwitchField
					value={value || false}
					onValueChange={onChange}
					label={label}
					description={description}
					leftIcon={leftIcon}
					disabled={disabled}
					error={error}
					accessibilityLabel={accessibilityLabel || label}
					accessibilityHint={accessibilityHint}
				/>
			)}
		</Form.Field>
	);
};

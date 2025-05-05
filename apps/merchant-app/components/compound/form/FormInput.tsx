import React from "react";
import { z } from "zod";
import { Form } from "./Form";
import FocusableInput, {
	FocusableInputProps,
} from "@/components/fields/FocusableInput";
import { useTheme } from "@/stores/themeStore";

interface FormInputProps {
	name: string;
	label?: string;
	placeholder?: string;
	required?: boolean;
	multiline?: boolean;
	numberOfLines?: number;
	keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
	secureTextEntry?: boolean;
	schema?: z.ZodType<any, any>;
	inputRef?: React.RefObject<any>;
	onSubmitEditing?: () => void;
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	textAlign?: "left" | "center" | "right";
	textAlignVertical?: "top" | "center" | "bottom";
	accessibilityLabel?: string;
	accessibilityHint?: string;
	style?: FocusableInputProps["style"];
}

export const FormInput: React.FC<FormInputProps> = ({
	name,
	label,
	placeholder,
	required = false,
	multiline = false,
	numberOfLines = 1,
	keyboardType = "default",
	secureTextEntry = false,
	schema,
	inputRef,
	onSubmitEditing,
	autoCapitalize = "sentences",
	textAlign,
	textAlignVertical,
	accessibilityLabel,
	accessibilityHint,
	style,
}) => {
	const theme = useTheme();

	return (
		<Form.Field name={name}>
			{({ value, error, onChange, onBlur, touched }) => (
				<FocusableInput
					inputRef={inputRef}
					label={label}
					required={required}
					value={value || ""}
					onChangeText={onChange}
					placeholder={placeholder}
					placeholderTextColor={theme.colors.textMuted}
					multiline={multiline}
					numberOfLines={numberOfLines}
					keyboardType={keyboardType}
					secureTextEntry={secureTextEntry}
					onSubmitEditing={onSubmitEditing}
					onBlur={onBlur}
					error={touched && error ? error : undefined}
					autoCapitalize={autoCapitalize}
					textAlign={textAlign}
					textAlignVertical={textAlignVertical}
					accessibilityLabel={accessibilityLabel || label}
					accessibilityHint={accessibilityHint}
					schema={schema}
					style={style}
				/>
			)}
		</Form.Field>
	);
};

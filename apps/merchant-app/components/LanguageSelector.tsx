import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/hooks/useTheme";

export const LanguageSelector: React.FC = () => {
	const { language, changeLanguage } = useLanguage();
	const theme = useTheme();

	return (
		<View style={styles.container}>
			<Text variant="md" weight="semibold" marginBottom="md">
				{language === "en" ? "Language" : "اللغة"}
			</Text>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[
						styles.languageButton,
						{
							backgroundColor:
								language === "en" ? theme.colors.primary : "transparent",
							borderColor: theme.colors.primary,
						},
					]}
					onPress={() => changeLanguage("en")}
					accessible={true}
					accessibilityRole="button"
					accessibilityLabel="Switch to English"
				>
					<Text
						variant="md"
						weight="medium"
						color={language === "en" ? "background" : "primary"}
					>
						English
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.languageButton,
						{
							backgroundColor:
								language === "ar" ? theme.colors.primary : "transparent",
							borderColor: theme.colors.primary,
						},
					]}
					onPress={() => changeLanguage("ar")}
					accessible={true}
					accessibilityRole="button"
					accessibilityLabel="Switch to Arabic"
				>
					<Text
						variant="md"
						weight="medium"
						color={language === "ar" ? "background" : "primary"}
					>
						العربية
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	languageButton: {
		flex: 1,
		margin: 4,
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

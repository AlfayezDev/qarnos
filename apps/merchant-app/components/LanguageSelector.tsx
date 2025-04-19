import { Text } from "@/components/ui/Text";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

export const LanguageSelector = React.memo(() => {
	const { language, changeLanguage } = useLanguage();
	const theme = useTheme();

	const handleLanguageChange = useCallback((newLanguage: "en" | "ar") => {
		changeLanguage(newLanguage);
	}, []);

	return (
		<View style={{ alignItems: "flex-start" }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<TouchableOpacity
					style={{
						flex: 1,
						margin: theme.spacing.xs,
						padding: theme.spacing.sm,
						borderRadius: theme.radius.sm,
						borderWidth: 1,
						borderColor: theme.colors.primary,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor:
							language === "en" ? theme.colors.primary : "transparent",
					}}
					onPress={() => handleLanguageChange("en")}
					accessible={true}
					accessibilityRole="button"
					accessibilityLabel="Switch to English"
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons
							name="globe-outline"
							size={theme.sizes.iconSm}
							color={
								language === "en"
									? theme.colors.background
									: theme.colors.primary
							}
							style={{ marginEnd: theme.spacing.xs }}
						/>
						<Text
							variant="md"
							weight="medium"
							color={language === "en" ? "background" : "primary"}
						>
							English
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flex: 1,
						margin: theme.spacing.xs,
						padding: theme.spacing.sm,
						borderRadius: theme.radius.sm,
						borderWidth: 1,
						borderColor: theme.colors.primary,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor:
							language === "ar" ? theme.colors.primary : "transparent",
					}}
					onPress={() => handleLanguageChange("ar")}
					accessible={true}
					accessibilityRole="button"
					accessibilityLabel="Switch to Arabic"
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Ionicons
							name="globe-outline"
							size={theme.sizes.iconSm}
							color={
								language === "ar"
									? theme.colors.background
									: theme.colors.primary
							}
							style={{ marginEnd: theme.spacing.xs }}
						/>
						<Text
							variant="md"
							weight="medium"
							color={language === "ar" ? "background" : "primary"}
						>
							العربية
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
});

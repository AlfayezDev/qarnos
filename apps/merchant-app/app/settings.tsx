import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { Text, Box } from "@/components/ui";
import { ScreenContainer } from "@/components/layout";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const theme = useTheme();
	const { t, isRTL } = useTranslation();

	const handleBack = () => {
		router.back();
	};

	return (
		<SafeAreaView
			style={{
				paddingHorizontal: theme.spacing.screenPadding,
			}}
		>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>

			<Box row alignItems="center" marginBottom="lg" marginTop="sm">
				<TouchableOpacity
					onPress={handleBack}
					style={{
						width: theme.sizes.buttonSm,
						height: theme.sizes.buttonSm,
						borderRadius: theme.radius.round,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: theme.colors.backgroundAlt,
					}}
				>
					<Ionicons
						name={isRTL ? "chevron-forward" : "chevron-back"}
						size={theme.sizes.iconMd}
						color={theme.colors.text}
					/>
				</TouchableOpacity>
				<Text variant="xl" weight="semibold" marginStart={"md"}>
					{t("common.settings")}
				</Text>
			</Box>

			<Box card padding="md" marginBottom="lg">
				<LanguageSelector />
			</Box>

			<Box
				card
				padding={"md"}
				alignItems="flex-start"
				justifyContent="space-between"
				row
			>
				<Text variant="md" weight="semibold">
					{t("common.version")}
				</Text>
				<Text center variant="sm" color="textSecondary">
					v1.0.0
				</Text>
			</Box>
		</SafeAreaView>
	);
}

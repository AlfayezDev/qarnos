import React from "react";
import { View } from "react-native";

import { Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MealFormScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
				paddingTop: insets.top,
			}}
		>
			<Box
				row
				alignItems="center"
				paddingHorizontal="md"
				paddingVertical="sm"
				style={{
					height: theme.sizes.headerHeight,
				}}
			>
				<Text variant="xl" weight="semibold" numberOfLines={1}>
					{t("meals.title")}
				</Text>
			</Box>
		</View>
	);
};

export default MealFormScreen;

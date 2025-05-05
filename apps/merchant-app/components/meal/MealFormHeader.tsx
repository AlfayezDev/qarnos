import { AnimatedBox, Box, Text } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import { FadeIn } from "react-native-reanimated";
import { DeleteButton } from "./DeleteButton";
import { BackButton } from "@/components/common/BackButton";
import { useTranslation } from "@/stores/translationStore";

interface MealFormHeaderProps {
	title: string;
	isEdit: boolean;
	mealName?: string;
	mealNameAr?: string;
	onDelete: () => void;
}

export const MealFormHeader = React.memo(
	({ title, isEdit, mealName, mealNameAr, onDelete }: MealFormHeaderProps) => {
		const theme = useTheme();
		const router = useRouter();
		const { t, language } = useTranslation();
		const isArabic = language === "ar";

		return (
			<AnimatedBox
				row
				alignItems="center"
				justifyContent="space-between"
				paddingHorizontal="md"
				style={{
					height: theme.sizes.headerHeight,
					borderBottomWidth: 1,
					borderBottomColor: theme.colors.divider,
				}}
				entering={FadeIn.duration(300)}
			>
				<Box row alignItems="center">
					<BackButton
						onPress={() => router.back()}
						accessibilityLabel={t("common.back")}
					/>
					<Text variant="xl" weight="semibold" numberOfLines={1}>
						{isEdit ? (isArabic && mealNameAr ? mealNameAr : mealName) : title}
					</Text>
				</Box>
				{isEdit && (
					<DeleteButton
						onPress={onDelete}
						accessibilityLabel={t("common.delete")}
					/>
				)}
			</AnimatedBox>
		);
	},
);

import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QarnColors } from "@/constants/Colors";
import { QarnSpacing, QarnRadius, QarnSizes } from "@/constants/Spacing";
import { QarnTypography } from "@/constants/Typography";

interface CategoryFiltersProps {
	categories: string[];
	selectedCategory: string;
	onSelectCategory: (category: string) => void;
}
const CategoryFilters = ({
	categories,
	selectedCategory,
	onSelectCategory,
}: CategoryFiltersProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const tokens = QarnColors[isDark ? "dark" : "light"];

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				paddingLeft: QarnSpacing.md,
				paddingRight: QarnSpacing.sm,
				paddingVertical: QarnSpacing.sm,
			}}
		>
			{categories.map((category) => (
				<TouchableOpacity
					key={category}
					style={{
						paddingHorizontal: QarnSpacing.md,
						height: QarnSizes.buttonMd,
						borderRadius: QarnRadius.round,
						backgroundColor:
							selectedCategory === category
								? tokens.primary
								: tokens.primaryLight,
						marginRight: QarnSpacing.sm,
						alignItems: "center",
						justifyContent: "center",
						minWidth: 80,
					}}
					onPress={() => onSelectCategory(category)}
					activeOpacity={0.7}
				>
					<Text
						style={{
							color:
								selectedCategory === category
									? "white"
									: isDark
										? tokens.text
										: tokens.primary,
							fontWeight: QarnTypography.weights.medium,
							fontSize: QarnTypography.sizes.sm,
						}}
					>
						{category}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

export default CategoryFilters;

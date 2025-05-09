import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	FadeInUp,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
	interpolate,
} from "react-native-reanimated";
import { Text } from "@/components/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MealCard from "@/components/meal/MealCard";
import { useMealStore } from "@/stores/mealStore";
import { useTheme } from "@/stores/themeStore";
import { useTranslation } from "@/stores/translationStore";
import { BlurView } from "expo-blur";
import Masked from "@react-native-masked-view/masked-view";

import { useReanimatedHeaderHeight } from "react-native-screens/reanimated";
import { useLocalSearchParams } from "expo-router";

const AnimMask = Animated.createAnimatedComponent(Masked);

const MealScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { meals } = useMealStore();
	const params = useLocalSearchParams<{ tab: string }>();
	const selectedPeriod = params.tab ?? "breakfast";

	const filteredMeals = meals.filter(
		(meal) => meal.period.toLowerCase() === selectedPeriod.toLowerCase(),
	);
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollY = useScrollViewOffset(scrollRef);
	const style = useAnimatedStyle(() => ({
		opacity: interpolate(scrollY.value, [-152, -20], [0, 1], "clamp"),
	}));

	function renderEmptyList() {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					padding: theme.spacing.xl,
				}}
			>
				<Ionicons
					name="restaurant-outline"
					size={theme.sizes.iconLg}
					color={theme.colors.textMuted}
					style={{ marginBottom: theme.spacing.md }}
				/>
				<Text variant="lg" weight="semibold" color="textSecondary" center>
					{t("meals.noMeals")}
				</Text>
				<Text variant="md" color="textMuted" center marginTop="xs">
					{t("meals.addFirstMeal")}
				</Text>
			</View>
		);
	}

	return (
		<>
			<Animated.FlatList
				ref={scrollRef as any}
				entering={FadeInUp.delay(50).duration(400).springify().damping(15)}
				key={"meals-list"}
				data={filteredMeals}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <MealCard item={item} />}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: theme.spacing.md,
					paddingBottom: insets.bottom + theme.spacing.xxl,
					paddingTop: insets.top + 100,
					gap: theme.spacing.md,
				}}
				ListEmptyComponent={renderEmptyList}
			/>
			<Glur direction="top" style={style} />
		</>
	);
};

function Glur({
	direction,
	style,
}: {
	direction: "top" | "bottom";
	style: StyleProp<ViewStyle>;
}) {
	const headerHeight = useReanimatedHeaderHeight();

	const blurHeight = useAnimatedStyle(() => ({
		height: headerHeight.value * 1.5,
	}));

	return (
		<AnimMask
			maskElement={
				<Animated.View
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: "transparent",
							experimental_backgroundImage: `linear-gradient(to ${direction}, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 33%)`,
						},
						style,
					]}
				/>
			}
			style={[StyleSheet.absoluteFill, blurHeight]}
		>
			<BlurView
				intensity={100}
				tint={"systemChromeMaterial"}
				experimentalBlurMethod="dimezisBlurView"
				style={StyleSheet.absoluteFill}
			/>
		</AnimMask>
	);
}
export default MealScreen;

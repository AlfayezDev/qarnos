import React, { useState, useCallback } from "react";
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
import { Stack, useNavigation } from "expo-router";
import { Meal } from "@/types";

const AnimMask = Animated.createAnimatedComponent(Masked);

const MealScreen = () => {
	const theme = useTheme();
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { meals } = useMealStore();
	const navigation = useNavigation();

	const [searchQuery, setSearchQuery] = useState("");
	const [filteredMeals, setFilteredMeals] = useState(meals);

	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);
			if (!query.trim()) {
				setFilteredMeals(meals);
				return;
			}

			const lowerCaseQuery = query.toLowerCase().trim();
			const results = meals.filter(
				(meal: Meal) =>
					meal.name.toLowerCase().includes(lowerCaseQuery) ||
					(meal.name_ar && meal.name_ar.includes(lowerCaseQuery)) ||
					meal.description.toLowerCase().includes(lowerCaseQuery) ||
					(meal.description_ar &&
						meal.description_ar.includes(lowerCaseQuery)) ||
					meal.period.toLowerCase().includes(lowerCaseQuery),
			);

			setFilteredMeals(results);
		},
		[meals],
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
					{searchQuery
						? t("search.noResults") + ` "${searchQuery}"`
						: t("meals.noMeals")}
				</Text>
				<Text variant="md" color="textMuted" center marginTop="xs">
					{searchQuery ? "" : t("meals.addFirstMeal")}
				</Text>
			</View>
		);
	}

	React.useEffect(() => {
		navigation.setOptions({
			headerSearchBarOptions: {
				placeholder: t("search.placeholder"),
				onChangeText: (event: { nativeEvent: { text: string } }) => {
					handleSearch(event.nativeEvent.text);
				},
			},
		});
	}, [navigation, handleSearch, t]);

	return (
		<>
			<Stack.Screen
				options={{
					title: t("meals.title"),
					headerTransparent: true,
					headerLargeTitleShadowVisible: false,
					headerLargeStyle: {
						backgroundColor: "transparent",
					},
					headerSearchBarOptions: {
						shouldShowHintSearchIcon: true,
						placeholder: t("search.placeholder"),
						onChangeText: (event) => {
							handleSearch(event.nativeEvent.text);
						},
						inputType: "text",
					},
					headerLargeTitle: true,
					headerShadowVisible: false,
				}}
			/>
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
					paddingTop: insets.top + 170,
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
		height: headerHeight.value * 1.4,
	}));
	return (
		<>
			<AnimMask
				maskElement={
					<Animated.View
						style={[
							{
								backgroundColor: "transparent",
								experimental_backgroundImage: `linear-gradient(to ${direction}, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 30%)`,
							},
							StyleSheet.absoluteFill,
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
					style={[StyleSheet.absoluteFill]}
				/>
			</AnimMask>
		</>
	);
}

export default MealScreen;

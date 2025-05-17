import React, { useState } from "react";
import { View, Pressable, StatusBar } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
	interpolate,
	useAnimatedScrollHandler,
	Extrapolation,
	FadeIn,
	FadeInUp,
	runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Box, Text } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { SwitchField } from "@/components/fields/SwitchField";
import { useMealStore } from "@/stores/mealStore";
import { useTheme } from "@/stores/themeStore";
import { useTranslation } from "@/stores/translationStore";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MealDetailScreen = () => {
	const { "meal-id": mealId } = useLocalSearchParams<{ "meal-id": string }>();
	const theme = useTheme();
	const { t, language } = useTranslation();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const isArabic = language === "ar";

	const { meals, setSelectedMeal, selectedMeal, deleteMeal } = useMealStore();
	const [loading, setLoading] = useState(false);

	// Animation values
	const scrollY = useSharedValue(0);
	const deletePressed = useSharedValue(0);
	const editPressed = useSharedValue(0);
	const imageHeight = theme.sizes.mealImageHeight * 1.1;
	const headerHeight = 54 + (insets.top || 0);

	React.useEffect(() => {
		if (mealId) setSelectedMeal(mealId);
	}, [mealId, setSelectedMeal]);

	const meal = selectedMeal || meals.find((m) => m.id === mealId);

	if (!meal) {
		return (
			<Box flex={1} center bg="background" padding="lg">
				<Text>Meal not found</Text>
			</Box>
		);
	}

	// Actions
	const triggerHaptic = () =>
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

	const handleEdit = () => {
		triggerHaptic();
		router.push(`/meals/${meal.id}`);
	};

	const handleDelete = () => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
		setLoading(true);
		setTimeout(() => {
			deleteMeal(meal.id);
			setLoading(false);
			router.back();
		}, 500);
	};

	// Icon mappings
	const periodIcons = {
		Breakfast: "cafe-outline",
		Lunch: "restaurant-outline",
		Dinner: "fast-food-outline",
	};

	// Gesture handlers
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	// Tap gestures
	const tapEdit = Gesture.Tap()
		.onBegin(() => {
			editPressed.value = withTiming(1, { duration: 100 });
			runOnJS(triggerHaptic)();
		})
		.onFinalize(() => {
			editPressed.value = withTiming(0, { duration: 200 });
			runOnJS(handleEdit)();
		});

	const tapDelete = Gesture.Tap()
		.onBegin(() => {
			deletePressed.value = withTiming(1, { duration: 100 });
			runOnJS(triggerHaptic)();
		})
		.onFinalize(() => {
			deletePressed.value = withTiming(0, { duration: 200 });
			runOnJS(handleDelete)();
		});

	// Animated styles
	const imageAnimatedStyle = useAnimatedStyle(() => {
		const translateY = interpolate(
			scrollY.value,
			[-imageHeight, 0, imageHeight],
			[-imageHeight / 2, 0, imageHeight / 4],
			Extrapolation.CLAMP,
		);

		const scale = interpolate(
			scrollY.value,
			[-imageHeight, 0, imageHeight],
			[1.3, 1, 1],
			Extrapolation.CLAMP,
		);

		return {
			transform: [{ translateY }, { scale }],
			height: imageHeight,
		};
	});

	const headerOpacityStyle = useAnimatedStyle(() => ({
		opacity: interpolate(scrollY.value, [-50, 0], [0, 1], Extrapolation.CLAMP),
	}));

	const headerBgStyle = useAnimatedStyle(() => {
		const opacity = interpolate(
			scrollY.value,
			[0, headerHeight],
			[0, 1],
			Extrapolation.CLAMP,
		);

		return {
			opacity,
			backgroundColor: theme.colors.background,
		};
	});

	const editButtonStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: withSpring(editPressed.value === 1 ? 0.95 : 1, {
					damping: theme.animations.spring.damping.light,
				}),
			},
		],
		backgroundColor: withTiming(
			editPressed.value === 1 ? theme.colors.primaryDark : theme.colors.primary,
		),
	}));

	const deleteButtonStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: withSpring(deletePressed.value === 1 ? 0.95 : 1, {
					damping: theme.animations.spring.damping.light,
				}),
			},
		],
		borderColor: withTiming(
			deletePressed.value === 1
				? theme.colors.error
				: `${theme.colors.error}99`,
		),
		backgroundColor: withTiming(
			deletePressed.value === 1 ? `${theme.colors.error}22` : "transparent",
		),
	}));

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
				<StatusBar
					translucent
					backgroundColor="transparent"
					barStyle="light-content"
				/>
				<Stack.Screen options={{ headerShown: false }} />

				{/* Floating header background */}
				<Animated.View
					style={[
						{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							height: headerHeight,
							zIndex: 10,
						},
						headerBgStyle,
					]}
				/>

				{/* Back button */}
				<Pressable
					style={{
						position: "absolute",
						top: insets.top || theme.spacing.lg,
						left: theme.spacing.md,
						zIndex: 20,
						width: 40,
						height: 40,
						backgroundColor: "rgba(0,0,0,0.5)",
						borderRadius: 20,
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={() => router.back()}
				>
					<Ionicons
						name={isArabic ? "chevron-forward" : "chevron-back"}
						size={24}
						color="#fff"
					/>
				</Pressable>

				{/* Background for overscroll */}
				<Animated.View
					style={[
						{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							height: imageHeight,
							backgroundColor: theme.colors.background,
							zIndex: -1,
						},
						headerOpacityStyle,
					]}
				/>

				{/* Main content */}
				<Animated.ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{
						paddingBottom: insets.bottom + theme.spacing.xxl,
					}}
					showsVerticalScrollIndicator={false}
					scrollEventThrottle={16}
					onScroll={scrollHandler}
					bounces={true}
					overScrollMode="always"
				>
					{/* Meal Image with Parallax */}
					<Animated.View
						style={[
							{
								position: "relative",
								overflow: "hidden",
								backgroundColor: theme.colors.background,
							},
							imageAnimatedStyle,
						]}
					>
						<Animated.Image
							source={{
								uri:
									meal.image ||
									"https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
							}}
							style={{
								width: "100%",
								height: "100%",
								position: "absolute",
								top: 0,
								left: 0,
							}}
							resizeMode="cover"
							entering={FadeIn.duration(300)}
						/>

						{/* Gradient overlay */}
						<Box
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								backgroundImage:
									"linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.7) 100%)",
							}}
						/>

						{/* Content at bottom of image */}
						<Box
							style={{
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								padding: theme.spacing.lg,
								paddingBottom: theme.spacing.xl,
							}}
						>
							<Animated.View entering={FadeInUp.duration(400).delay(200)}>
								<Text
									variant="xxxl"
									weight="bold"
									color="#fff"
									marginBottom="xs"
								>
									{isArabic && meal.name_ar ? meal.name_ar : meal.name}
								</Text>

								<Box row justifyContent="space-between" alignItems="center">
									<Box row gap="md" flex={1}>
										<Box row alignItems="center">
											<Box
												width={32}
												height={32}
												rounded="xs"
												bg="overlayMedium"
												alignItems="center"
												justifyContent="center"
												marginEnd="xs"
											>
												<Ionicons
													name="flame-outline"
													size={theme.sizes.iconSm}
													color="#fff"
												/>
											</Box>
											<Text color="#fff" weight="medium">
												{meal.calories} cal
											</Text>
										</Box>

										<Box row alignItems="center">
											<Box
												width={32}
												height={32}
												rounded="xs"
												bg="overlayMedium"
												alignItems="center"
												justifyContent="center"
												marginEnd="xs"
											>
												<Ionicons
													name="time-outline"
													size={theme.sizes.iconSm}
													color="#fff"
												/>
											</Box>
											<Text color="#fff" weight="medium">
												{meal.prepTime} min
											</Text>
										</Box>

										<Box row alignItems="center">
											<Box
												width={32}
												height={32}
												rounded="xs"
												bg="overlayMedium"
												alignItems="center"
												justifyContent="center"
												marginEnd="xs"
											>
												<Ionicons
													name={periodIcons[meal.period] as any}
													size={theme.sizes.iconSm}
													color="#fff"
												/>
											</Box>
											<Text color="#fff" weight="medium">
												{t(`periods.${meal.period.toLowerCase()}`)}
											</Text>
										</Box>
									</Box>

									<Box
										bg={meal.available ? "primaryLight" : "overlayMedium"}
										paddingHorizontal="md"
										paddingVertical="xs"
										rounded="sm"
									>
										<Text
											color={meal.available ? "primary" : "#fff"}
											weight="semibold"
											variant="sm"
										>
											{meal.available
												? t("meals.available")
												: t("meals.unavailable")}
										</Text>
									</Box>
								</Box>
							</Animated.View>
						</Box>
					</Animated.View>

					<Animated.View
						entering={FadeInUp.delay(200).duration(500)}
						style={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}
					>
						{/* Price Card */}
						<Card padding="lg" rounded="md" elevation="small">
							<Box row justifyContent="space-between" alignItems="center">
								<Box>
									<Text variant="sm" color="textSecondary" marginBottom="xs">
										{t("meals.price")}
									</Text>
									<Text variant="xxl" weight="bold" color="primary">
										${meal.price.toFixed(2)}
									</Text>
								</Box>
								{meal.featured && (
									<Box
										bg="primaryLight"
										paddingHorizontal="md"
										paddingVertical="xs"
										rounded="sm"
										row
										alignItems="center"
										gap="xs"
									>
										<Ionicons
											name="star"
											size={theme.sizes.iconXs}
											color={theme.colors.primary}
										/>
										<Text color="primary" weight="semibold" variant="sm">
											{t("meals.featured")}
										</Text>
									</Box>
								)}
							</Box>
						</Card>

						{/* Description Card */}
						<Card padding="lg" rounded="md" elevation="small">
							<Text variant="lg" weight="semibold" marginBottom="sm">
								{t("meals.description")}
							</Text>
							<Text color="textSecondary" style={{ lineHeight: 22 }}>
								{isArabic && meal.description_ar
									? meal.description_ar
									: meal.description}
							</Text>
						</Card>

						{/* Settings Card */}
						<Card padding="lg" rounded="md" elevation="small">
							<Text variant="lg" weight="semibold" marginBottom="md">
								{t("common.settings")}
							</Text>
							<Box gap="md">
								<SwitchField
									value={meal.available}
									onValueChange={() => {
										triggerHaptic();
										console.log("Toggle availability for", meal.id);
									}}
									label={
										meal.available
											? t("meals.available")
											: t("meals.unavailable")
									}
									description={
										meal.available
											? t("meals.availableDesc")
											: t("meals.unavailableDesc")
									}
									leftIcon={
										meal.available
											? "checkmark-circle-outline"
											: "close-circle-outline"
									}
								/>
								<SwitchField
									value={meal.featured}
									onValueChange={() => {
										triggerHaptic();
										console.log("Toggle featured for", meal.id);
									}}
									label={t("meals.featured")}
									description={t("meals.featuredDesc")}
									leftIcon="star-outline"
								/>
								{meal.isVegan && (
									<SwitchField
										value={meal.isVegan}
										onValueChange={() => {}}
										label="Vegan"
										description="This meal contains no animal products"
										leftIcon="leaf-outline"
										disabled
									/>
								)}
							</Box>
						</Card>

						{/* Action Buttons with Gesture Detection */}
						<Box gap="md" marginTop="md">
							<GestureDetector gesture={tapEdit}>
								<Animated.View
									style={[
										{
											height: theme.sizes.buttonLg,
											borderRadius: theme.radius.button,
											backgroundColor: theme.colors.primary,
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
											width: "100%",
										},
										editButtonStyle,
									]}
								>
									<Ionicons
										name="create-outline"
										size={theme.sizes.iconMd}
										color={theme.colors.background}
										style={{ marginRight: 8 }}
									/>
									<Text variant="md" weight="medium" color="background">
										{t("common.edit")}
									</Text>
								</Animated.View>
							</GestureDetector>

							<GestureDetector gesture={tapDelete}>
								<Animated.View
									style={[
										{
											height: theme.sizes.buttonLg,
											borderRadius: theme.radius.button,
											borderWidth: 1,
											borderColor: `${theme.colors.error}99`,
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
											width: "100%",
										},
										deleteButtonStyle,
									]}
								>
									<Ionicons
										name="trash-outline"
										size={theme.sizes.iconMd}
										color={theme.colors.error}
										style={{ marginRight: 8 }}
									/>
									<Text variant="md" weight="medium" color="error">
										{t("common.delete")}
									</Text>
								</Animated.View>
							</GestureDetector>
						</Box>
					</Animated.View>
				</Animated.ScrollView>
			</View>
		</GestureHandlerRootView>
	);
};

export default MealDetailScreen;

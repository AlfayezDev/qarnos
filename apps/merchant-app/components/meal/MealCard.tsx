import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	FadeIn,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { Box, Text } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { Meal } from "@/types";
import { useTheme } from "@/stores/themeStore";
import { useTranslation } from "@/stores/translationStore";

interface MealCardProps {
	item: Meal;
}

const MealCard = ({ item }: MealCardProps) => {
	const theme = useTheme();
	const { language } = useTranslation();
	const isArabic = language === "ar";
	const pressed = useSharedValue(0);

	const handlePressIn = () => {
		pressed.value = withTiming(1, {
			duration: theme.animations.duration.fast,
		});
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const handlePressOut = () => {
		pressed.value = withTiming(0, {
			duration: theme.animations.duration.medium,
		});
	};

	const cardAnimatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: withSpring(
					pressed.value === 1 ? theme.animations.scale.pressed : 1,
					{ damping: theme.animations.spring.damping.light },
				),
			},
		],
	}));

	return (
		<Animated.View
			layout={LinearTransition.springify().damping(
				theme.animations.spring.damping.light,
			)}
			entering={FadeIn.duration(theme.animations.duration.slow)}
			style={cardAnimatedStyle}
		>
			<Link asChild href={`/meals/${item.id}`}>
				<Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
					<Card
						elevation="small"
						style={{
							overflow: "hidden",
							marginBottom: theme.spacing.md,
							marginHorizontal: theme.spacing.xs,
						}}
					>
						{item.image && (
							<Animated.Image
								source={{ uri: item.image }}
								style={{
									height: theme.sizes.mealCardImageHeight - 20,
									width: "100%",
									borderTopLeftRadius: theme.radius.md,
									borderTopRightRadius: theme.radius.md,
								}}
								resizeMode="cover"
							/>
						)}
						<Box padding="md" gap="xs" alignItems="flex-start">
							<Text variant="lg" weight="medium">
								{isArabic && item.name_ar ? item.name_ar : item.name}
							</Text>
							<Text
								variant="sm"
								color="textSecondary"
								marginBottom="sm"
								numberOfLines={2}
								style={{ lineHeight: 20 }}
							>
								{isArabic && item.description_ar
									? item.description_ar
									: item.description}
							</Text>
						</Box>
					</Card>
				</Pressable>
			</Link>
		</Animated.View>
	);
};

export default MealCard;

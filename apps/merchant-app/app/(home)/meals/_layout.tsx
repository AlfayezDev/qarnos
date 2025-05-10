import { useTranslation } from "@/stores/translationStore";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function MealLayout() {
	const { t } = useTranslation();
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: t("meals.title"),
					headerTransparent: true,
					headerLargeTitleShadowVisible: false,
					headerLargeStyle: {
						backgroundColor: "transparent",
					},
					headerTitleStyle: {},
					headerSearchBarOptions: {
						shouldShowHintSearchIcon: true,
						textAlign: "right",
					},
					headerLargeTitle: true,
					headerShadowVisible: false,
				}}
			/>

			<Stack.Screen
				name="[meal-id]"
				options={{
					title: "Hello",
					headerTransparent: true,
					headerLargeTitleShadowVisible: false,
					headerLargeStyle: {
						backgroundColor: "transparent",
					},
					headerLargeTitle: true,
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
}

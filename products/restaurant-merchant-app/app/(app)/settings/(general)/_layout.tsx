import { Link, Stack } from "expo-router";
import { Platform } from "react-native";

import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { COLORS } from "@/theme/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export default function GeneralSettingsLayout() {
	const { colorScheme } = useColorScheme();
	return (
		<>
			<Stack.Screen
				options={{
					title: "Overview",
					headerRight: () => (
						<Link asChild href="/settings/(general)/edit">
							<Button variant="plain" className="ios:px-0 ios:lg:px-4">
								<Text className="text-primary">Edit</Text>
							</Button>
						</Link>
					),

					headerStyle: { backgroundColor: COLORS[colorScheme].background },
				}}
			/>
			<Stack screenOptions={SCREEN_OPTIONS}>
				<Stack.Screen name="index" options={SCREEN_OPTIONS} />
				<Stack.Screen name="edit" options={MODAL_OPTIONS} />
			</Stack>
		</>
	);
}

const SCREEN_OPTIONS = {
	headerShown: false,
	animation: "ios",
} as const;

const MODAL_OPTIONS = {
	presentation: "modal",
	animation: "ios",
	headerShown: Platform.OS === "ios",
	headerShadowVisible: false,
} as const;

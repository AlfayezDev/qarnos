import { Link, Stack } from "expo-router";
import { Platform } from "react-native";

import { Button } from "@/components/Button";
import { Text } from "@/components/Text";

export default function GeneralSettingsLayout() {
	return (
		<Stack screenOptions={SCREEN_OPTIONS}>
			<Stack.Screen name="index" options={SCREEN_OPTIONS} />
			<Stack.Screen name="full-name" options={LOGIN_MODAL_OPTIONS} />
		</Stack>
	);
}

const SCREEN_OPTIONS = {
	headerShown: false,
	animation: "ios",
} as const;

const LOGIN_MODAL_OPTIONS = {
	presentation: "modal",
	animation: "ios",
	headerShown: false,
} as const;

const CREATE_ACCOUNT_MODAL_OPTIONS = {
	presentation: "modal",
	animation: "ios",
	headerShown: Platform.OS === "ios",
	headerShadowVisible: false,
	headerLeft() {
		return (
			<Link asChild href="..">
				<Button variant="plain" className="ios:px-0">
					<Text className="text-primary">Cancel</Text>
				</Button>
			</Link>
		);
	},
} as const;

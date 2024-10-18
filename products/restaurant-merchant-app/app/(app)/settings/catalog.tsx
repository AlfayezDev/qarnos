import { Stack } from "expo-router";
import { CustomDrawerContent } from "./_layout";

export default function CatalogScreen() {
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: false,
					title: "back",
				}}
			/>
			<CustomDrawerContent isStack />
		</>
	);
}

import { Tabs } from "@/components/ui";
import { useTranslation } from "@/stores/translationStore";
import { Period } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MealLayout() {
	const PeriodsTab = () => {
		const { t } = useTranslation();
		const insets = useSafeAreaInsets();
		const tabParam = useLocalSearchParams<{ tab: Period }>().tab ?? "breakfast";
		const [tab, setTab] = useState<string>(tabParam);
		const route = useRouter();
		return (
			<View style={{ paddingTop: insets.top }}>
				<Tabs
					tabs={["breakfast", "lunch", "dinner"]}
					selectedTab={tab.toLowerCase()}
					onSelectTab={(tab) => {
						setTab(tab.toLowerCase());
						route.setParams({
							tab: tab.toLowerCase(),
						});
					}}
					labelRender={(tab) => t(`periods.${tab.toLowerCase()}`)}
				/>
			</View>
		);
	};
	return (
		<Stack>
			<Stack.Screen
				name="index"
				initialParams={{
					tab: "breakfast",
				}}
				options={{
					headerTransparent: true,
					header: PeriodsTab,
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
					// Hide small header shadow for continuous blur
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
}

import { Tabs } from "@/components/BottomTabs";
import { BookIcon, CogIcon, HouseIcon, ReceiptIcon } from "lucide-react-native";
import { auth$ } from "@/state/auth";
import { Redirect } from "expo-router";
import { TabBarIcon } from "@/components/BottomTabs/TabBarIcon";

export default function AppLayout() {
	const isAuthenticated = auth$.isAuthenticated.get();
	if (!isAuthenticated) return <Redirect href="/auth" />;
	return (
		//@ts-ignore
		<Tabs sidebarAdaptable>
			<Tabs.Screen
				name="(home)"
				options={{
					lazy: false,
					headerShown: false,
					title: "Home",
					tabBarIcon: ({ color }) =>
						TabBarIcon({
							ios: "house",
							android: HouseIcon,
							color: color,
						}),
				}}
			/>
			<Tabs.Screen
				name="(orders)"
				options={{
					lazy: false,
					headerShown: false,
					title: "Orders",
					tabBarBadge: "10",
					tabBarIcon: ({ color }) =>
						TabBarIcon({
							ios: "storefront",
							android: ReceiptIcon,
							color: color,
						}),
				}}
			/>
			<Tabs.Screen
				name="(products)"
				options={{
					lazy: false,
					headerShown: false,
					title: "Products",
					tabBarIcon: ({ color }) =>
						TabBarIcon({
							ios: "menucard",
							android: BookIcon,
							color: color,
						}),
				}}
			/>
			<Tabs.Screen
				name="(settings)"
				options={{
					lazy: false,
					headerShown: false,
					title: "settings",
					tabBarIcon: ({ color }) =>
						TabBarIcon({
							ios: "gear",
							android: CogIcon,
							color: color,
						}),
				}}
			/>
		</Tabs>
	);
}

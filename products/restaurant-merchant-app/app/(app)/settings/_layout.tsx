import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
	useWindowDimensions,
	Linking,
	Platform,
	View,
	Alert,
} from "react-native";
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from "@react-navigation/drawer";
import {
	CogIcon,
	DoorOpen,
	SpeechIcon,
	UsersIcon,
	Quote,
	CreditCardIcon,
	LucideIcon,
} from "lucide-react-native";
import { Avatar, AvatarFallback } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { cn } from "@/lib/cn";
import { auth$ } from "@/state/auth";
import { resetNavigator } from "@/lib/navigation";
import { Href, Stack, useNavigation, useRouter } from "expo-router";
const items: { name: string; icon: LucideIcon; title: string; href: Href }[] = [
	{
		name: "(general)",
		icon: CogIcon,
		title: "Overview",
		href: "/(app)/settings/(general)",
	},
	{
		name: "team",
		icon: UsersIcon,
		title: "Team",
		href: "/(app)/settings/team",
	},
	{
		name: "billing",
		icon: CreditCardIcon,
		title: "Billing",
		href: "/(app)/settings/billing",
	},
];
export function CustomDrawerContent(
	props: DrawerContentComponentProps | { isStack: boolean },
) {
	const state = "isStack" in props ? undefined : props.state;
	const descriptors = "isStack" in props ? undefined : props.descriptors;
	const user = auth$.user.peek();
	const navigation = useNavigation();
	const router = useRouter();
	const focusedRoute = state?.routes[state.index];
	const focusedDescriptor = focusedRoute && descriptors?.[focusedRoute?.key];
	const focusedOptions = focusedDescriptor?.options;

	return (
		<DrawerContentScrollView
			style={{ height: "100%", flex: 1 }}
			className={"bg-background"}
		>
			<View className="ios:pb-8 items-center pb-4  pt-8">
				<Avatar alt={user?.username ?? ""} className="h-24 w-24">
					<AvatarFallback>
						<Text
							variant="largeTitle"
							className={cn(
								"dark:text-background font-medium text-white",
								Platform.OS === "ios" && "dark:text-foreground",
							)}
						>
							{user?.username[0]}
						</Text>
					</AvatarFallback>
				</Avatar>
				<View className="p-1" />
				<Text variant="title1">{user?.username}</Text>
				<Text className="text-muted-foreground">{user?.email}</Text>
			</View>
			{items.map((item) => {
				const focused = item.name === focusedRoute?.name;
				return (
					<DrawerItem
						key={item.name}
						label={item.title}
						focused={focused}
						activeTintColor={focusedOptions?.drawerActiveTintColor}
						inactiveTintColor={focusedOptions?.drawerInactiveTintColor}
						activeBackgroundColor={focusedOptions?.drawerActiveBackgroundColor}
						inactiveBackgroundColor={
							focusedOptions?.drawerInactiveBackgroundColor
						}
						onPress={() => router.push(item.href)}
						to={item.href.toString()}
						icon={(p) => <item.icon color={p.color} />}
					/>
				);
			})}
			<DrawerItem
				label="Support"
				onPress={() => Linking.openURL("https://qarnos.com")}
				icon={(p) => <SpeechIcon color={p.color} />}
			/>
			<DrawerItem
				label="About Qarnos"
				onPress={() => Linking.openURL("https://mywebsite.com")}
				icon={(p) => <Quote color={p.color} />}
			/>
			<DrawerItem
				label="Logout"
				inactiveTintColor="red"
				onPress={() => {
					Alert.alert("Logging out", "Are you sure?", [
						{
							text: "Cancel",
							isPreferred: true,
						},
						{
							text: "Sign out",
							style: "destructive",
							onPress: () => {
								auth$.delete();
								//@ts-ignore
								navigation.reset(resetNavigator(navigation));
							},
						},
					]);
				}}
				icon={(p) => <DoorOpen color={p.color} />}
			/>
		</DrawerContentScrollView>
	);
}
export default function SettingsLayout() {
	const dimensions = useWindowDimensions();

	const isLargeScreen = dimensions.width >= 768;
	if (isLargeScreen)
		return (
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Drawer
					defaultStatus="open"
					drawerContent={CustomDrawerContent}
					screenOptions={{
						drawerType: "permanent",
						drawerStyle: null,
						headerLeftLabelVisible: false,
						headerLeft: () => <></>,
					}}
				>
					{items.map((item) => (
						<Drawer.Screen
							name={item.name}
							key={item.name}
							options={{
								drawerLabel: item.title,
								title: item.title,
								drawerIcon: (props) => <item.icon color={props.color} />,
								headerLeftLabelVisible: false,
								// headerShown: false,
							}}
						/>
					))}
				</Drawer>
			</GestureHandlerRootView>
		);
	return (
		<Stack initialRouteName="catalog">
			{items.map((item) => (
				<Stack.Screen
					name={item.name}
					key={item.name}
					options={{
						title: item.title,
						headerTitleStyle: {
							fontWeight: "bold",
						},
						headerBackTitleVisible: false,
					}}
				/>
			))}
		</Stack>
	);
}

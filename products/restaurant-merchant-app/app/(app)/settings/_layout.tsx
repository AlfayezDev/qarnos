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
	DrawerItemList,
} from "@react-navigation/drawer";
import {
	CogIcon,
	DoorOpen,
	SpeechIcon,
	UsersIcon,
	Quote,
	CreditCardIcon,
} from "lucide-react-native";
import { Avatar, AvatarFallback } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { cn } from "@/lib/cn";
import { auth$ } from "@/state/auth";
import { resetNavigator } from "@/lib/navigation";
import { Stack } from "expo-router";
function CustomDrawerContent(props: DrawerContentComponentProps) {
	const user = auth$.user.peek();
	return (
		<DrawerContentScrollView {...props} style={{ height: "100%", flex: 1 }}>
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
			<DrawerItemList {...props} />
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
								props.navigation.reset(resetNavigator(props.navigation));
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
					}}
				>
					<Drawer.Screen
						name="(general)"
						options={{
							drawerLabel: "General",
							title: "General",
							drawerIcon: (props) => <CogIcon color={props.color} />,
							headerShown: false,
							headerTitleStyle: {
								fontWeight: "bold",
							},
						}}
					/>
					<Drawer.Screen
						name="team"
						options={{
							drawerLabel: "Team",
							title: "Team",
							drawerIcon: (props) => <UsersIcon color={props.color} />,
							headerShown: false,
							headerTitleStyle: {
								fontWeight: "bold",
							},
						}}
					/>
					<Drawer.Screen
						name="billing"
						options={{
							drawerLabel: "Billing",
							title: "Billing",
							drawerIcon: (props) => <CreditCardIcon color={props.color} />,
							headerShown: false,
							headerTitleStyle: {
								fontWeight: "bold",
							},
						}}
					/>
				</Drawer>
			</GestureHandlerRootView>
		);
	return (
		<Stack initialRouteName="catalog">
			<Stack.Screen
				name="catalog"
				options={{
					title: "catalog",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>

			<Stack.Screen
				name="(general)"
				options={{
					title: "General",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="team"
				options={{
					title: "Team",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="billing"
				options={{
					title: "Billing",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
		</Stack>
	);
}

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
function CustomDrawerContent(props: DrawerContentComponentProps) {
	return (
		<DrawerContentScrollView {...props} style={{ height: "100%", flex: 1 }}>
			<View className="ios:pb-8 items-center pb-4  pt-8">
				<Avatar alt="" className="h-24 w-24">
					<AvatarFallback>
						<Text
							variant="largeTitle"
							className={cn(
								"dark:text-background font-medium text-white",
								Platform.OS === "ios" && "dark:text-foreground",
							)}
						>
							ZN
						</Text>
					</AvatarFallback>
				</Avatar>
				<View className="p-1" />
				<Text variant="title1">Zach Nugent</Text>
				<Text className="text-muted-foreground">@mrzachnugent</Text>
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
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer
				defaultStatus="open"
				drawerContent={CustomDrawerContent}
				screenOptions={{
					drawerType: isLargeScreen ? "permanent" : "back",
					drawerStyle: isLargeScreen ? null : { width: "100%" },
				}}
			>
				<Drawer.Screen
					name="index" // This is the name of the page and must match the url from root
					options={{
						drawerLabel: "Oreview",
						title: "overview",
						drawerIcon: (props) => <CogIcon color={props.color} />,
						headerShown: !isLargeScreen,
						headerTitleStyle: {
							fontWeight: "bold",
						},
					}}
				/>
				<Drawer.Screen
					name="team" // This is the name of the page and must match the url from root
					options={{
						drawerLabel: "Team",
						title: "Team",
						drawerIcon: (props) => <UsersIcon color={props.color} />,
						headerShown: !isLargeScreen,
						headerTitleStyle: {
							fontWeight: "bold",
						},
					}}
				/>
				<Drawer.Screen
					name="billing" // This is the name of the page and must match the url from root
					options={{
						drawerLabel: "Billing",
						title: "Billing",
						drawerIcon: (props) => <CreditCardIcon color={props.color} />,
						headerShown: !isLargeScreen,
						headerTitleStyle: {
							fontWeight: "bold",
						},
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
}

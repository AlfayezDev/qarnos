import { Avatar, AvatarFallback } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { cn } from "@/lib/cn";
import { resetNavigator } from "@/lib/navigation";
import { auth$ } from "@/state/auth";
import { DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from "expo-router";
import { DoorOpen, Quote, SpeechIcon } from "lucide-react-native";
import { Alert, Linking, Platform, View } from "react-native";

export default function CatalogScreen() {
	const navigation = useNavigation();
	const user = auth$.user.peek();
	return (
		<View style={{ height: "100%", flex: 1 }}>
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
		</View>
	);
}

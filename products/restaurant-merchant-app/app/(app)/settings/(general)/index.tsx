import { Icon } from "@roninoss/icons";
import { useNavigation, useRouter } from "expo-router";
import { Linking, Platform, View } from "react-native";
import { Button } from "@/components/Button";
import {
	ESTIMATED_ITEM_HEIGHT,
	List,
	ListItem,
	ListRenderItemInfo,
	ListSectionHeader,
} from "@/components/List";
import { Text } from "@/components/Text";
import { useColorScheme } from "@/lib/useColorScheme";
import { auth$ } from "@/state/auth";
import { resetNavigator } from "@/lib/navigation";

const ESTIMATED_ITEM_SIZE =
	ESTIMATED_ITEM_HEIGHT[Platform.OS === "ios" ? "titleOnly" : "withSubTitle"];
type DataItem =
	| string
	| {
			id: string;
			title: string;
			value?: string;
			subTitle?: string;
			onPress: () => void;
	  };
export default function Profile() {
	const user = auth$.user.get();
	const router = useRouter();
	return (
		<>
			<List
				variant="insets"
				data={[
					"Personal Information",
					{
						id: "0",
						title: "Full Name",
						...(Platform.OS === "ios"
							? { value: user?.username }
							: { subTitle: user?.username }),
						onPress: () => router.push("/settings/(general)/full-name"),
					},
					{
						id: "1",
						title: "Email",
						...(Platform.OS === "ios"
							? { value: user?.email }
							: { subTitle: user?.email }),
						onPress: () => Linking.openURL("https://nativewindui.com/"),
					},
				]}
				sectionHeaderAsGap={Platform.OS === "ios"}
				estimatedItemSize={ESTIMATED_ITEM_SIZE}
				renderItem={renderItem}
				ListFooterComponent={<ListFooterComponent />}
			/>
		</>
	);
}

function renderItem(info: ListRenderItemInfo<DataItem>) {
	return <Item info={info} />;
}

function Item({ info }: { info: ListRenderItemInfo<DataItem> }) {
	const { colors } = useColorScheme();

	if (typeof info.item === "string") {
		return <ListSectionHeader {...info} />;
	}
	return (
		<ListItem
			titleClassName="text-lg"
			rightView={
				<View className="flex-1 flex-row items-center gap-0.5 px-2">
					{!!info.item.value && (
						<Text className="text-muted-foreground">{info.item.value}</Text>
					)}
					<Icon name="chevron-right" size={22} color={colors.grey2} />
				</View>
			}
			onPress={info.item.onPress}
			{...info}
		/>
	);
}

function ListFooterComponent() {
	const navigator = useNavigation();
	return (
		<View className="ios:px-0 px-4 pt-8">
			<Button
				size="lg"
				variant={Platform.select({ ios: "primary", default: "secondary" })}
				className="border-border bg-card"
				onPress={() => {
					auth$.delete();
					resetNavigator(navigator);
				}}
			>
				<Text className="text-destructive">Delete Account</Text>
			</Button>
		</View>
	);
}

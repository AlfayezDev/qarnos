import { Platform, View } from "react-native";
import { Button } from "@/components/Button";
import {
	ESTIMATED_ITEM_HEIGHT,
	List,
	ListItem,
	ListRenderItemInfo,
	ListSectionHeader,
} from "@/components/List";
import { Text } from "@/components/Text";
import { auth$ } from "@/state/auth";
import { Avatar, AvatarFallback } from "@/components/Avatar";
import { cn } from "@/lib/cn";

const ESTIMATED_ITEM_SIZE =
	ESTIMATED_ITEM_HEIGHT[Platform.OS === "ios" ? "titleOnly" : "withSubTitle"];
type DataItem =
	| string
	| {
			id: string;
			title: string;
			value?: string;
			subTitle?: string;
	  };
export default function Profile() {
	const user = auth$.user.get();
	return (
		<>
			<List
				variant="insets"
				data={[
					"avatar",
					"Personal Information",
					{
						id: "0",
						title: "First Name",
						...(Platform.OS === "ios"
							? { value: user?.username }
							: { subTitle: user?.username }),
					},
					{
						id: "1",
						title: "Last Name",
						...(Platform.OS === "ios"
							? { value: user?.username }
							: { subTitle: user?.username }),
					},

					{
						id: "2",
						title: "Email",
						...(Platform.OS === "ios"
							? { value: user?.email }
							: { subTitle: user?.email }),
					},
				]}
				sectionHeaderAsGap={Platform.OS === "ios"}
				estimatedItemSize={ESTIMATED_ITEM_SIZE}
				renderItem={renderItem}
				ListFooterComponent={<ListFooterComponent />}
				contentContainerStyle={{}}
			/>
		</>
	);
}

function renderItem(info: ListRenderItemInfo<DataItem>) {
	return <Item info={info} />;
}

function Item({ info }: { info: ListRenderItemInfo<DataItem> }) {
	if (typeof info.item === "string") {
		if (info.item === "avatar")
			return (
				<Avatar alt={""} className="h-48 w-48 self-center mt-14">
					<AvatarFallback>
						<Text
							variant="largeTitle"
							className={cn(
								"dark:text-background font-medium text-white",
								Platform.OS === "ios" && "dark:text-foreground",
							)}
						>
							M
						</Text>
					</AvatarFallback>
				</Avatar>
			);
		return <ListSectionHeader {...info} />;
	}
	return (
		<ListItem
			titleClassName="text-lg"
			rightView={
				<View className="flex-1 flex-row items-center gap-0.5 px-4">
					{!!info.item.value && (
						<Text className="text-muted-foreground">{info.item.value}</Text>
					)}
				</View>
			}
			{...info}
		/>
	);
}

function ListFooterComponent() {
	return (
		<View className="ios:px-0 px-4 pt-8">
			<Button
				size="lg"
				variant={Platform.select({ ios: "primary", default: "secondary" })}
				className="border-border bg-card"
			>
				<Text className="text-destructive">Delete Account</Text>
			</Button>
		</View>
	);
}

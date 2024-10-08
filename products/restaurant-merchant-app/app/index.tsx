import { useHeaderHeight } from "@react-navigation/elements";
import { Icon } from "@roninoss/icons";
import { FlashList } from "@shopify/flash-list";
import { cssInterop } from "nativewind";
import * as React from "react";
import {
	Button as RNButton,
	ButtonProps,
	Linking,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/Text";
import { useColorScheme } from "@/lib/useColorScheme";

cssInterop(FlashList, {
	className: "style",
	contentContainerClassName: "contentContainerStyle",
});

function DefaultButton({ color, ...props }: ButtonProps) {
	const { colors } = useColorScheme();
	return <RNButton color={color ?? colors.primary} {...props} />;
}

export default function Screen() {
	return (
		<FlashList
			contentInsetAdjustmentBehavior="automatic"
			keyboardShouldPersistTaps="handled"
			data={COMPONENTS}
			estimatedItemSize={200}
			contentContainerClassName="py-4"
			keyExtractor={keyExtractor}
			ItemSeparatorComponent={renderItemSeparator}
			renderItem={renderItem}
			ListEmptyComponent={
				COMPONENTS.length === 0 ? ListEmptyComponent : undefined
			}
		/>
	);
}

function ListEmptyComponent() {
	const insets = useSafeAreaInsets();
	const dimensions = useWindowDimensions();
	const headerHeight = useHeaderHeight();
	const { colors } = useColorScheme();
	const height = dimensions.height - headerHeight - insets.bottom - insets.top;

	return (
		<View
			testID="test"
			id="test"
			nativeID="test"
			style={{ height }}
			className="flex-1 items-center justify-center gap-1 px-12"
		>
			<Icon name="file-plus-outline" size={42} color={colors.grey} />
			<Text variant="title3" className="pb-1 text-center font-semibold">
				No Components Installed
			</Text>
			<Text color="tertiary" variant="subhead" className="pb-4 text-center">
				You can install any of the free components from the{" "}
				<Text
					onPress={() => Linking.openURL("https://nativewindui.com")}
					variant="subhead"
					className="text-primary"
				>
					NativeWindUI
				</Text>
				{" website."}
			</Text>
		</View>
	);
}

type ComponentItem = { name: string; component: React.FC };

function keyExtractor(item: ComponentItem) {
	return item.name;
}

function renderItemSeparator() {
	return <View className="p-2" />;
}

function renderItem({ item }: { item: ComponentItem }) {
	return (
		<Card title={item.name}>
			<item.component />
		</Card>
	);
}

function Card({
	children,
	title,
}: { children: React.ReactNode; title: string }) {
	return (
		<View className="px-4">
			<View className="gap-4 rounded-xl border border-border bg-card p-4 pb-6 shadow-sm shadow-black/10 dark:shadow-none">
				<Text className="text-center text-sm font-medium tracking-wider opacity-60">
					{title}
				</Text>
				{children}
			</View>
		</View>
	);
}

const COMPONENTS: ComponentItem[] = [];

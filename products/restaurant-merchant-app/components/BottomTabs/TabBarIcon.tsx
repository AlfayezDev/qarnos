import { LucideIcon } from "lucide-react-native";
import { Platform } from "react-native";

const isAndroid = Platform.OS === "android";
export const TabBarIcon = (props: {
	ios: string;
	android: LucideIcon;
	color: string;
}) =>
	(isAndroid ? (
		<props.android color={props.color} />
	) : (
		{ sfSymbol: props.ios }
	)) as JSX.Element;

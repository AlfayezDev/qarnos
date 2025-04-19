import { Platform } from "react-native";
import { DefaultTheme } from "@react-navigation/native";

export const platform = {
	topInset: Platform.OS === "ios" ? (DefaultTheme.dark ? 44 : 50) : 16,
	bottomInset: Platform.OS === "ios" ? 34 : 16,
	isIOS: Platform.OS === "ios",
	isAndroid: Platform.OS === "android",
};

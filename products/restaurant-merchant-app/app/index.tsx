import { Button } from "@/components/Button";
import { MoonIcon, SunIcon } from "lucide-react-native";
import { Text } from "@/components/Text";
import { UnistylesRuntime, createStyleSheet } from "react-native-unistyles";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback } from "react";
import { View } from "react-native";
import { useStyles } from "react-native-unistyles";

export default function Index() {
	const { theme, styles } = useStyles(stylesheet);

	const ThemeToggle = useCallback(() => {
		return (
			<Button
				buttonStyle={{ width: 48 }}
				onPress={() =>
					UnistylesRuntime.setTheme(
						UnistylesRuntime.themeName === "dark" ? "light" : "dark",
					)
				}
			>
				{UnistylesRuntime.themeName === "dark" ? (
					<SunIcon color={theme.colors.primaryForeground} />
				) : (
					<MoonIcon color={theme.colors.primaryForeground} />
				)}
			</Button>
		);
	}, [UnistylesRuntime.themeName]);
	const LocaleToggle = useCallback(() => {
		return (
			<Button buttonStyle={{ width: 48 }} variant="outline">
				E
			</Button>
		);
	}, []);
	return (
		<SafeAreaView
			style={[
				{
					flex: 1,
					backgroundColor: theme.colors.background,
					position: "relative",
					paddingTop: theme.space.md,
				},
			]}
		>
			<StatusBar />
			<View
				style={[
					{
						flex: 1,
						justifyContent: "space-between",
						paddingHorizontal: theme.space.md,
						marginBottom: theme.space.lg,
					},
					styles.container,
				]}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<ThemeToggle />
					<Text>Qarn</Text>
					<LocaleToggle />
				</View>
				<View style={{ gap: theme.space.xl, justifyContent: "center" }}>
					<Text variant="title">Try Qarn for free</Text>
					<Text variant="subtitle">The health restaurant platform</Text>
				</View>
				<View
					style={{
						gap: theme.space.sm,
					}}
				>
					<Button testID="register">Get started</Button>
					<Button testID="login" variant="outline">
						Log in
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
const stylesheet = createStyleSheet((theme) => ({
	container: {
		maxWidth: {
			md: theme.breakpoints.sm,
			lg: theme.breakpoints.md,
		},
		alignSelf: "center",
		width: "100%",
	},
}));

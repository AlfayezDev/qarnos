import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import React from "react";
import { View } from "react-native";
import { useStyles } from "react-native-unistyles";

export default function Index() {
	const { theme } = useStyles();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "space-around",
				alignItems: "center",
				paddingHorizontal: theme.space.lg,
				backgroundColor: theme.colors.background,
			}}
		>
			<Text>Qarn logo</Text>
			<Text>clip art</Text>
			<View style={{ gap: theme.space.xl, justifyContent: "center" }}>
				<Text variant="title">Try Qarn for free</Text>
				<Text variant="subtitle">The health restaurant platform</Text>
			</View>
			<View
				style={{
					gap: theme.space.sm,
					width: "100%",
				}}
			>
				<Button testID="started">Get started</Button>
				<Button variant="outline">Log in</Button>
			</View>
		</View>
	);
}

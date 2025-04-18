import React from "react";
import { StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
import { Text, Button } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

export default function NotFoundScreen() {
	const theme = useTheme();

	const handleGoHome = () => {
		router.replace("/");
	};

	return (
		<ScreenContainer scrollable={false} padded={false}>
			<Stack.Screen options={{ title: "Not Found", headerShown: false }} />

			<Animated.View
				style={[styles.container, { backgroundColor: theme.colors.background }]}
				entering={FadeIn.duration(300)}
				exiting={FadeOut.duration(200)}
			>
				<Ionicons
					name="alert-circle-outline"
					size={theme.sizes.iconLg * 2.5}
					color={theme.colors.textMuted}
					style={styles.icon}
				/>
				<Text variant="xxl" weight="bold" center marginBottom="sm">
					Oops! Page Not Found
				</Text>
				<Text variant="md" color="textSecondary" center marginBottom="xl">
					We can't seem to find the page you're looking for. It might have been
					moved or doesn't exist.
				</Text>
				<Button
					title="Go to Dashboard"
					onPress={handleGoHome}
					leftIcon="home-outline"
					size="lg"
				/>
			</Animated.View>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	icon: {
		marginBottom: 24,
	},
});

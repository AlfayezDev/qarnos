import { useTheme } from "@/stores/themeStore";
import { Screen } from "expo-router/build/views/Screen";
import React from "react";
import { RefreshControlProps, ScrollView, StatusBar, View } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";

interface ScreenContainerProps {
	children: React.ReactNode;
	scrollable?: boolean;
	screenOptions?: any;
	header?: React.ReactNode;
	padded?: boolean;
	refreshControl?: React.ReactElement<RefreshControlProps>;
	contentContainerStyle?: any;
	bottomInset?: boolean;
}

export const ScreenContainer = React.memo(
	({
		children,
		scrollable = true,
		screenOptions = { headerShown: false },
		header,
		padded = true,
		refreshControl,
		contentContainerStyle,
		bottomInset = true,
	}: ScreenContainerProps) => {
		const theme = useTheme();
		const insets = useSafeAreaInsets();

		const containerStyle = {
			flex: 1,
			backgroundColor: theme.colors.background,
		};

		const contentStyle = {
			flex: 1,
			paddingHorizontal: padded ? theme.spacing.screenPadding : 0,
		};

		const scrollContentStyle = {
			flexGrow: 1,
			paddingBottom: bottomInset
				? insets.bottom || theme.spacing.xl
				: theme.spacing.xl,
		};

		const Container = header ? View : SafeAreaView;

		return (
			<>
				<Screen options={screenOptions} />
				<StatusBar
					barStyle={theme.isDark ? "light-content" : "dark-content"}
					backgroundColor={theme.colors.background}
				/>
				<Container style={containerStyle}>
					{header}
					{scrollable ? (
						<ScrollView
							style={contentStyle}
							contentContainerStyle={[
								scrollContentStyle,
								contentContainerStyle,
							]}
							showsVerticalScrollIndicator={false}
							refreshControl={refreshControl}
							keyboardShouldPersistTaps="handled"
						>
							{children}
						</ScrollView>
					) : (
						<View style={contentStyle}>{children}</View>
					)}
				</Container>
			</>
		);
	},
);

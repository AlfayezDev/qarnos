import { useTheme } from "@/hooks/useTheme";
import { Screen } from "expo-router/build/views/Screen";
import React from "react";
import {
	RefreshControlProps,
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
} from "react-native";
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
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
	children,
	scrollable = true,
	screenOptions = { headerShown: false },
	header,
	padded = true,
	refreshControl,
	contentContainerStyle,
	bottomInset = true,
}) => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		content: {
			flex: 1,
			paddingHorizontal: padded ? theme.spacing.screenPadding : 0,
		},
		scrollContent: {
			flexGrow: 1,
			paddingBottom: bottomInset
				? insets.bottom || theme.spacing.xl
				: theme.spacing.xl,
		},
	});
	const Container = header ? View : SafeAreaView;
	return (
		<>
			<Screen options={screenOptions} />
			<StatusBar
				barStyle={theme.isDark ? "light-content" : "dark-content"}
				backgroundColor={theme.colors.background}
			/>
			<Container style={styles.container}>
				{header}
				{scrollable ? (
					<ScrollView
						style={styles.content}
						contentContainerStyle={[
							styles.scrollContent,
							contentContainerStyle,
						]}
						showsVerticalScrollIndicator={false}
						refreshControl={refreshControl}
						keyboardShouldPersistTaps="handled"
					>
						{children}
					</ScrollView>
				) : (
					<View style={styles.content}>{children}</View>
				)}
			</Container>
		</>
	);
};

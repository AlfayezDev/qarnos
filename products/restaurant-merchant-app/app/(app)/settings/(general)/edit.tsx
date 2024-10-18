import { Link, Stack, useRouter } from "expo-router";
import { Platform, View } from "react-native";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Form, FormItem, FormSection } from "@/components/Form";
import { TextField } from "@/components/TextField";
import {
	KeyboardAwareScrollView,
	KeyboardController,
} from "react-native-keyboard-controller";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, AvatarFallback } from "@/components/Avatar";
import { cn } from "@/lib/cn";
import { useColorScheme } from "@/lib/useColorScheme";
import { COLORS } from "@/theme/colors";

export default function SettingsOverview() {
	const insets = useSafeAreaInsets();
	const [focusedTextField, setFocusedTextField] = useState<
		"first-name" | "last-name" | "email" | null
	>(null);
	const router = useRouter();

	const { colorScheme, isDarkColorScheme } = useColorScheme();
	return (
		<>
			<Stack.Screen
				options={{
					headerLeft() {
						return (
							<Link asChild href="..">
								<Button variant="plain" className="ios:px-0">
									<Text className="text-primary">Cancel</Text>
								</Button>
							</Link>
						);
					},
					headerRight() {
						return (
							<Link asChild href="..">
								<Button variant="plain" className="ios:px-0">
									<Text className="text-gray-400">Done</Text>
								</Button>
							</Link>
						);
					},
					headerStyle: { backgroundColor: COLORS[colorScheme].background },
				}}
			/>
			<View
				className="ios:bg-background flex-1"
				style={{ paddingBottom: insets.bottom }}
			>
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
				<KeyboardAwareScrollView
					bottomOffset={Platform.select({ ios: 8 })}
					bounces={false}
					keyboardDismissMode="interactive"
					keyboardShouldPersistTaps="handled"
					contentContainerClassName="ios:pt-12 pt-20"
				>
					<View className="ios:px-0 flex-1 px-8">
						<View className="ios:pt-4 pt-6">
							<Form className="gap-2">
								<FormSection className="ios:bg-background">
									<FormItem>
										<TextField
											className="bg-card"
											placeholder={Platform.select({
												ios: "First Name",
												default: "",
											})}
											label={Platform.select({
												ios: undefined,
												default: "First Name",
											})}
											onSubmitEditing={() =>
												KeyboardController.setFocusTo("next")
											}
											blurOnSubmit={false}
											autoFocus
											onFocus={() => setFocusedTextField("first-name")}
											onBlur={() => setFocusedTextField(null)}
											textContentType="name"
											returnKeyType="next"
										/>
									</FormItem>
									<FormItem>
										<TextField
											className="bg-card"
											placeholder={Platform.select({
												ios: "Last Name",
												default: "",
											})}
											label={Platform.select({
												ios: undefined,
												default: "Last Name",
											})}
											onFocus={() => setFocusedTextField("last-name")}
											onBlur={() => setFocusedTextField(null)}
											textContentType="givenName"
											returnKeyType="next"
											blurOnSubmit={false}
											onSubmitEditing={() => {
												router.back();
											}}
										/>
									</FormItem>
									<FormItem>
										<TextField
											className="bg-card"
											placeholder={Platform.select({
												ios: "Email",
												default: "",
											})}
											label={Platform.select({
												ios: undefined,
												default: "Email",
											})}
											onFocus={() => setFocusedTextField("email")}
											onBlur={() => setFocusedTextField(null)}
											textContentType="emailAddress"
											returnKeyType="next"
											blurOnSubmit={false}
											onSubmitEditing={() => {
												router.back();
											}}
										/>
									</FormItem>
								</FormSection>
							</Form>
						</View>
					</View>
				</KeyboardAwareScrollView>
			</View>
		</>
	);
}

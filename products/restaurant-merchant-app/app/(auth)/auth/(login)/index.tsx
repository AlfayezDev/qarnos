import { Link, Stack, router } from "expo-router";
import * as React from "react";
import { Image, Platform, View } from "react-native";
import {
	KeyboardAwareScrollView,
	KeyboardController,
	KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Form, FormItem, FormSection } from "@/components/Form";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";
import { auth$ } from "@/state/auth";

const LOGO_SOURCE = {
	uri: "https://nativewindui.com/_next/image?url=/_next/static/media/logo.28276aeb.png&w=2048&q=75",
};

export default function LoginScreen() {
	const insets = useSafeAreaInsets();
	const [focusedTextField, setFocusedTextField] = React.useState<
		"email" | "password" | null
	>(null);
	return (
		<View
			className="ios:bg-card flex-1"
			style={{ paddingBottom: insets.bottom }}
		>
			<Stack.Screen
				options={{
					title: "Log in",
					headerShadowVisible: false,
					headerLeft() {
						return (
							<Link asChild href="/auth">
								<Button variant="plain" className="ios:px-0">
									<Text className="text-primary">Cancel</Text>
								</Button>
							</Link>
						);
					},
				}}
			/>
			<KeyboardAwareScrollView
				bottomOffset={Platform.select({ ios: 175 })}
				bounces={false}
				keyboardDismissMode="interactive"
				keyboardShouldPersistTaps="handled"
				contentContainerClassName="ios:pt-12 pt-20"
			>
				<View className="ios:px-12 flex-1 px-8">
					<View className="items-center pb-1">
						<Image
							source={LOGO_SOURCE}
							className="ios:h-12 ios:w-12 h-8 w-8"
							resizeMode="contain"
						/>
						<Text
							variant="title1"
							className="ios:font-bold pb-1 pt-4 text-center"
						>
							{Platform.select({ ios: "Welcome back!", default: "Log in" })}
						</Text>
						{Platform.OS !== "ios" && (
							<Text className="ios:text-sm text-muted-foreground text-center">
								Welcome back!
							</Text>
						)}
					</View>
					<View className="ios:pt-4 pt-6">
						<Form className="gap-2">
							<FormSection className="ios:bg-background">
								<FormItem>
									<TextField
										placeholder={Platform.select({ ios: "Email", default: "" })}
										label={Platform.select({
											ios: undefined,
											default: "Email",
										})}
										onSubmitEditing={() =>
											KeyboardController.setFocusTo("next")
										}
										blurOnSubmit={false}
										autoFocus
										onFocus={() => setFocusedTextField("email")}
										onBlur={() => setFocusedTextField(null)}
										keyboardType="email-address"
										textContentType="emailAddress"
										returnKeyType="next"
									/>
								</FormItem>
								<FormItem>
									<TextField
										placeholder={Platform.select({
											ios: "Password",
											default: "",
										})}
										label={Platform.select({
											ios: undefined,
											default: "Password",
										})}
										onFocus={() => setFocusedTextField("password")}
										onBlur={() => setFocusedTextField(null)}
										secureTextEntry
										returnKeyType="done"
										textContentType="password"
										onSubmitEditing={() => router.replace("/")}
									/>
								</FormItem>
							</FormSection>
							<View className="flex-row">
								<Link asChild href="/auth/(login)/forgot-password">
									<Button size="sm" variant="plain" className="px-0.5">
										<Text className="text-primary text-sm">
											Forgot password?
										</Text>
									</Button>
								</Link>
							</View>
						</Form>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<KeyboardStickyView
				offset={{
					closed: 0,
					opened: Platform.select({
						ios: insets.bottom + 30,
						default: insets.bottom,
					}),
				}}
			>
				{Platform.OS === "ios" ? (
					<View className=" px-12 py-4">
						<Button
							size="lg"
							onPress={() => {
								auth$.login("meme", "this");
							}}
						>
							<Text>Continue</Text>
						</Button>
					</View>
				) : (
					<View className="flex-row justify-between py-4 pl-6 pr-8">
						<Button
							variant="plain"
							className="px-2"
							onPress={() => {
								router.replace("/auth/(create-account)");
							}}
						>
							<Text className="text-primary px-0.5 text-sm">
								Create Account
							</Text>
						</Button>
						<Button
							onPress={() => {
								if (focusedTextField === "email") {
									KeyboardController.setFocusTo("next");
									return;
								}
								KeyboardController.dismiss();
								router.replace("/");
							}}
						>
							<Text className="text-sm">
								{focusedTextField === "email" ? "Next" : "Submit"}
							</Text>
						</Button>
					</View>
				)}
			</KeyboardStickyView>
			{Platform.OS === "ios" && (
				<Button
					variant="plain"
					onPress={() => {
						router.replace("/auth/(create-account)");
					}}
				>
					<Text className="text-primary text-sm">Create Account</Text>
				</Button>
			)}
		</View>
	);
}

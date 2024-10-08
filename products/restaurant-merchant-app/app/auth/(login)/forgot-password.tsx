import { Stack, router } from "expo-router";
import * as React from "react";
import { Image, Platform, View } from "react-native";
import {
	KeyboardAwareScrollView,
	KeyboardController,
	KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlertAnchor } from "@/components/Alert";
import { AlertRef } from "@/components/Alert/types";
import { Button } from "@/components/Button";
import { Form, FormItem, FormSection } from "@/components/Form";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";

const LOGO_SOURCE = {
	uri: "https://nativewindui.com/_next/image?url=/_next/static/media/logo.28276aeb.png&w=2048&q=75",
};

export default function ForgotPasswordScreen() {
	const insets = useSafeAreaInsets();
	const alertRef = React.useRef<AlertRef>(null);

	function onSubmit() {
		alertRef.current?.prompt({
			title: "Check your inbox",
			message: "We've sent you a code to reset your password. Enter it below:",
			prompt: {
				keyboardType: "number-pad",
				type: "plain-text",
			},
			buttons: [
				{
					text: "Cancel",
					style: "cancel",
					onPress: () => {
						KeyboardController.dismiss();
						router.replace("/");
					},
				},
				{
					text: "Submit",
					style: "default",
					onPress: () => {
						KeyboardController.dismiss();
						router.replace("/");
					},
				},
			],
		});
	}

	return (
		<View
			className="ios:bg-card flex-1"
			style={{ paddingBottom: insets.bottom }}
		>
			<Stack.Screen
				options={{
					title: "Forgot Password",
					headerShadowVisible: false,
				}}
			/>
			<KeyboardAwareScrollView
				bottomOffset={Platform.select({ ios: 8 })}
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
							{Platform.select({
								ios: "What's your email?",
								default: "Forgot password",
							})}
						</Text>
						{Platform.OS !== "ios" && (
							<Text className="ios:text-sm text-muted-foreground text-center">
								What's your email?
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
										onSubmitEditing={onSubmit}
										blurOnSubmit={false}
										autoFocus
										keyboardType="email-address"
										textContentType="emailAddress"
										returnKeyType="next"
									/>
								</FormItem>
							</FormSection>
						</Form>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
				{Platform.OS === "ios" ? (
					<View className=" px-12 py-4">
						<Button size="lg" onPress={onSubmit}>
							<Text>Submit</Text>
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
							<Text className="text-primary text-sm">Create Account</Text>
						</Button>
						<Button onPress={onSubmit}>
							<Text className="text-sm">Submit</Text>
						</Button>
					</View>
				)}
			</KeyboardStickyView>
			<AlertAnchor ref={alertRef} />
		</View>
	);
}

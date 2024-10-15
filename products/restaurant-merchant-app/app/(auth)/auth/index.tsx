import { Link } from "expo-router";
import * as React from "react";
import { Image, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertAnchor } from "@/components/Alert";
import { AlertRef } from "@/components/Alert/types";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";

const LOGO_SOURCE = {
	uri: "https://nativewindui.com/_next/image?url=/_next/static/media/logo.28276aeb.png&w=2048&q=75",
};

const GOOGLE_SOURCE = {
	uri: "https://www.pngall.com/wp-content/uploads/13/Google-Logo.png",
};

export default function AuthIndexScreen() {
	const alertRef = React.useRef<AlertRef>(null);
	return (
		<>
			<SafeAreaView style={{ flex: 1 }}>
				<View className="ios:justify-end ios:lg:justify-center flex-1 justify-center gap-4 px-8 py-4 max-w-xl w-full self-center">
					<View className="items-center">
						<Image
							source={LOGO_SOURCE}
							className="ios:h-12 ios:w-12 h-8 w-8"
							resizeMode="contain"
						/>
					</View>
					<View className="ios:pb-5 ios:pt-2 pb-2">
						<Text className="ios:font-extrabold text-center text-3xl font-medium">
							Brace Yourself
						</Text>
						<Text className="ios:font-extrabold text-center text-3xl font-medium">
							for What's Next
						</Text>
					</View>
					<Link href="/auth/(create-account)" asChild>
						<Button size={Platform.select({ ios: "lg", default: "md" })}>
							<Text>Sign up free</Text>
						</Button>
					</Link>
					<Button
						variant="secondary"
						className="ios:border-foreground/60"
						size={Platform.select({ ios: "lg", default: "md" })}
						onPress={() => {
							alertRef.current?.alert({
								title: "Suggestion",
								message: "Use @react-native-google-signin/google-signin",
								buttons: [{ text: "OK", style: "cancel" }],
							});
						}}
					>
						<Image
							source={GOOGLE_SOURCE}
							className="absolute left-4 h-4 w-4"
							resizeMode="contain"
						/>
						<Text className="ios:text-foreground">Continue with Google</Text>
					</Button>
					{Platform.OS === "ios" && (
						<Button
							variant="secondary"
							className="ios:border-foreground/60"
							size={Platform.select({ ios: "lg", default: "md" })}
							onPress={() => {
								alertRef.current?.alert({
									title: "Suggestion",
									message: "Use expo-apple-authentication",
									buttons: [{ text: "OK", style: "cancel" }],
								});
							}}
						>
							<Text className="ios:text-foreground absolute left-4 text-[22px]">
								
							</Text>
							<Text className="ios:text-foreground">Continue with Apple</Text>
						</Button>
					)}
					<Link href="/auth/(login)" asChild>
						<Button
							variant="plain"
							size={Platform.select({ ios: "lg", default: "md" })}
						>
							<Text className="text-primary">Log in</Text>
						</Button>
					</Link>
				</View>
			</SafeAreaView>
			<AlertAnchor ref={alertRef} />
		</>
	);
}

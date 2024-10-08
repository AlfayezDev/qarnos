import { auth$ } from "@/state/auth";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
	const isAuthenticated = auth$.isAuthenticated.get();
	if (!isAuthenticated) return <Redirect href="/auth" />;
	return <Stack />;
}

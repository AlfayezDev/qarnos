import "react-native-reanimated";
import { useTranslation } from "@/stores/translationStore";
import { useTheme } from "@/stores/themeStore";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import {
	FloatingTabBarLayout,
	TabButton,
} from "@/components/navigation/FloatingTabBar";

export default function RootLayout() {
	const { colors } = useTheme();
	const { t } = useTranslation();

	return (
		<Tabs asChild>
			<TabSlot style={{ backgroundColor: colors.background }} />
			<TabList asChild>
				<FloatingTabBarLayout>
					<TabTrigger name="index" href="/" asChild>
						<TabButton
							icon="home-outline"
							label={t("common.dashboard")}
							route="/"
						/>
					</TabTrigger>
					<TabTrigger name="meals" href="/meals" asChild>
						<TabButton
							icon="restaurant-outline"
							label={t("common.meals")}
							route="/meals"
						/>
					</TabTrigger>
					<TabTrigger name="settings" href="/settings" asChild>
						<TabButton
							icon="settings-outline"
							label={t("common.settings")}
							route="/settings"
						/>
					</TabTrigger>
				</FloatingTabBarLayout>
			</TabList>
		</Tabs>
	);
}

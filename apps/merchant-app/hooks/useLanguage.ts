import { useEffect, useState } from "react";
import { I18nManager, Platform } from "react-native";
import * as Expo from "expo";
import { Language } from "@/constants/i18n";
import { useMMKV } from "react-native-mmkv";
import { getLocales } from "expo-localization";
import * as Updates from "expo-updates";

export function useLanguage() {
	const storage = useMMKV();
	const [language, setLanguage] = useState<Language>(
		(storage.getString("language") as Language) ?? getLocales()[0].languageCode,
	);

	useEffect(() => {
		const shouldBeRTL = language === "ar";
		if (Platform.OS !== "web") {
			if (shouldBeRTL !== I18nManager.isRTL) {
				console.log("gonna reload");
				I18nManager.allowRTL(shouldBeRTL);
				I18nManager.forceRTL(shouldBeRTL);
				Updates.reloadAsync();
			}
		}
	}, []);

	const changeLanguage = async (newLanguage: Language) => {
		setLanguage(newLanguage);
		storage.set("language", newLanguage);
		I18nManager.allowRTL(newLanguage === "ar");
		I18nManager.forceRTL(newLanguage === "ar");
		Expo.reloadAppAsync();
	};

	return { language, changeLanguage };
}

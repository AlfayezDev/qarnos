import { useState, useEffect } from "react";
import { I18nManager } from "react-native";
import * as Expo from "expo";
import { Language } from "@/constants/i18n";
import { useMMKV } from "react-native-mmkv";

export function useLanguage() {
	const storage = useMMKV();
	const [language, setLanguage] = useState<Language>(
		(storage.getString("language") as Language) ?? "en",
	);

	useEffect(() => {
		const loadLanguage = async () => {
			const savedLanguage = storage.getString("language");
			if (savedLanguage === "en" || savedLanguage === "ar") {
				setLanguage(savedLanguage);

				const shouldBeRTL = savedLanguage === "ar";
				if (shouldBeRTL !== I18nManager.isRTL) {
					I18nManager.forceRTL(shouldBeRTL);
					Expo.reloadAppAsync();
				} else if (!shouldBeRTL && I18nManager.isRTL) {
					I18nManager.forceRTL(false);
				}
			}
		};

		loadLanguage();
	}, []);

	const changeLanguage = async (newLanguage: Language) => {
		setLanguage(newLanguage);
		storage.set("language", newLanguage);

		const shouldBeRTL = newLanguage === "ar";
		if (shouldBeRTL !== I18nManager.isRTL) {
			I18nManager.allowRTL(shouldBeRTL);
			I18nManager.forceRTL(shouldBeRTL);
		}
		Expo.reloadAppAsync();
	};

	return { language, changeLanguage };
}

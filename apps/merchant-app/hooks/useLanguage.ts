import { useState, useEffect } from "react";
import { I18nManager } from "react-native";
import { Language } from "@/constants/i18n";

const DEFAULT_LANGUAGE: Language = "ar";

export function useLanguage() {
	const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

	useEffect(() => {
		const loadLanguage = async () => {
			const savedLanguage = DEFAULT_LANGUAGE;
			if (savedLanguage === "en" || savedLanguage === "ar") {
				setLanguage(savedLanguage);

				const shouldBeRTL = savedLanguage === "ar";
				if (shouldBeRTL !== I18nManager.isRTL) {
					I18nManager.forceRTL(shouldBeRTL);
				} else if (!shouldBeRTL && I18nManager.isRTL) {
					I18nManager.forceRTL(false);
				}
			}
		};

		loadLanguage();
	}, []);

	const changeLanguage = async (newLanguage: Language) => {
		try {
			setLanguage(newLanguage);

			const shouldBeRTL = newLanguage === "ar";
			if (shouldBeRTL !== I18nManager.isRTL) {
				I18nManager.allowRTL(shouldBeRTL);
				I18nManager.forceRTL(shouldBeRTL);
			}
		} catch (error) {
			console.error("Failed to save language setting:", error);
		}
	};

	return { language, changeLanguage };
}

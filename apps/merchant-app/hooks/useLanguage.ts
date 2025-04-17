import { useState, useEffect } from "react";
import { I18nManager } from "react-native";
import { Language } from "@/constants/i18n";

const DEFAULT_LANGUAGE: Language = "ar";

export function useLanguage() {
	const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// For now, hardcoded to English
		const savedLanguage: "ar" | "en" = DEFAULT_LANGUAGE;

		if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
			setLanguage(savedLanguage);

			// Configure RTL based on language
			const shouldBeRTL = savedLanguage === "ar";
			if (shouldBeRTL !== I18nManager.isRTL) {
				I18nManager.forceRTL(shouldBeRTL);
			}
		}

		setIsLoading(false);
	}, []);

	const changeLanguage = (newLanguage: Language) => {
		// Will add AsyncStorage later
		setLanguage(newLanguage);

		// Handle RTL direction
		const shouldBeRTL = newLanguage === "ar";
		if (shouldBeRTL !== I18nManager.isRTL) {
			I18nManager.forceRTL(shouldBeRTL);
		}
	};

	return { language, changeLanguage, isLoading };
}

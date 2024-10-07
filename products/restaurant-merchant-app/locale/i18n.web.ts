import { useEffect } from "react";
import { i18n } from "@lingui/core";
import { sanitizeAppLanguageSetting } from "./helpers";
import { AppLanguage } from "./languages";

export async function dynamicActivate(locale: AppLanguage) {
	let mod: any;
	switch (locale) {
		case AppLanguage.ar: {
			mod = await import("./locales/ar/messages");
			break;
		}
		default: {
			mod = await import("./locales/en/messages");
			break;
		}
	}

	i18n.load(locale, mod.messages);
	i18n.activate(locale);
}
export async function useLocaleLanguage() {
	const { appLanguage } = useLanguagePrefs();
	useEffect(() => {
		const sanitizedLanguage = sanitizeAppLanguageSetting(appLanguage);
		document.documentElement.lang = sanitizedLanguage;
		dynamicActivate(sanitizedLanguage);
	}, [appLanguage]);
}

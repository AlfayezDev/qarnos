import "@formatjs/intl-locale/polyfill-force";
import "@formatjs/intl-pluralrules/polyfill-force";
import "@formatjs/intl-numberformat/polyfill-force";
import "@formatjs/intl-pluralrules/locale-data/en";
import "@formatjs/intl-numberformat/locale-data/en";
import { useEffect } from "react";
import { i18n } from "@lingui/core";
import { sanitizeAppLanguageSetting } from "./helpers";
import { AppLanguage } from "./languages";

import { messages as messagesEn } from "./locales/en/messages";
import { messages as messagesAr } from "./locales/ar/messages";

export async function dynamicActivate(locale: AppLanguage) {
	switch (locale) {
		case AppLanguage.ar: {
			i18n.loadAndActivate({ locale, messages: messagesAr });
			await Promise.all([
				import("@formatjs/intl-pluralrules/locale-data/ar"),
				import("@formatjs/intl-pluralrules/locale-data/ar"),
			]);
			break;
		}
		default: {
			i18n.loadAndActivate({ locale, messages: messagesEn });
			break;
		}
	}
}
export async function useLocaleLanguage() {
	const { appLanguage } = useLanguagePrefs();
	useEffect(() => {
		dynamicActivate(sanitizeAppLanguageSetting(appLanguage));
	}, [appLanguage]);
}

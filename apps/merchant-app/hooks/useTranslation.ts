import { translations } from "@/constants/i18n";
import { useCallback } from "react";
import { useLanguage } from "./useLanguage";
import { I18nManager } from "react-native";

type TranslationsType = typeof translations.en;

type Primitive = string | number | boolean | null | undefined;

type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${"" extends P ? "" : "."}${P}`
		: never
	: never;

type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends Primitive
		? ""
		:
				| {
						[K in keyof T]: K extends string | number
							? K | Join<K, Paths<T[K], Prev[D]>>
							: never;
				  }[keyof T & (string | number)]
				| "";

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type TranslationPath = Paths<TranslationsType, 4>;

export function useTranslation() {
	const { language } = useLanguage();

	const isRTL = I18nManager.isRTL;

	const t = useCallback(
		(path: string, params?: Record<string, string | number>): string => {
			const keys = path.split(".");
			let translation: any = translations[language];

			for (const key of keys) {
				translation = translation?.[key];

				if (translation === undefined) {
					let fallback: any = translations.en;
					for (const k of keys) {
						fallback = fallback?.[k];
						if (fallback === undefined) break;
					}
					translation = fallback;
					break;
				}
			}

			if (typeof translation !== "string") {
				return path;
			}

			if (params) {
				return Object.entries(params).reduce(
					(result, [key, value]) => result.replace(`{{${key}}}`, String(value)),
					translation,
				);
			}

			return translation;
		},
		[language],
	);

	return { t, language, isRTL };
}

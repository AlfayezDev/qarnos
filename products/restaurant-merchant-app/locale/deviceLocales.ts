import {
	getLocales as defaultGetLocales,
	type Locale,
} from "expo-localization";

import { sanitizeAppLanguageSetting } from "./helpers";
import { dedupArray } from "../lib/functions";

type LocalWithLanguageCode = Locale & {
	languageCode: string;
};

/**
 * Normalized locales
 *
 * Handles legacy migration for Java devices.
 *
 * {@link https://github.com/bluesky-social/social-app/pull/4461}
 * {@link https://xml.coverpages.org/iso639a.html}
 */
export function getLocales() {
	const locales = defaultGetLocales?.() ?? [];
	const output: LocalWithLanguageCode[] = [];

	for (const locale of locales) {
		if (typeof locale.languageCode === "string") {
			locale.languageCode = sanitizeAppLanguageSetting(locale.languageCode);
			// @ts-ignore checked above
			output.push(locale);
		}
	}
	return output;
}

export const deviceLocales = getLocales();

/**
 * BCP-47 language tag without region e.g. array of 2-char lang codes
 *
 * {@link https://docs.expo.dev/versions/latest/sdk/localization/#locale}
 */
export const deviceLanguageCodes = dedupArray(
	deviceLocales.map((l) => l.languageCode),
);

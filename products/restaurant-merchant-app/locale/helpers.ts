import { AppLanguage } from "./languages";

export function getTranslatorLink(text: string, lang: string): string {
	return `https://translate.google.com/?sl=auto&tl=${lang}&text=${encodeURIComponent(
		text,
	)}`;
}

/**
 * Returns a valid `appLanguage` value from an arbitrary string.
 *
 * Contenxt: post-refactor, we populated some user's `appLanguage` setting with
 * `postLanguage`, which can be a comma-separated list of values. This breaks
 * `appLanguage` handling in the app, so we introduced this util to parse out a
 * valid `appLanguage` from the pre-populated `postLanguage` values.
 *
 * The `appLanguage` will continue to be incorrect until the user returns to
 * language settings and selects a new option, at which point we'll re-save
 * their choice, which should then be a valid option. Since we don't know when
 * this will happen, we should leave this here until we feel it's safe to
 * remove, or we re-migrate their storage.
 */
export function sanitizeAppLanguageSetting(appLanguage: string): AppLanguage {
	const langs = appLanguage.split(",").filter(Boolean);

	for (const lang of langs) {
		switch (fixLegacyLanguageCode(lang)) {
			case "en":
				return AppLanguage.en;
			case "ar":
				return AppLanguage.ar;
			default:
				continue;
		}
	}
	return AppLanguage.en;
}

/**
 * Handles legacy migration for Java devices.
 *
 * {@link https://github.com/bluesky-social/social-app/pull/4461}
 * {@link https://xml.coverpages.org/iso639a.html}
 */
export function fixLegacyLanguageCode(code: string | null): string | null {
	if (code === "in") {
		// indonesian
		return "id";
	}
	if (code === "iw") {
		// hebrew
		return "he";
	}
	if (code === "ji") {
		// yiddish
		return "yi";
	}
	return code;
}

/**
 * Find the first language supported by our translation infra. Values should be
 * in order of preference, and match the values of {@link AppLanguage}.
 *
 * If no match, returns `en`.
 */
export function findSupportedAppLanguage(languageTags: (string | undefined)[]) {
	const supported = new Set(Object.values(AppLanguage));
	for (const tag of languageTags) {
		if (!tag) continue;
		if (supported.has(tag as AppLanguage)) {
			return tag;
		}
	}
	return AppLanguage.en;
}

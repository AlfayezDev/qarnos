import { create } from "zustand";
import { translations } from "@/constants/i18n";
import { I18nManager, Platform } from "react-native";
import * as Expo from "expo";
import { MMKV } from "react-native-mmkv";

export type Language = keyof typeof translations;
export type TranslationsType = typeof translations.en;

// Storage implementation
const storage = new MMKV();

// Cache structure
type TranslationCache = Record<string, string>;

interface TranslationState {
	language: Language;
	isRTL: boolean;
	translationCache: TranslationCache;
	setLanguage: (lang: Language) => Promise<void>;
	t: (path: string, params?: Record<string, string | number>) => string;
}

function buildTranslationCache(): TranslationCache {
	const cache: TranslationCache = {};
	const languages = Object.keys(translations) as Language[];

	// Function to recursively extract all translation paths
	function extractPaths(
		obj: Record<string, unknown>,
		prefix: string = "",
	): string[] {
		return Object.entries(obj).flatMap(([key, value]) => {
			const currentPath = prefix ? `${prefix}.${key}` : key;
			if (typeof value === "object" && value !== null) {
				return extractPaths(value as Record<string, unknown>, currentPath);
			}
			return [currentPath];
		});
	}

	// Get all possible translation paths
	const allPaths = extractPaths(translations.en);

	// Pre-populate cache for all languages and paths
	languages.forEach((lang) => {
		allPaths.forEach((path) => {
			const cacheKey = `${lang}:${path}`;
			const keys = path.split(".");

			let value: unknown = translations[lang];
			for (const key of keys) {
				if (typeof value !== "object" || value === null) {
					value = undefined;
					break;
				}
				value = (value as Record<string, unknown>)[key];
			}

			if (typeof value === "string") {
				cache[cacheKey] = value;
			} else if (lang !== "en") {
				// Fallback to English
				let fallback: unknown = translations.en;
				for (const key of keys) {
					if (typeof fallback !== "object" || fallback === null) {
						fallback = undefined;
						break;
					}
					fallback = (fallback as Record<string, unknown>)[key];
				}

				if (typeof fallback === "string") {
					cache[cacheKey] = fallback as string;
				}
			}
		});
	});

	return cache;
}

export const useTranslation = create<TranslationState>()((set, get) => ({
	language: (storage.getString("language") as "ar" | "en") ?? "en",
	isRTL: I18nManager.isRTL,
	translationCache: buildTranslationCache(),
	setLanguage: async (lang: Language) => {
		storage.set("language", lang);
		const shouldBeRTL = lang === "ar";
		if (shouldBeRTL !== I18nManager.isRTL) {
			I18nManager.allowRTL(shouldBeRTL);
			I18nManager.forceRTL(shouldBeRTL);
			if (Platform.OS !== "web") await Expo.reloadAppAsync();
		}
		set({ language: lang, isRTL: shouldBeRTL });
	},

	t: (path: string): string => {
		const language = get().language;
		console.log(language);
		const cache = get().translationCache;
		const cacheKey = `${language}:${path}`;
		let value = cache[cacheKey];
		// fall back to en
		if (!value && language !== "en") {
			const enCacheKey = `en:${path}`;
			value = cache[enCacheKey];
		}
		if (!value) {
			return path;
		}
		return value;
	},
}));

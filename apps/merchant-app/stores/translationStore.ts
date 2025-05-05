import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { translations } from "@/constants/i18n";
import { I18nManager, Platform } from "react-native";
import * as Expo from "expo";
import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

export type Language = keyof typeof translations;
export type TranslationsType = typeof translations.en;

// Storage implementation
const storage = new MMKV();

const zustandStorage: StateStorage = {
	setItem: (name, value) => {
		return storage.set(name, value);
	},
	getItem: (name) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name) => {
		return storage.delete(name);
	},
};

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

export const useTranslation = create<TranslationState>()(
	persist(
		(set, get) => ({
			language: "en",
			isRTL: I18nManager.isRTL,
			translationCache: buildTranslationCache(),

			setLanguage: async (lang: Language) => {
				const shouldBeRTL = lang === "ar";
				if (shouldBeRTL !== I18nManager.isRTL) {
					I18nManager.allowRTL(shouldBeRTL);
					I18nManager.forceRTL(shouldBeRTL);
					if (Platform.OS !== "web") await Expo.reloadAppAsync();
				}
				set({ language: lang, isRTL: shouldBeRTL });
			},

			t: (path: string, params?: Record<string, string | number>): string => {
				const language = get().language;
				const cache = get().translationCache;

				// Check cache first
				const cacheKey = `${language}:${path}`;
				let value = cache[cacheKey];

				// If not in cache, check English fallback
				if (!value && language !== "en") {
					const enCacheKey = `en:${path}`;
					value = cache[enCacheKey];
				}

				// If still not found, return path
				if (!value) {
					return path;
				}

				// Apply parameters if provided
				if (params) {
					return Object.entries(params).reduce(
						(result, [key, paramValue]) =>
							result.replace(`{{${key}}}`, String(paramValue)),
						value,
					);
				}

				return value;
			},
		}),
		{
			name: "language-storage",
			storage: createJSONStorage(() => zustandStorage),
			partialize: (state) => ({ language: state.language, isRTL: state.isRTL }),
		},
	),
);

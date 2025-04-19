import { useMemo } from "react";
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { useResponsiveLayout } from "./useResponsiveLayout";
import { useTheme } from "./useTheme";

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

interface ResponsiveStyleOptions<T extends NamedStyles<T>> {
	base: T;
	tablet?: Partial<T>;
	phone?: Partial<T>;
	landscape?: Partial<T>;
	portrait?: Partial<T>;
	tabletLandscape?: Partial<T>;
	tabletPortrait?: Partial<T>;
	phoneLandscape?: Partial<T>;
	phonePortrait?: Partial<T>;
}

export function useResponsiveStyles<T extends NamedStyles<T>>(
	styleOptions: ResponsiveStyleOptions<T>,
): T {
	const { deviceType, orientation } = useResponsiveLayout();
	const theme = useTheme();

	return useMemo(() => {
		const {
			base,
			tablet,
			phone,
			landscape,
			portrait,
			tabletLandscape,
			tabletPortrait,
			phoneLandscape,
			phonePortrait,
		} = styleOptions;

		let combinedStyles = { ...base };

		// Device type specific styles
		if (deviceType === "tablet" && tablet) {
			combinedStyles = mergeStyles(combinedStyles, tablet);
		} else if (deviceType === "phone" && phone) {
			combinedStyles = mergeStyles(combinedStyles, phone);
		}

		// Orientation specific styles
		if (orientation === "landscape" && landscape) {
			combinedStyles = mergeStyles(combinedStyles, landscape);
		} else if (orientation === "portrait" && portrait) {
			combinedStyles = mergeStyles(combinedStyles, portrait);
		}

		// Device + orientation specific styles
		if (
			deviceType === "tablet" &&
			orientation === "landscape" &&
			tabletLandscape
		) {
			combinedStyles = mergeStyles(combinedStyles, tabletLandscape);
		} else if (
			deviceType === "tablet" &&
			orientation === "portrait" &&
			tabletPortrait
		) {
			combinedStyles = mergeStyles(combinedStyles, tabletPortrait);
		} else if (
			deviceType === "phone" &&
			orientation === "landscape" &&
			phoneLandscape
		) {
			combinedStyles = mergeStyles(combinedStyles, phoneLandscape);
		} else if (
			deviceType === "phone" &&
			orientation === "portrait" &&
			phonePortrait
		) {
			combinedStyles = mergeStyles(combinedStyles, phonePortrait);
		}

		return StyleSheet.create(combinedStyles);
	}, [styleOptions, deviceType, orientation, theme]);
}

function mergeStyles<T extends NamedStyles<T>>(
	base: T,
	overrides: Partial<T>,
): T {
	const merged = { ...base };

	Object.keys(overrides).forEach((key) => {
		const baseStyle = base[key as keyof T];
		const overrideStyle = overrides[key as keyof T];

		if (baseStyle && overrideStyle) {
			merged[key as keyof T] = {
				...baseStyle,
				...overrideStyle,
			};
		}
	});

	return merged;
}

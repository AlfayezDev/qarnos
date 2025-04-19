import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

// Device type definitions
export type DeviceType = "phone" | "tablet" | "desktop";
export type OrientationType = "portrait" | "landscape";

// Breakpoints (in logical pixels)
export const BREAKPOINTS = {
	PHONE_MAX_WIDTH: 767,
	TABLET_MIN_WIDTH: 768,
	TABLET_MAX_WIDTH: 1023,
	DESKTOP_MIN_WIDTH: 1024,
};

interface ResponsiveLayout {
	deviceType: DeviceType;
	orientation: OrientationType;
	isPhone: boolean;
	isTablet: boolean;
	isLandscape: boolean;
	isPortrait: boolean;
	windowWidth: number;
	windowHeight: number;
	scale: number;
	fontScale: number;
}

export function useResponsiveLayout(): ResponsiveLayout {
	const [layout, setLayout] = useState<ResponsiveLayout>(() => {
		const window = Dimensions.get("window");
		return getLayoutInfo(window);
	});

	useEffect(() => {
		function handleDimensionsChange({ window }: { window: ScaledSize }) {
			setLayout(getLayoutInfo(window));
		}

		const subscription = Dimensions.addEventListener(
			"change",
			handleDimensionsChange,
		);

		return () => {
			// React Native 0.65+ uses remove(), older versions use removeEventListener()
			if (typeof subscription?.remove === "function") {
				subscription.remove();
			}
		};
	}, []);

	return layout;
}

function getLayoutInfo(window: ScaledSize): ResponsiveLayout {
	const { width, height, scale, fontScale } = window;
	const isPortrait = height > width;
	const isLandscape = !isPortrait;

	let deviceType: DeviceType = "phone";
	if (
		width >= BREAKPOINTS.TABLET_MIN_WIDTH &&
		width <= BREAKPOINTS.TABLET_MAX_WIDTH
	) {
		deviceType = "tablet";
	} else if (width > BREAKPOINTS.DESKTOP_MIN_WIDTH) {
		deviceType = "desktop";
	}

	return {
		deviceType,
		orientation: isPortrait ? "portrait" : "landscape",
		isPhone: deviceType === "phone",
		isTablet: deviceType === "tablet",
		isLandscape,
		isPortrait,
		windowWidth: width,
		windowHeight: height,
		scale,
		fontScale,
	};
}

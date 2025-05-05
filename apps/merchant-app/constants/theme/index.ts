import { colors } from "./colors";
import { animations } from "./animations";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { typography } from "./typography";
import { sizes } from "./sizes";
import { shadows } from "./shadows";
import { platform } from "./platform";

export type ThemeColors = typeof colors.light;
export type ThemeMode = "light" | "dark";

export const theme = {
	colors,
	spacing,
	radius,
	typography,
	sizes,
	shadows,
	platform,
	animations,
} as const;

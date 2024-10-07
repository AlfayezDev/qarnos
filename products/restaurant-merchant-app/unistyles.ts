import { UnistylesRegistry } from "react-native-unistyles";
import { darkTheme, lightTheme, breakpoints } from "./themes";
type BreakPoints = typeof breakpoints;
type AppThemes = {
	light: typeof lightTheme;
	dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AppThemes {}
	export interface UnistylesBreakpoints extends BreakPoints {}
}

UnistylesRegistry.addThemes({
	light: lightTheme,
	dark: darkTheme,
})
	.addBreakpoints(breakpoints)
	.addConfig({
		adaptiveThemes: true,
	});

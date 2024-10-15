import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";
import { NavigationProp } from "@react-navigation/native";

export function resetNavigator(
	navigation:
		| NavigationProp<ReactNavigation.RootParamList>
		| DrawerNavigationHelpers,
) {
	const state = navigation.getState();
	return {
		...state,
		routes: state.routes.map((route) => ({ ...route, state: undefined })),
	};
}

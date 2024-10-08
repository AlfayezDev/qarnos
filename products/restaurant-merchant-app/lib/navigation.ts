import { NavigationProp } from "@react-navigation/native";

export function resetNavigator(
	navigation: NavigationProp<ReactNavigation.RootParamList>,
) {
	const state = navigation.getState();
	navigation.reset({
		...state,
		routes: state.routes.map((route) => ({ ...route, state: undefined })),
	});
}

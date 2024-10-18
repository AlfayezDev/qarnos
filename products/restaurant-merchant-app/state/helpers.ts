import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { configureSynced, synced } from "@legendapp/state/sync";

// Setup a configured persist options
const state = configureSynced(synced, {
	persist: {
		name: "state",
		plugin: ObservablePersistMMKV,
		retrySync: true,
	},
	retry: {
		infinite: true,
	},
});
export { state };

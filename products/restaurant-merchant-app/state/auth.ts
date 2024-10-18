import { observable } from "@legendapp/state";
import { currentDay } from "@legendapp/state/helpers/time";
import { state } from "./helpers";

interface User {
	id: string;
	username: string;
	email: string;
	token: string;
}
interface AuthStore {
	user?: User;
	isAuthenticated: boolean;
	login: (username: string, password: string) => void;
	logout: () => void;
	register: (
		username: string,
		email: string,
		password: string,
	) => Promise<void>;
}

const auth$ = observable<AuthStore>({
	user: state({
		initial: undefined,
		persist: {
			name: "auth",
			mmkv: {
				encryptionKey: "test",
				id: "test",
			},
		},
	}),
	isAuthenticated: (): boolean => auth$.user.get() !== undefined,
	login: (username: string, password: string) => {
		password;
		const fakeUser: User = {
			id: "1",
			username,
			email: `${username}@example.com`,
			token: "fake-jwt-token",
		};
		auth$.user.set(fakeUser);
	},
	logout: () => {
		auth$.user.delete();
	},
	register: async (username: string, email: string, password: string) => {
		password;
		const newUser: User = {
			id: currentDay.peek().toString(),
			username,
			email,
			token: "fake-jwt-token",
		};
		auth$.user.set(newUser);
	},
});

export { auth$ };

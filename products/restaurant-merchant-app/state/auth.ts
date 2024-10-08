import { observable } from "@legendapp/state";
import { sync } from "./helpers";

interface User {
	id: string;
	username: string;
	email: string;
	token: string;
}

interface AuthStore {
	user: User | null;
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
	register: (
		username: string,
		email: string,
		password: string,
	) => Promise<void>;
}

// Create a global observable for the Auth store
const auth$ = observable<AuthStore>({
	user: sync({
		initial: null,
		persist: {
			name: "auth",
		},
	}),
	isAuthenticated: (): boolean => auth$.user.get() !== null,
	login: async (username: string, password: string) => {
		// In a real app, you would make an API call here
		// This is a simplified example
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
		auth$.user.set(null);
	},
	register: async (username: string, email: string, password: string) => {
		// In a real app, you would make an API call here
		// This is a simplified example
		password;
		const newUser: User = {
			id: Date.now().toString(),
			username,
			email,
			token: "fake-jwt-token",
		};
		auth$.user.set(newUser);
	},
});

export { auth$ };

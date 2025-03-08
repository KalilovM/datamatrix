export interface User {
	id: string;
	username: string;
}

export interface FormData {
	name: string;
	token: string;
	subscriptionEnd: string;
	users: string[];
}

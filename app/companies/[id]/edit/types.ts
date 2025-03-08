export interface User {
	id: string;
	username: string;
}

export interface Company {
	id: string;
	name: string;
	token: string;
	subscriptionEnd: Date;
	users: User[];
}

export interface FormData {
	name: string;
	subscriptionEnd: string;
	token: string;
	users: string[];
}

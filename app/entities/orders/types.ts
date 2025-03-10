export interface Order {
	id: string;
	createdAt: Date;
	counteragent: {
		name: string;
	};
}

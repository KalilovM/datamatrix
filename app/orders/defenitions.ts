export interface IOrder {
	id: number;
	showId: string;
	createdAt: Date;
	counteragent: {
		name: string;
	};
	totalQuantity: number;
	totalPrepared: number;
}

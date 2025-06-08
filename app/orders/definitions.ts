export interface IOrder {
	id: number;
	showId: string;
	modelArticle: string;
	createdAt: Date;
	counteragent: {
		name: string;
	};
	totalQuantity: number;
	totalPrepared: number;
}

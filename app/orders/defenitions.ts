export interface IOrder {
  id: string;
  createdAt: Date;
  counteragent: {
    name: string;
  };
}

export async function getCounteragentOptions() {
	const res = await fetch("/api/orders/counteragents", {
		method: "GET",
	});
	if (!res.ok) {
		throw new Error("Ошибка загрузки контрагентов");
	}
	return res.json();
}

export async function getEditOrder(orderId: string) {
	const res = await fetch(`/api/orders/${orderId}`, {
		method: "GET",
	});
	if (!res.ok) {
		throw new Error("Ошибка загрузки заказа");
	}
	return res.json();
}

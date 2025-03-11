export async function getOrders() {
	const response = await fetch("/api/orders");
	if (!response.ok) {
		throw new Error("Произошла ошибка при загрузке контрагентов");
	}
	const data = response.json();
	return data;
}

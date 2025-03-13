export async function getCounteragentOptions() {
	const res = await fetch("/api/orders/counteragents", {
		method: "GET",
	});
	if (!res.ok) {
		throw new Error("Ошибка загрузки контрагентов");
	}
	return res.json();
}

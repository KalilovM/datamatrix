import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json({ message: "Invalid code" }, { status: 400 });
	}

	try {
		const generatedCodePack = await prisma.generatedCodePack.findUnique({
			where: { value: code },
			include: { codes: true },
		});

		if (!generatedCodePack) {
			return NextResponse.json(
				{ message: "DataMatrix code not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ codes: generatedCodePack.codes });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
}

// PUT handler: Updates the linked codes based on user input
export async function PUT(request: Request) {
	try {
		const { code, codes } = await request.json();

		if (!code || !codes) {
			return NextResponse.json(
				{ message: "Не заполнены все поля" },
				{ status: 400 },
			);
		}

		const generatedCodePack = await prisma.generatedCodePack.findUnique({
			where: { value: code },
			include: { codes: true },
		});

		if (!generatedCodePack) {
			return NextResponse.json(
				{ message: "Datamatrix код не найден" },
				{ status: 404 },
			);
		}

		// Update each code record
		const updatePromises = codes.map(
			async (c: { id: string; value: string }) => {
				return prisma.code.update({
					where: { id: c.id },
					data: { value: c.value },
				});
			},
		);

		await Promise.all(updatePromises);

		return NextResponse.json({ message: "Коды обновлены!" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Произошла ошибка" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const { code } = await req.json();

		// Find the generated code pack by its unique code value and include its associated codes
		const generatedCodePack = await prisma.generatedCodePack.findUnique({
			where: { value: code },
			include: { codes: true },
		});

		if (!generatedCodePack) {
			return NextResponse.json(
				{ message: "Datamatrix код не найден" },
				{ status: 404 },
			);
		}

		// Collect the IDs of the associated codes
		const codeIds = generatedCodePack.codes.map((c) => c.id);

		// Update all codes: set 'used' to false
		await prisma.code.updateMany({
			where: {
				id: { in: codeIds },
			},
			data: { used: false },
		});

		// Delete the generated code pack
		await prisma.generatedCodePack.delete({
			where: { id: generatedCodePack.id },
		});

		return NextResponse.json({
			message: "Коды обновлены, пакет удалён",
		});
	} catch (error: any) {
		console.error("Ошибка при обновлении кодов:", error);
		return NextResponse.json(
			{ message: "Ошибка сервера", error: error.message },
			{ status: 500 },
		);
	}
}

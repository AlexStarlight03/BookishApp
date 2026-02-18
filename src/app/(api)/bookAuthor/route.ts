import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const relations = await prisma.bookAuthor.findMany();
    return NextResponse.json({ success: true, data: relations }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des relations book-author", error: error.message },
      { status: 500 }
    );
  }
}
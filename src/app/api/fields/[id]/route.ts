import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  
    const { id } = await params;
    const field = await prisma.field.findUnique({
      where: {
        id,
      }
    });

    if (!field) {
      return NextResponse.json(
        { error: "Field not found" },
        { status: 404 }
      );
    }

   

    return NextResponse.json({
      field
    });
  } catch (error) {
    console.error("Error fetching field:", error);

    return NextResponse.json(
      { error: "Failed to fetch field" },
      { status: 500 }
    );
  }
} 
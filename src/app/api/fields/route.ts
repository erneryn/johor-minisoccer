import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, type, price, weekendPrice, startDate, endDate } = body;
    const data = {
        name,
        description,
        type,
        price: Number(price),
        weekendPrice: weekendPrice ? Number(weekendPrice) : null,
        startDate: startDate ? new Date(startDate + 'T00:00:00.000Z') : null,
        endDate: endDate ? new Date(endDate + 'T23:59:59.999Z') : null
    }
    console.log(data);
    const field = await prisma.field.create({
      data: data,
    });

    return NextResponse.json(field);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known request errors (e.g., database connection issues)
      console.error("PrismaClientKnownRequestError:", error.code, error.message);
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle validation errors (e.g., invalid data types)
      console.error("PrismaClientValidationError:", error.message);
    } else {
      // Handle other Prisma errors
      console.error("Unknown Prisma error:", error);
    }
    return NextResponse.json(
      { error: 'Failed to create field' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const fields = await prisma.field.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(fields);
  } catch (error) {
    console.error('Error fetching fields:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fields' },
      { status: 500 }
    );
  }
} 
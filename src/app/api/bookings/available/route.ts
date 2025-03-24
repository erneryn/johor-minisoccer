import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const today =  Date.now()
    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(date).getTime();
    const todayDate = new Date(today).setHours(0, 0, 0, 0);
    if (selectedDate < todayDate) {
      return NextResponse.json(
        { error: "Selected date must be today or later" },
        { status: 400 }
      );
    }

    // Get all active fields
    const fields = await prisma.field.findMany({
      where: {
      },
    });

    // get booking by date
    const bookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    const availableFields = fields.map((field) => {
      const availableTimeSlots = bookings.filter((booking) => booking.fieldId === field.id).map((booking) => ({
        startTime: booking.startTime,
        endTime: booking.endTime
      }))
      return {
        ...field,
        isAvailable: availableTimeSlots.length === 0
      }
    })
    return NextResponse.json({
      fields: availableFields
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
} 
import {  NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
    console.log("GET BOOKINGS")
    const bookings = await prisma.booking.findMany({
        where: {},
        include: {
            field: true
        }
    })

    const response = bookings.map((booking) => ({
        id: booking.id,
        email: booking.email,
        fieldDescription: booking.field.description,
        userId: booking.userId,
        phoneNumber: booking.phoneNumber,
        clubName: booking.clubName,
        fileUrl: booking.fileUrl,
        status: booking.status,
        totalPrice: booking.totalPrice,
        bookingSubmittedAt: booking.createdAt,
        bookingForDate: booking.startTime
    }))
    return NextResponse.json(response)
}

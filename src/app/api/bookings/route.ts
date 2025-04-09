import {  NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

enum BookingStatus {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED'
}

interface BookingWhereInput {
    status?: BookingStatus;
    email? : {
        contains: string;
    };
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const email = searchParams.get('email') || '';
    const status = searchParams.get('status') || '';
    const limit = 10;
    const offset = (page - 1) * limit;
    const where: BookingWhereInput = {};
    if (status) {
        if (status !== 'ALL') {
            where.status = status as BookingStatus;
        }
    }
    if (email) {
        where.email = {
            contains: email.toLowerCase(),
        };
    }

    const bookings = await prisma.booking.findMany({
        where: where,
        include: {
            field: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: limit,
        skip: offset
    })

    const total = await prisma.booking.count({
        where: {}
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
        fieldPrice: booking.field.price,
        totalPrice: booking.totalPrice,
        wasitPrice: booking.wasitPrice,
        photographerPrice: booking.photographerPrice,
        bookingSubmittedAt: booking.createdAt,
        bookingForDate: booking.startTime
    }))
    return NextResponse.json({
        bookings: response,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
    })
}

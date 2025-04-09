import { sendSuccesOrRejectEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
        where: {
            id
        },
        include: {
            field: true
        }
    })

    if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }
    const response = {
        id: booking.id,
        email: booking.email,
        fieldDescription: booking.field.description,
        userId: booking.userId,
        phoneNumber: booking.phoneNumber,
        clubName: booking.clubName,
        fileUrl: booking.fileUrl,
        status: booking.status,
        totalPrice: booking.totalPrice,
        fieldPrice: booking.field.price,
        wasitPrice: booking.wasitPrice,
        photographerPrice: booking.photographerPrice,
        bookingSubmittedAt: booking.createdAt,
        bookingForDate: booking.startTime
    }
    return NextResponse.json(response)
}

export async function POST(request: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        if (!body || !body.status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: { status: body.status },
            include: {
                field: true
            }
        });

                
        const response = {
            id: booking.id,
            email: booking.email,
            fieldDescription: booking.field.description,
            userId: booking.userId,
            phoneNumber: booking.phoneNumber,
            clubName: booking.clubName,
            fileUrl: booking.fileUrl,
            status: booking.status,
            totalPrice: booking.totalPrice,
            wasitPrice: booking.wasitPrice,
            fieldPrice: booking.field.price,
            photographerPrice: booking.photographerPrice,
            bookingSubmittedAt: booking.createdAt,
            bookingForDate: booking.startTime
        };


        const emailData = {
            id: booking.id,
            email: booking.email,
            clubName: booking.clubName,
            phoneNumber: booking.phoneNumber,
            totalPrice: booking.totalPrice,
            fieldDescription: booking.field.description || 'No description available',
            wasitPrice: booking.wasitPrice,
            photographerPrice: booking.photographerPrice,
            fieldPrice: booking.field.price
        }
        try {
            await sendSuccesOrRejectEmail(emailData, booking.startTime.toISOString(), body.status);
        } catch (error) {
            console.error('Error sending email:', error);
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }
}
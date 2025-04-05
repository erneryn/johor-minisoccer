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

    // Check if selected date is within 30 days from today
    // const maxDate = new Date(today);
    // maxDate.setDate(maxDate.getDate() + (process.env.MAX_BOOKING_DAYS ? parseInt(process.env.MAX_BOOKING_DAYS) : 30));
    // const maxDateTime = maxDate.setHours(0, 0, 0, 0);

    // if (selectedDate > maxDateTime) {
    //   return NextResponse.json(
    //     { error: `Selected date must be within ${process.env.MAX_BOOKING_DAYS ? parseInt(process.env.MAX_BOOKING_DAYS) : 30} days from today` },
    //     { status: 400 }
    //   );
    // }
    // Check if selected date is weekend
    const selectedDay = new Date(date).getDay();
    const isWeekend = selectedDay === 0 || selectedDay === 6 || selectedDay === 5; // 0 is Sunday, 5 friday, 6 is Saturday

    // Get all active fields
    const fields = await prisma.field.findMany({
      where: {
        OR: [
          {
            type: isWeekend ? 'weekend' : 'regular'
          },
          {
            type: 'promo',
            AND: [
              {
                startDate: {
                  lte: new Date(date)
                }
              },
              {
                endDate: {
                  gte: new Date(date)
                }
              }
            ]
          },
          {
            type: 'holiday',
            startDate: {
              lte: new Date(date)
            },
            endDate: {
              gte: new Date(date)
            }
          }
        ]
      },
      orderBy: {
        description: 'asc'
      }
    });

    // Filter to only show promo fields if they exist
    const promoFields = fields.filter(field => field.type === 'promo');
    const holidayFields = fields.filter(field => field.type === 'holiday');
    const filteredFields = promoFields.length > 0 ? promoFields : holidayFields.length > 0 ? holidayFields : fields;
    // get booking by date
    const bookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
        },
        status: {
          in: ['PENDING', 'COMPLETED']
        },
      }
    })

    const availableFields = filteredFields.map((field) => {
      const availableTimeSlots = bookings.filter((booking) => booking.fieldId === field.id).map((booking) => ({
        startTime: booking.startTime,
        endTime: booking.endTime
      }))
      return {
        ...field,
        price: field.type === 'promo' ? isWeekend ? field.weekendPrice : field.price : field.price,
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
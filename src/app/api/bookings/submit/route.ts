import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const formData = await request.formData();
    
    // Validate required fields
    const date = formData.get('date') as string;
    const hour = formData.get('hour') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const clubName = formData.get('clubName') as string;
    const fieldId = formData.get('fieldId') as string;
    if (!date || !hour || !email || !phoneNumber || !clubName || !fieldId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let fileUrl = null;
    const file = formData.get('file') as File;

    if (file) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Allowed types: JPEG, PNG' },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size too large. Maximum size: 5MB' },
          { status: 400 }
        );
      }

      try {
        // Convert file to base64
        const fileBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        const base64String = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64String}`;

        // to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'bookings',
          resource_type: 'auto',
          public_id: `booking-${Date.now()}`,
        });

       fileUrl = uploadResponse.secure_url;
        console.log('File uploaded to Cloudinary:', fileUrl);
      } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        );
      }
    }

    const startTime = date + "T00:00:00.000Z";
    const endTime = date + "T23:59:59.999Z";

    const booking = await prisma.booking.create({
      data: {
        startTime,
        endTime,
        email,
        phoneNumber,
        clubName,
        fileUrl,
        fieldId,
        userId: session?.user?.userid || undefined,
        status: 'PENDING',
        totalPrice: 0,
      },
      include: {
        field: true
      }
    });

    return NextResponse.json({ 
      booking,
      message: "Booking submitted successfully",
    });

  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
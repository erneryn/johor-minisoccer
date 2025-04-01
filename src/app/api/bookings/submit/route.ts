import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendConfirmationEmail } from '@/lib/email';
import sharp from 'sharp';

// Types
interface BookingData {
  date: string;
  hour: string;
  email: string;
  phoneNumber: string;
  clubName: string;
  fieldId: string;
  fileUrl?: string | null;
  userId?: string;
  price: string;
}

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;
const QUALITY = 80;

// Configure services
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Helper functions
async function validateFormData(formData: FormData): Promise<BookingData> {
  const date = formData.get('date') as string;
  const hour = formData.get('hour') as string;
  const email = formData.get('email') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const clubName = formData.get('clubName') as string;
  const fieldId = formData.get('fieldId') as string;
  const price = formData.get('price') as string

  if (!date || !hour || !email || !phoneNumber || !clubName || !fieldId || !price) {
    throw new Error('Missing required fields');
  }

  return { date, hour, email, phoneNumber, clubName, fieldId, price };
}

async function resizeImage(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  // Calculate new dimensions while maintaining aspect ratio
  let width = metadata.width;
  let height = metadata.height;
  
  if (width && height) {
    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }
    if (height > MAX_HEIGHT) {
      width = Math.round((width * MAX_HEIGHT) / height);
      height = MAX_HEIGHT;
    }
  }

  return image
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: QUALITY })
    .toBuffer();
}

async function handleFileUpload(file: File | null): Promise<string | null> {
  if (!file) return null;

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Allowed types: JPEG, PNG');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size too large. Maximum size: 5MB');
  }

  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  
  // Resize image before upload
  const resizedBuffer = await resizeImage(buffer);
  const base64String = resizedBuffer.toString('base64');
  const dataURI = `data:${file.type};base64,${base64String}`;

  const uploadResponse = await cloudinary.uploader.upload(dataURI, {
    folder: 'bookings',
    resource_type: 'auto',
    public_id: `booking-${Date.now()}`,
  });

  return uploadResponse.secure_url;
}

async function createBooking(data: BookingData) {
  const startTime = data.date + "T00:00:00.000Z";
  const endTime = data.date + "T23:59:59.999Z";

  return prisma.booking.create({
    data: {
      startTime,
      endTime,
      email: data.email,
      phoneNumber: data.phoneNumber,
      clubName: data.clubName,
      fileUrl: data.fileUrl,
      fieldId: data.fieldId,
      userId: data.userId,
      status: 'PENDING',
      totalPrice: Number(data.price) || 0,
    },
    include: {
      field: true
    }
  });
}

// Main handler
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const formData = await request.formData();

    // Validate form data
    const bookingData = await validateFormData(formData);

    // Handle file upload
    const file = formData.get('file') as File;
    
    const fileUrl = await handleFileUpload(file);
    bookingData.fileUrl = fileUrl;
    bookingData.userId = session?.user?.id;
    
    // Create booking
    const booking = await createBooking(bookingData);

    // Send confirmation email
    try {
      await sendConfirmationEmail(booking, bookingData.date, bookingData.hour);
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue with the booking process even if email fails
    }

    return NextResponse.json({ 
      booking,
      message: "Booking submitted successfully",
    });

  } catch (error) {
    console.error('Error processing booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process booking';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message.includes('Missing') ? 400 : 500 }
    );
  }
}
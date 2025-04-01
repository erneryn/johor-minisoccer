import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';

interface Booking {
  id: string;
  email: string;
  clubName: string;
  phoneNumber: string;
  totalPrice: number;
  fieldDescription?: string;
}

export async function sendConfirmationEmail(booking: Booking, date: string, hour: string) {
  const templateEmail = fs.readFileSync(`${process.cwd()}/public/waitingConfirmation.html`, 'utf-8');
  const renderTemplate = handlebars.compile(templateEmail);
  const content = renderTemplate({
    email: booking.email,
    booking_id: booking.id,
    date,
    hour,
    club_name: booking.clubName,
    mobile_number: booking.phoneNumber,
    price: booking.totalPrice
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: booking.email,
    cc: 'johorminisoccer2025@gmail.com',
    subject: 'Booking Confirmation',
    html: content
  });
} 

export async function sendSuccesOrRejectEmail(booking: Booking, date: string, status: string) {
    const templateEmailSuccess = fs.readFileSync(`${process.cwd()}/public/successBooking.html`, 'utf-8');
    const templateEmailReject = fs.readFileSync(`${process.cwd()}/public/rejectBooking.html`, 'utf-8');
    const renderTemplate = handlebars.compile(status == 'COMPLETED' ? templateEmailSuccess : templateEmailReject);
    const content = renderTemplate({
      email: booking.email,
      booking_id: booking.id,
      date: date.split('T')[0],
      hour: booking.fieldDescription,
      club_name: booking.clubName,
      mobile_number: booking.phoneNumber,
      price: booking.totalPrice
    });
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.email,
      cc: 'johorminisoccer2025@gmail.com',
      subject: status == 'COMPLETED' ? 'Booking Success' : 'Booking Rejected',
      html: content
    });
  } 
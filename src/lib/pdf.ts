import PDFDocument from 'pdfkit';

interface Booking {
  id: string;
  email: string;
  clubName: string;
  phoneNumber: string;
  totalPrice: number;
  fieldDescription?: string;
  fieldPrice: number;
  wasitPrice: number | null;
  photographerPrice: number | null;
  status: string;
  bookingForDate: string;
  bookingSubmittedAt: string;
  fileUrl?: string;
}

export async function generateBookingPDF(booking: Booking): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      
      // Create a buffer to store the PDF
      const chunks: Buffer[] = [];
      
      // Pipe the PDF to a buffer
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Add content to the PDF
      doc.fontSize(20).text('Johor Mini SoccerBooking Details', { align: 'center' });
      doc.moveDown();
      // Add logo image if available
  

      // Add booking photo if availabl
      // Add booking information
      doc.fontSize(12);
      doc.text(`Booking ID: ${booking.id}`);
      doc.text(`Email: ${booking.email}`);
      doc.text(`Nama Club: ${booking.clubName}`);
      doc.text(`No Hp: ${booking.phoneNumber}`);
      doc.moveDown();
      
      doc.text(`Jam Main: ${booking.fieldDescription || 'N/A'}`);
      doc.text(`Booking Untuk Tanggal: ${new Date(booking.bookingForDate).toLocaleDateString()}`);
      doc.text(`Booking Dibuat Pada Tanggal: ${new Date(booking.bookingSubmittedAt).toLocaleString()}`);
      doc.moveDown();
      
      // Add pricing information
      doc.text('Harga Lapangan:');
      doc.text(`Harga Lapangan: ${booking.fieldPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`);
      doc.text(`Harga Wasit: ${booking.wasitPrice ? booking.wasitPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'Rp.0 (tidak sewa)'}`);
      doc.text(`Harga Photographer: ${booking.photographerPrice ? booking.photographerPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'Rp.0 (tidak sewa)'}`);
      doc.moveDown();
      
      doc.text(`Total Harga: ${booking.totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`);
      doc.moveDown();
      
      // Add status with color
      const statusColor = booking.status === 'PENDING' ? 'yellow' :
                         booking.status === 'COMPLETED' ? 'green' :
                         booking.status === 'REJECTED' ? 'red' : 'gray';
      
      doc.text(`Status: `);
      doc.fillColor(statusColor).text(booking.status);
      doc.fillColor('black');

     
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
} 
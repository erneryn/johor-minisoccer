import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

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
      
      // Add logo image if available
      try {
        const logoPath = path.join(process.cwd(), 'public', 'mainlogo.jpeg');
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 25, 25, { width: 100 });
        }
      } catch (error) {
        console.error('Error loading logo:', error);
        // Continue without logo if there's an error
      }

      // Add header
      doc.fontSize(20).text('Johor Mini Soccer', { align: 'center' });
      doc.fontSize(16).text('Booking Details', { align: 'center' });
      doc.moveDown(2);

      // Create table for booking information
      const tableTop = doc.y;
      const tableLeft = 50;
      const col1Width = 150;
      const col2Width = 300;
      const rowHeight = 25;

      // Draw table header
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Detail', tableLeft, tableTop, { width: col1Width });
      doc.text('Informasi', tableLeft + col1Width, tableTop, { width: col2Width });
      
      // Draw horizontal line for header
      doc.moveTo(tableLeft, tableTop + rowHeight)
         .lineTo(tableLeft + col1Width + col2Width, tableTop + rowHeight)
         .stroke();

      // Reset font for content
      doc.font('Helvetica').fontSize(10);

      // Booking Information Rows
      const rows = [
        ['Booking ID', booking.id],
        ['Email', booking.email],
        ['Nama Club', booking.clubName],
        ['No Hp', booking.phoneNumber],
        ['Jam Main', booking.fieldDescription || 'N/A'],
        ['Booking Untuk Tanggal', new Date(booking.bookingForDate).toLocaleDateString()],
        ['Booking Dibuat Pada Tanggal', new Date(booking.bookingSubmittedAt).toLocaleString()],
      ];

      // Draw rows with proper spacing and lines
      let currentY = tableTop + rowHeight;
      rows.forEach(([label, value]) => {
        // Add content
        doc.text(label, tableLeft, currentY + 5, { width: col1Width });
        doc.text(value, tableLeft + col1Width, currentY + 5, { width: col2Width });
        
        currentY += rowHeight;
      });

      // Draw final horizontal line
      doc.moveTo(tableLeft, currentY)
         .lineTo(tableLeft + col1Width + col2Width, currentY)
         .stroke();

      doc.moveDown(2);

      // Pricing Information Table
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text('Rincian Harga', tableLeft, doc.y);
      doc.moveDown();
      doc.font('Helvetica').fontSize(10);

      const priceRows = [
        ['Harga Lapangan', booking.fieldPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })],
        ['Harga Wasit', booking.wasitPrice ? booking.wasitPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'Rp.0 (tidak sewa)'],
        ['Harga Photographer', booking.photographerPrice ? booking.photographerPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : 'Rp.0 (tidak sewa)'],
        ['Total Harga', booking.totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })],
      ];

      // Draw price rows with proper spacing and lines
      currentY = doc.y;
      priceRows.forEach(([label, value]) => {
        // Add content
        doc.text(label, tableLeft, currentY + 5, { width: col1Width });
        doc.text(value, tableLeft + col1Width, currentY + 5, { width: col2Width });
        
        currentY += rowHeight;
      });

      // Draw final horizontal line for price table
      doc.moveTo(tableLeft, currentY)
         .lineTo(tableLeft + col1Width + col2Width, currentY)
         .stroke();

      doc.moveDown(2);

      // Status
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text('Status: ', tableLeft, doc.y);
      const statusColor = booking.status === 'PENDING' ? 'yellow' :
                         booking.status === 'COMPLETED' ? 'green' :
                         booking.status === 'REJECTED' ? 'red' : 'gray';
      doc.fillColor(statusColor).text(booking.status);
      doc.fillColor('black');

      // Footer
      doc.moveDown(15);
      
      // Contact Information
      doc.font('Helvetica').fontSize(10);
      doc.text('Untuk informasi booking dan bantuan mohon hubungi kami di no 0818560056 (WA)', {
        align: 'center',
        width: 500
      });
      
      doc.moveDown(2);
      
      // Signature
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text('Salam Olahraga - Johor Mini Soccer', {
        align: 'center',
        width: 500
      });
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
} 
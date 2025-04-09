import { useState } from 'react';
import { Download } from 'lucide-react';

interface PDFDownloadButtonProps {
  booking: {
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
    bookingForDate: Date | string;
    bookingSubmittedAt: Date | string;
    fileUrl?: string;
  };
}

export function PDFDownloadButton({ booking }: PDFDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      // Convert Date objects to ISO strings if needed
      const bookingData = {
        ...booking,
        bookingForDate: booking.bookingForDate instanceof Date 
          ? booking.bookingForDate.toISOString() 
          : booking.bookingForDate,
        bookingSubmittedAt: booking.bookingSubmittedAt instanceof Date 
          ? booking.bookingSubmittedAt.toISOString() 
          : booking.bookingSubmittedAt,
      };
      
      // Call the API route to generate the PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link to download the PDF
      const link = document.createElement('a');
      link.href = url;
      link.download = `booking_${booking.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isLoading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  );
} 
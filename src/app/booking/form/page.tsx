import Loading from "@/components/loading";
import { Suspense } from "react";
import BookingFormPage from "@/components/wrapper/formBookingPage";
const BookingForm = () => {
  return (
    <Suspense fallback={<Loading />}>
      <BookingFormPage />
    </Suspense>
  );
};

export default BookingForm;

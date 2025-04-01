import Loading from "@/components/loading";
import { Suspense } from "react";
import MyBookingPage from "@/components/wrapper/mybookingPage";
const BookingForm = () => {
  return (
    <Suspense fallback={<Loading />}>
      <MyBookingPage />
    </Suspense>
  );
};

export default BookingForm;

'use client';

import Calendar from "@/components/calendar/calendar";
import { useCallback } from "react";
import moment from "moment";
import { useState, useEffect } from "react";

interface CalendarEvent {
  id:string;
  start: Date;
  end: Date;
  title: string;
  data?: {
    type: string;
  };
}

interface Booking {
  id: string;
  bookingForDate: Date;
  clubName: string;
  fieldDescription: string;
}

const SchedulePage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]); 
  console.log(events);
  const transformEvents = (bookings: [Booking]) => {
    const getHour = (fieldDescription: string) => {
      const hour = Number(fieldDescription.split('-')[0].split(':')[0])
      return hour
    }

    return bookings.map((booking: Booking) => ({
      id: booking.id,
      start: moment(booking.bookingForDate).set('hour', getHour(booking.fieldDescription)).toDate(),
      end: moment(booking.bookingForDate).set('hour', getHour(booking.fieldDescription) + 1).set('minute', 59).toDate(),
      title: `${booking.clubName}`,
      data: {
        type: "App",
      },
    }));
  };

  const fetchBookings = useCallback(async (dateStart: string, dateEnd: string) => {
    try {
      const response = await fetch(`/api/bookings?dateStart=${dateStart}&dateEnd=${dateEnd}&status=COMPLETED`);
      const data = await response.json();
      const dataEvents = transformEvents(data.bookings);
      setEvents(dataEvents);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchBookings(moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD'));
  }, [fetchBookings]);

  const handleMonthChange = (month: string) => {
    const dateStart = moment(month).startOf('month').format('YYYY-MM-DD');
    const dateEnd = moment(month).endOf('month').format('YYYY-MM-DD');
    fetchBookings(dateStart, dateEnd);
  };


  const handleWeekChange = (weekStart: string, weekEnd: string) => {
    const dateStart = moment(weekStart).startOf('week').format('YYYY-MM-DD');
    const dateEnd = moment(weekEnd).endOf('week').format('YYYY-MM-DD');
    fetchBookings(dateStart, dateEnd);
  };

  const handleDayChange = (day: string) => {
    const dateStart = moment(day).startOf('day').format('YYYY-MM-DD');
    const dateEnd = moment(day).endOf('day').format('YYYY-MM-DD');
    fetchBookings(dateStart, dateEnd);
  };

  return (
    <div className="container mx-auto bg-white">
      <Calendar 
        events={events}
        onMonthChange={handleMonthChange}
        onWeekChange={handleWeekChange}
        onDayChange={handleDayChange}
      />
    </div>
  );
};

export default SchedulePage;

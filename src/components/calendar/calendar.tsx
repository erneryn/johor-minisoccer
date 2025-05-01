'use client';

import {
    Calendar as BigCalendar,
    momentLocalizer,
    EventProps,
  } from "react-big-calendar";
  import moment from "moment";
  import 'moment/locale/id'; // Import Indonesian locale
  import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMemo, useCallback, useState } from "react";
import Link from "next/link";

  // Set moment locale to Indonesian
  moment.locale('id');

  interface CalendarEvent {
    id:string;
    start: Date;
    end: Date;
    title: string;
    data?: {
      type: string;
    };
  }
  interface CalendarProps {
    onMonthChange?: (month: string) => void;
    onWeekChange?: (weekStart: string, weekEnd: string) => void;
    onDayChange?: (day: string) => void;
    events: CalendarEvent[];
  }

  
  
  const localizer = momentLocalizer(moment);

  // Custom event component
  const EventComponent = ({ event }: EventProps<CalendarEvent>) => {
    return (
      <div>
        <div className="flex flex-col">
          <Link href={`/admin/bookings/booking-detail/${event.id}`} target="_blank">
          <span className="font-semibold text-xs">{event.title}</span>
          </Link>
        </div>
      </div>
    );
  };
  
  export default function Calendar({ onMonthChange, onWeekChange, onDayChange, events }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
    const [searchDate, setSearchDate] = useState('');

    const { components } = useMemo(
      () => ({
        components: {
          event: EventComponent,
        },
      }),
      []
    );

    const handleNavigate = useCallback((newDate: Date, view: string) => {
      setCurrentDate(newDate);
      setCurrentView(view as 'month' | 'week' | 'day');

      switch (view) {
        case 'month':
          const month = moment(newDate).format('YYYY-MM');
          console.log('Month changed to:', month);
          onMonthChange?.(month);
          break;
        case 'week':
          const weekStart = moment(newDate).startOf('week').format('YYYY-MM-DD');
          const weekEnd = moment(newDate).endOf('week').format('YYYY-MM-DD');
          console.log('Week changed to:', weekStart, 'to', weekEnd);
          onWeekChange?.(weekStart, weekEnd);
          break;
        case 'day':
          const day = moment(newDate).format('YYYY-MM-DD');
          console.log('Day changed to:', day);
          onDayChange?.(day);
          break;
      }
    }, [onMonthChange, onWeekChange, onDayChange]);

    const handleViewChange = useCallback((view: string) => {
      setCurrentView(view as 'month' | 'week' | 'day');
      // Trigger the appropriate fetch based on the new view
      switch (view) {
        case 'month':
          const month = moment(currentDate).format('YYYY-MM');
          console.log('Switched to month view:', month);
          onMonthChange?.(month);
          break;
        case 'week':
          const weekStart = moment(currentDate).startOf('week').format('YYYY-MM-DD');
          const weekEnd = moment(currentDate).endOf('week').format('YYYY-MM-DD');
          console.log('Switched to week view:', weekStart, 'to', weekEnd);
          onWeekChange?.(weekStart, weekEnd);
          break;
        case 'day':
          const day = moment(currentDate).format('YYYY-MM-DD');
          console.log('Switched to day view:', day);
          onDayChange?.(day);
          break;
      }
    }, [currentDate, onMonthChange, onWeekChange, onDayChange]);

    const handleDateSearch = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (searchDate) {
        const newDate = moment(searchDate).toDate();
        if (moment(newDate).isValid()) {
          setCurrentDate(newDate);
          handleNavigate(newDate, currentView);
        }
      }
    }, [searchDate, currentView, handleNavigate]);

    return (
      <div className="h-auto min-h-[600px]">
        <div className="mb-4 p-4">
          <form onSubmit={handleDateSearch} className="flex gap-2">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cari Tanggal
            </button>
          </form>
        </div>
        <div className="h-screen">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            components={components}
            eventPropGetter={() => ({
              className: "cursor-pointer hover:opacity-90 transition-opacity",
            })}
            popup
            allDayMaxRows={4}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            date={currentDate}
            view={currentView}
            defaultView="month"
            views={['month', 'week', 'day']}
            formats={{
              timeGutterFormat: 'HH:mm',
              eventTimeRangeFormat: ({ start, end }, culture, local) =>
                local ? `${local.format(start, 'HH:mm', culture)} – ${local.format(end, 'HH:mm', culture)}` : '',
              agendaTimeFormat: 'HH:mm',
              dayFormat: 'dddd D MMMM',
              dayRangeHeaderFormat: ({ start, end }, culture, local) =>
                local ? `${local.format(start, 'D MMMM', culture)} – ${local.format(end, 'D MMMM', culture)}` : '',
              monthHeaderFormat: 'MMMM YYYY',
              agendaDateFormat: 'D MMMM YYYY',
              agendaTimeRangeFormat: ({ start, end }, culture, local) =>
                local ? `${local.format(start, 'HH:mm', culture)} – ${local.format(end, 'HH:mm', culture)}` : '',
              weekdayFormat: 'dddd'
            }}
          />
        </div>
      </div>
    );
  }
  
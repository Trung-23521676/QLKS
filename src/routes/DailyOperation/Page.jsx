import { useState, useRef, useEffect, useMemo } from "react";
import "./FrontDesk.css"; // Import the CSS file

// Styles for the split-tone booking bars
const bookingBarStyles = {
  "Due in": {
    head: "bg-yellow-500 text-white",
    tail: "bg-yellow-100 text-yellow-800",
  },
  "Check in": {
    head: "bg-green-500 text-white",
    tail: "bg-green-100 text-green-800",
  },
  "Due out": {
    head: "bg-orange-500 text-white",
    tail: "bg-orange-100 text-orange-800",
  },
  "Check out": {
    head: "bg-blue-500 text-white",
    tail: "bg-blue-100 text-blue-800",
  },
};

// Styles for the pill-shaped items
const legendStyles = {
  "Due in": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Check in": "bg-green-100 text-green-700 border-green-300",
  "Due out": "bg-orange-100 text-orange-700 border-orange-300",
  "Check out": "bg-blue-100 text-blue-700 border-blue-300",
};

// Months array
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Fake booking data
const fakeBookings = [
  {
    id: 1,
    guest: "Mr. Brown",
    room: "A103",
    startDate: new Date('2025-06-02'),
    endDate: new Date('2025-06-05'),
    status: "Check out",
    row: 0
  },
  {
    id: 2,
    guest: "Mrs. Yan",
    room: "C205",
    startDate: new Date('2025-06-08'),
    endDate: new Date('2025-06-12'),
    status: "Due out",
    row: 1
  },
  {
    id: 3,
    guest: "Mrs. Jess",
    room: "C109",
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-06-20'),
    status: "Check in",
    row: 2
  },
  {
    id: 4,
    guest: "Miss Jane",
    room: "A212",
    startDate: new Date('2025-06-10'),
    endDate: new Date('2025-06-18'),
    status: "Check in",
    row: 0
  },
  {
    id: 5,
    guest: "Mr. John",
    room: "B107",
    startDate: new Date('2025-05-30'),
    endDate: new Date('2025-06-03'),
    status: "Due in",
    row: 3
  }
];

// A dedicated component for the new booking bar style
const BookingBar = ({ booking, isStartVisible, isEndVisible }) => {
  const styles = bookingBarStyles[booking.status] || {};
  const headWidth = 80;

  const headClasses = isStartVisible ? 'rounded-l-full' : '';
  const tailClasses = isEndVisible ? 'rounded-r-full' : '';

  return (
    <div className="w-full h-full flex items-center">
      <div className={`flex-shrink-0 h-full flex items-center justify-center px-3 ${styles.head} ${headClasses}`} style={{ width: `${headWidth}px` }}>
        <span className="font-semibold text-xs truncate">{booking.guest}</span>
      </div>
      <div className={`flex-grow h-full flex items-center px-3 ${styles.tail} ${tailClasses}`}>
        <span className="font-medium text-xs">{booking.room}</span>
      </div>
    </div>
  );
};


export default function FrontDeskHeader() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewingDate, setViewingDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [highlightedBookingId, setHighlightedBookingId] = useState(null);

  const bookingGridScrollRef = useRef(null);
  const isInitialMount = useRef(true);

  const getDatesForMonth = (year, month) => {
    const dates = [];
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDayOfMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
  };

  const calendarDates = useMemo(() => {
    return getDatesForMonth(viewingDate.getFullYear(), viewingDate.getMonth());
  }, [viewingDate]);

  const filteredBookings = useMemo(() => {
    const viewStart = calendarDates[0];
    const viewEnd = new Date(calendarDates[calendarDates.length - 1]);
    viewEnd.setHours(23, 59, 59, 999);

    return fakeBookings.filter(booking => booking.startDate <= viewEnd && booking.endDate >= viewStart);
  }, [calendarDates]);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      const foundBooking = fakeBookings.find(b =>
        b.guest.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        b.room.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      if (foundBooking) {
        setHighlightedBookingId(foundBooking.id);
        setViewingDate(new Date(foundBooking.startDate.getFullYear(), foundBooking.startDate.getMonth(), 1));
      } else {
        setHighlightedBookingId(null);
      }
    } else {
      setHighlightedBookingId(null);
    }
  }, [debouncedSearch]);


  useEffect(() => {
    const scrollContainer = bookingGridScrollRef.current;
    if (!scrollContainer || !calendarDates.length) return;

    let scrollPosition = 0;
    let behavior = 'smooth';
    let targetElement;

    if (highlightedBookingId) {
      const booking = fakeBookings.find(b => b.id === highlightedBookingId);
      if (booking) {
        targetElement = scrollContainer.querySelector(`[data-date-string="${booking.startDate.toDateString()}"]`);
      }
    } else if (isInitialMount.current) {
      const isCurrentMonth = viewingDate.getMonth() === today.getMonth() && viewingDate.getFullYear() === today.getFullYear();
      if (isCurrentMonth) {
        targetElement = scrollContainer.querySelector(`[data-date-string="${today.toDateString()}"]`);
        behavior = 'auto';
      }
      isInitialMount.current = false;
    }

    if (targetElement) {
      scrollPosition = targetElement.offsetLeft - (scrollContainer.offsetWidth / 2) + (targetElement.offsetWidth / 2);
    }

    scrollContainer.scrollTo({ left: scrollPosition, behavior });

  }, [viewingDate, highlightedBookingId, calendarDates, today]);


  const handleMonthClick = (monthIndex) => {
    setViewingDate(new Date(viewingDate.getFullYear(), monthIndex, 1));
  };

  const handlePrevYear = () => {
    setViewingDate(new Date(viewingDate.getFullYear() - 1, viewingDate.getMonth(), 1));
  };

  const handleNextYear = () => {
    setViewingDate(new Date(viewingDate.getFullYear() + 1, viewingDate.getMonth(), 1));
  };

  const dayCellWidth = 80;

  const calculateBookingStyle = (booking) => {
    const dayInMillis = 1000 * 60 * 60 * 24;
    const firstDisplayedDate = calendarDates[0];
    const lastDisplayedDate = new Date(calendarDates[calendarDates.length - 1]);
    lastDisplayedDate.setHours(23, 59, 59, 999);

    const bookingStart = new Date(booking.startDate);
    bookingStart.setHours(0, 0, 0, 0);
    const bookingEnd = new Date(booking.endDate);
    bookingEnd.setHours(0, 0, 0, 0);

    const effectiveStartDate = new Date(Math.max(bookingStart.getTime(), firstDisplayedDate.getTime()));
    const effectiveEndDate = new Date(Math.min(bookingEnd.getTime(), lastDisplayedDate.getTime()));

    let durationInDays = (effectiveEndDate.getTime() - effectiveStartDate.getTime()) / dayInMillis;
    if (bookingEnd > lastDisplayedDate) {
      durationInDays = Math.ceil(durationInDays);
    }

    const offsetInDays = (effectiveStartDate.getTime() - firstDisplayedDate.getTime()) / dayInMillis;
    const leftPosition = offsetInDays * dayCellWidth;
    const width = durationInDays * dayCellWidth;

    const bookingBarHeight = 36;
    const bookingBarVerticalSpacing = 16;
    const topPosition = 8 + (booking.row * (bookingBarHeight + bookingBarVerticalSpacing));

    const isStartVisible = bookingStart >= firstDisplayedDate;
    const isEndVisible = bookingEnd <= lastDisplayedDate;

    return {
      style: {
        left: `${leftPosition}px`,
        width: `${width}px`,
        top: `${topPosition}px`,
        height: `${bookingBarHeight}px`,
      },
      isStartVisible,
      isEndVisible,
    };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="flex gap-3 flex-wrap">
          {Object.entries(legendStyles).map(([status, classes]) => (
            <span key={status} className={`px-4 py-1.5 text-xs font-semibold rounded-full border-2 ${classes}`}>
              {status}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by service ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 pl-4 pr-4 py-2 rounded-full text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button className="px-5 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-full shadow-md">
            create booking
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg flex flex-col flex-grow overflow-hidden">

        {/* Fixed Month and Year Header */}
        <div className="p-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-center">
            <button onClick={handlePrevYear} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-xl font-bold text-slate-900 w-24 text-center">
              {viewingDate.getFullYear()}
            </span>
            <button onClick={handleNextYear} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-around mt-2">
            {months.map((month, index) => (
              <button
                key={month}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  viewingDate.getMonth() === index
                    ? 'bg-white text-blue-600 border-2 border-blue-500'
                    : 'text-slate-500 hover:bg-slate-100/60 border-2 border-transparent'
                }`}
                onClick={() => handleMonthClick(index)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Day Grid */}
        <div ref={bookingGridScrollRef} className="booking-grid-scroll-container">
          <div className="relative" style={{ width: `${calendarDates.length * dayCellWidth}px`, height: '100%' }}>
            {/* Sticky Day Headers */}
            <div className="sticky-day-header z-20 bg-white">
              <div className="flex">
                {calendarDates.map(date => {
                  const isToday = date.toDateString() === today.toDateString();
                  return (
                    <div
                      key={date.toISOString()}
                      data-date-string={date.toDateString()}
                      className="day-cell flex-shrink-0 w-20 h-12 flex items-center justify-center border-r border-slate-200"
                    >
                      <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : 'text-slate-500'}`}>
                        {date.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 flex grid-lines-container">
              {calendarDates.map((date) => (
                <div key={date.toISOString()} className="day-grid-line w-20 h-full border-r border-slate-200"></div>
              ))}
            </div>

            {/* Booking Bars */}
            <div className="absolute inset-0 z-10 booking-bars-container">
              {filteredBookings.map(booking => {
                const isHighlighted = booking.id === highlightedBookingId;
                const { style, isStartVisible, isEndVisible } = calculateBookingStyle(booking);

                let roundingClass = '';
                if (isStartVisible && isEndVisible) {
                  roundingClass = 'rounded-full';
                } else if (isStartVisible) {
                  roundingClass = 'rounded-l-full';
                } else if (isEndVisible) {
                  roundingClass = 'rounded-r-full';
                }

                return (
                  <div
                    key={booking.id}
                    style={style}
                    className={`absolute overflow-hidden ${roundingClass} ${isHighlighted ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <BookingBar booking={booking} isStartVisible={isStartVisible} isEndVisible={isEndVisible} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
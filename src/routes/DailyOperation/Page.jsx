import { useState, useRef, useEffect, useMemo } from "react";
import "./FrontDesk.css"; // Import the CSS file
import CreateBookingModal from "./CreateBooking"

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
    guest: "Brown",
    room: "A103",
    startDate: new Date("2025-06-02"),
    endDate: new Date("2025-06-05"),
    status: "Check out",
    timestamp: new Date("2025-06-02").getTime(),
  },
  {
    id: 2,
    guest: "Yan",
    room: "C205",
    startDate: new Date("2025-06-08"),
    endDate: new Date("2025-06-12"),
    status: "Due out",
    timestamp: new Date("2025-06-08").getTime(),
  },
  {
    id: 3,
    guest: "Jess",
    room: "C109",
    startDate: new Date("2025-06-15"),
    endDate: new Date("2025-06-20"),
    status: "Check in",
    timestamp: new Date("2025-06-15").getTime(),
  },
  {
    id: 4,
    guest: "Jane",
    room: "A212",
    startDate: new Date("2025-06-10"),
    endDate: new Date("2025-06-18"),
    status: "Check in",
    timestamp: new Date("2025-06-10").getTime(),
  },
  {
    id: 5,
    guest: "John",
    room: "B107",
    startDate: new Date("2025-05-30"),
    endDate: new Date("2025-06-03"),
    status: "Due in",
    timestamp: new Date("2025-05-30").getTime(),
  },

  // Thêm 25 bookings nữa
  ...Array.from({ length: 25 }, (_, i) => {
    const id = i + 6;
    const offset = i * 2; // 2 ngày một booking
    const start = new Date(2025, 5, 5); // tháng 6 là 5 (0-based)
    const end = new Date(start);
    end.setDate(start.getDate() + 3); // kéo dài 3 ngày

    return {
      id,
      guest: `Guest ${id}`,
      room: `Room ${100 + id}`,
      startDate: start,
      endDate: end,
      status: ["Check in", "Check out", "Due in", "Due out"][i % 4],
      timestamp: start.getTime(),
    };
  }),
];


function assignRows(bookings) {
  const sorted = [...bookings].sort((a, b) => a.startDate - b.startDate);
  const rows = [];

  for (const booking of sorted) {
    let placed = false;

    for (let i = 0; i < rows.length; i++) {
      const last = rows[i][rows[i].length - 1];
      if (booking.startDate >= last.endDate) {
        booking.row = i;
        rows[i].push(booking);
        placed = true;
        break;
      }
    }

    if (!placed) {
      booking.row = rows.length;
      rows.push([booking]);
    }
  }

  return sorted;
}

const bookingsWithRow = assignRows(fakeBookings);

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
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false); // New state for modal visibility


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

  return fakeBookings.filter(booking => {
    const inDateRange = booking.startDate <= viewEnd && booking.endDate >= viewStart;
    const matchesSearch = debouncedSearch === "" ||
      booking.guest.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      booking.room.toLowerCase().includes(debouncedSearch.toLowerCase());
    return inDateRange && matchesSearch;
  });
}, [calendarDates, debouncedSearch]);


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
  if (!scrollContainer) return;

  let targetElement = null;
  let behavior = 'smooth';

  if (search.length > 0 && filteredBookings.length > 0) {
    // Scroll to the first booking's start date
    const firstBooking = filteredBookings[0];
    targetElement = scrollContainer.querySelector(`[data-date-string="${firstBooking.startDate.toDateString()}"]`);
  } else if (isInitialMount.current) {
    const isCurrentMonth = viewingDate.getMonth() === today.getMonth() && viewingDate.getFullYear() === today.getFullYear();
    if (isCurrentMonth) {
      targetElement = scrollContainer.querySelector(`[data-date-string="${today.toDateString()}"]`);
      // Keep behavior: 'smooth' for animation
    }
    isInitialMount.current = false;
  }

  if (targetElement) {
    const scrollToTarget = () => {
      const scrollPosition = targetElement.offsetLeft - (scrollContainer.offsetWidth / 2) + (targetElement.offsetWidth / 2);
      scrollContainer.scrollTo({ left: scrollPosition, behavior });
    };

    // If scrolling to today on initial mount, delay 100ms
    if (isInitialMount.current === false && search.length === 0 && filteredBookings.length === 0) {
      setTimeout(scrollToTarget, 100);
    } else {
      scrollToTarget(); // Immediately if due to search
    }
  }
}, [search, filteredBookings, viewingDate]);


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
    <div className="flex flex-col h-full ml-[1rem]">
      <div>
        <p className="name">Front Desk</p>
        <p className="labeldash">_____________</p>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4 mt-2">
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
            placeholder="Search by name or room number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 px-4 py-2 bg-white rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-center items-center gap-2 flex-1 justify-start text-gray-500 text-base font-normal font-['Inter'] leading-normal"
          />
          <button
            onClick={() => setIsCreateBookingModalOpen(true)} // Open modal on click
            className="w-36 h-10 bg-sky-600 rounded-[30px] border border-sky-700 justify-start text-white text-base font-normal font-['Inter']"
          >
            Create booking
          </button>
        </div>
      </div>

      <div className="w-full h-[80%] bg-white rounded-[30px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">

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
  <div ref={bookingGridScrollRef} className="flex-1 overflow-auto relative">
    <div
      className="relative w-fit min-w-full"
      style={{
        minHeight: `${filteredBookings.length * 48 + 60}px`, // dynamic height + header
      }}
    >

      {/* Sticky Day Headers */}
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex">
          {calendarDates.map((date) => {
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
      <div className="absolute inset-0 flex">
        {calendarDates.map((date) => (
          <div key={date.toISOString()} className="w-20 h-full border-r border-slate-200"></div>
        ))}
      </div>

      {/* Booking Bars */}
      <div className="absolute inset-0 z-10">
        {filteredBookings.map((booking, index) => {
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
              style={{ ...style, top: `${index * 48 + 60}px`, height: '40px' }}
              className={`absolute overflow-hidden ${roundingClass} ${isHighlighted ? 'ring-2 ring-blue-500' : ''}`}
            >
              <BookingBar
                booking={booking}
                isStartVisible={isStartVisible}
                isEndVisible={isEndVisible}
              />
            </div>
          );
        })}
      </div>

    </div>
  </div>
</div>

      {/* Create Booking Modal */}
      <CreateBookingModal
        isOpen={isCreateBookingModalOpen}
        onClose={() => setIsCreateBookingModalOpen(false)}
      />
    </div>
  );
}
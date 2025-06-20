import { useState, useRef, useEffect, useMemo } from "react";
import "./FrontDesk.css"; //
import CreateBookingModal from "./CreateBooking"; //
import BookingDetail from "./BookingDetail.jsx"; //

// Styles for booking bars and legend (no changes)
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
}; //

const legendStyles = {
  "Due in": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Check in": "bg-green-100 text-green-700 border-green-300",
  "Due out": "bg-orange-100 text-orange-700 border-orange-300",
  "Check out": "bg-blue-100 text-blue-700 border-blue-300",
}; //

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]; //

/**
 * A dedicated component for the split-tone booking bar style.
 */
const BookingBar = ({ booking, isStartVisible, isEndVisible }) => {
  const styles = bookingBarStyles[booking.status] || {}; //
  const headWidth = 80;

  const headClasses = isStartVisible ? 'rounded-l-full' : ''; //
  const tailClasses = isEndVisible ? 'rounded-r-full' : ''; //

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
}; //

/**
 * Calculates and assigns a 'row' property to each booking to prevent visual overlaps in the grid.
 * @param {Array} bookings - The array of booking objects.
 * @returns {Array} Bookings with an added 'row' property.
 */
const assignRowsToBookings = (bookings) => {
  if (!bookings || bookings.length === 0) return [];

  const sortedBookings = [...bookings].sort((a, b) => a.startDate - b.startDate);
  const rowEndDates = [];

  return sortedBookings.map(booking => {
    let assignedRow = -1;
    // Find the first row where this booking can fit without overlapping
    for (let i = 0; i < rowEndDates.length; i++) {
      if (booking.startDate >= rowEndDates[i]) {
        rowEndDates[i] = booking.endDate;
        assignedRow = i;
        break;
      }
    }
    // If no suitable row is found, create a new one
    if (assignedRow === -1) {
      rowEndDates.push(booking.endDate);
      assignedRow = rowEndDates.length - 1;
    }
    return { ...booking, row: assignedRow };
  });
};

export default function FrontDeskPage() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []); //

  // State Management
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingDate, setViewingDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1)); //
  const [search, setSearch] = useState(""); //
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false); //
  const [selectedBooking, setSelectedBooking] = useState(null); //
  
  const bookingGridScrollRef = useRef(null); //

  // Fetch all bookings from the backend on component mount
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setIsLoading(true);
        // Uses the proxy configured in vite.config.js
        const response = await fetch('/api/frontdesk/bookings');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Transform backend data to match the frontend's expected structure
        const transformedData = data.map(b => ({
          id: b.booking_id, //
          guest: b.guest_fullname, //
          room: b.room_id, //
          startDate: new Date(b.check_in), //
          endDate: new Date(b.check_out), //
          status: b.status, //
        }));
        
        setBookings(assignRowsToBookings(transformedData));
        setError(null);
      } catch (e) {
        console.error("Failed to fetch bookings:", e);
        setError("Could not load booking data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBookings();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch detailed data for a single booking when clicked
  const handleBookingClick = async (bookingId) => {
    if (!bookingId) return;
    try {
      const response = await fetch(`/api/frontdesk/booking/${bookingId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const detailedBookingData = await response.json(); //
      setSelectedBooking(detailedBookingData);
    } catch (err) {
      console.error("Failed to fetch booking details:", err);
      setError("Could not load booking details.");
    }
  };

  // Memoized calendar dates for the current view
  const calendarDates = useMemo(() => {
    const dates = [];
    const lastDayOfMonth = new Date(viewingDate.getFullYear(), viewingDate.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= lastDayOfMonth; day++) {
      dates.push(new Date(viewingDate.getFullYear(), viewingDate.getMonth(), day));
    }
    return dates;
  }, [viewingDate]); //

  // Filter bookings to show only those visible in the current month view
  const filteredBookings = useMemo(() => {
    const viewStart = calendarDates[0];
    if (!viewStart) return [];
    const viewEnd = new Date(calendarDates[calendarDates.length - 1]);
    viewEnd.setHours(23, 59, 59, 999);

    return bookings.filter(booking => booking.startDate <= viewEnd && booking.endDate >= viewStart);
  }, [calendarDates, bookings]); //

  // Handlers for changing year and month
  const handleMonthClick = (monthIndex) => setViewingDate(new Date(viewingDate.getFullYear(), monthIndex, 1)); //
  const handlePrevYear = () => setViewingDate(new Date(viewingDate.getFullYear() - 1, viewingDate.getMonth(), 1)); //
  const handleNextYear = () => setViewingDate(new Date(viewingDate.getFullYear() + 1, viewingDate.getMonth(), 1)); //

  // Style calculation for positioning booking bars on the grid
  const calculateBookingStyle = (booking) => {
    const dayCellWidth = 80;
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
    if (bookingEnd > lastDisplayedDate) durationInDays = Math.ceil(durationInDays);

    const offsetInDays = (effectiveStartDate.getTime() - firstDisplayedDate.getTime()) / dayInMillis;
    const leftPosition = offsetInDays * dayCellWidth;
    const width = durationInDays * dayCellWidth;

    const bookingBarHeight = 36;
    const bookingBarVerticalSpacing = 16;
    const topPosition = 8 + (booking.row * (bookingBarHeight + bookingBarVerticalSpacing));

    return {
      style: { left: `${leftPosition}px`, width: `${width}px`, top: `${topPosition}px`, height: `${bookingBarHeight}px` },
      isStartVisible: bookingStart >= firstDisplayedDate,
      isEndVisible: bookingEnd <= lastDisplayedDate,
    };
  }; //

  return (
    <>
      <div className="flex flex-col h-full p-3">
        {/* Page Header */}
        <div>
          <p className="name">Front Desk</p>
          <p className="labeldash">___________</p>
        </div>

        {/* Controls and Legend */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4 mt-2">
          <div className="flex gap-3 flex-wrap">
            {Object.entries(legendStyles).map(([status, classes]) => (
              <span key={status} className={`px-4 py-1.5 text-xs font-semibold rounded-full border-2 ${classes}`}>
                {status}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search by name or room number" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-80 pl-4 pr-4 py-2 rounded-full text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button onClick={() => setIsCreateBookingModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
              Create Booking
            </button>
          </div>
        </div>

        {/* Main Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col flex-grow overflow-hidden">
          {/* Calendar Header: Year and Month selectors */}
          <div className="p-3 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center justify-center">
              <button onClick={handlePrevYear} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </button>
              <span className="text-xl font-bold text-slate-900 w-24 text-center">{viewingDate.getFullYear()}</span>
              <button onClick={handleNextYear} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <div className="flex items-center justify-around mt-2">
              {months.map((month, index) => (
                <button key={month} onClick={() => handleMonthClick(index)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${viewingDate.getMonth() === index ? 'bg-white text-blue-600 border-2 border-blue-500' : 'text-slate-500 hover:bg-slate-100/60 border-2 border-transparent'}`}>
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Booking Grid */}
          <div ref={bookingGridScrollRef} className="booking-grid-scroll-container">
            <div className="relative" style={{ width: `${calendarDates.length * 80}px`, height: '100%' }}>
              <div className="sticky-day-header z-20 bg-white">
                <div className="flex">
                  {calendarDates.map(date => (
                    <div key={date.toISOString()} data-date-string={date.toDateString()} className="day-cell flex-shrink-0 w-20 h-12 flex items-center justify-center border-r border-slate-200">
                      <span className={`text-sm ${date.toDateString() === today.toDateString() ? 'font-bold text-blue-600' : 'text-slate-500'}`}>{date.getDate()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex grid-lines-container">
                {calendarDates.map((date) => (<div key={date.toISOString()} className="day-grid-line w-20 h-full border-r border-slate-200"></div>))}
              </div>

              {/* Conditional Rendering for Loading/Error/Data */}
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">Loading bookings...</div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500">{error}</div>
              ) : (
                <div className="absolute inset-0 z-10 booking-bars-container">
                  {filteredBookings.map(booking => {
                    const { style, isStartVisible, isEndVisible } = calculateBookingStyle(booking);
                    return (
                      <div key={booking.id} style={style} onClick={() => handleBookingClick(booking.id)}
                        className="absolute overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105">
                        <BookingBar booking={booking} isStartVisible={isStartVisible} isEndVisible={isEndVisible} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateBookingModal isOpen={isCreateBookingModalOpen} onClose={() => setIsCreateBookingModalOpen(false)} />
        <BookingDetail isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} booking={selectedBooking} />
      </div>
    </>
  );
}
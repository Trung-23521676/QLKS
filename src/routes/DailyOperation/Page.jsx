import { useState, useRef, useEffect, useMemo } from "react";
import "./FrontDesk.css";
import CreateBookingModal from "./CreateBooking";
import BookingDetail from "./BookingDetail"; 
import { getAllBookings, getBookingById } from "../../API/FrontDeskAPI";

const bookingBarStyles = {
  "Due In": { head: "bg-yellow-500 text-white", tail: "bg-yellow-100 text-yellow-800" },
  "Check in": { head: "bg-green-500 text-white", tail: "bg-green-100 text-green-800" },
  "Due out": { head: "bg-orange-500 text-white", tail: "bg-orange-100 text-orange-800" },
  "Check out": { head: "bg-blue-500 text-white", tail: "bg-blue-100 text-blue-800" },
};
const legendStyles = {
  "Due in": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Check in": "bg-green-100 text-green-700 border-green-300",
  "Due out": "bg-orange-100 text-orange-700 border-orange-300",
  "Check out": "bg-blue-100 text-blue-700 border-blue-300",
};
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function assignRows(bookings) {
  if (!bookings || bookings.length === 0) return [];
  const sortedBookings = [...bookings].sort((a, b) => a.startDate - b.startDate);
  const rowEndDates = [];

  return sortedBookings.map(booking => {
    let assignedRow = -1;
    for (let i = 0; i < rowEndDates.length; i++) {
      if (booking.startDate >= rowEndDates[i]) {
        rowEndDates[i] = booking.endDate;
        assignedRow = i;
        break;
      }
    }
    if (assignedRow === -1) {
      rowEndDates.push(booking.endDate);
      assignedRow = rowEndDates.length - 1;
    }
    return { ...booking, row: assignedRow };
  });
}

const BookingBar = ({ booking, isStartVisible, isEndVisible }) => {
  console.log(`Booking ID: ${booking.id}, Status từ Database là: '${booking.status}'`);
  const styles = bookingBarStyles[booking.status] || {};
  const headWidth = 80;
  const headClasses = isStartVisible ? 'rounded-l-full' : '';
  const tailClasses = isEndVisible ? 'rounded-r-full' : '';
  return (
    <div className="w-full h-full flex items-center shadow-sm rounded-full overflow-hidden">
      <div className={`flex-shrink-0 h-full flex items-center justify-center px-3 ${styles.head} ${headClasses}`} style={{ width: `${headWidth}px` }}>
        <span className="font-semibold text-xs truncate">{booking.guest}</span>
      </div>
      <div className={`flex-grow h-full flex items-center px-3 ${styles.tail} ${tailClasses}`}>
        <span className="font-medium text-xs">{booking.room}</span>
      </div>
    </div>
  );
};

export default function FrontDeskPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);

  const today = useMemo(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
  }, []);
  const [viewingDate, setViewingDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [search, setSearch] = useState("");
  const bookingGridScrollRef = useRef(null);

  useEffect(() => {
    const fetchAndProcessBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getAllBookings();
        const transformedData = data.map(b => ({
          id: b.booking_id,
          guest: b.guest_fullname,
          room: b.room_id,
          startDate: new Date(b.check_in),
          endDate: new Date(b.check_out),
          status: b.status,
        }));
        setBookings(assignRows(transformedData));
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch bookings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndProcessBookings();
  }, []);

  const handleBookingClick = async (bookingId) => {
    try {
      const bookingDetails = await getBookingById(bookingId);
      setSelectedBooking(bookingDetails);
    } catch (err) {
      alert(`Error fetching booking details: ${err.message}`);
    }
  };

  const handleMonthClick = (monthIndex) => setViewingDate(new Date(viewingDate.getFullYear(), monthIndex, 1));
  const handlePrevYear = () => setViewingDate(new Date(viewingDate.getFullYear() - 1, viewingDate.getMonth(), 1));
  const handleNextYear = () => setViewingDate(new Date(viewingDate.getFullYear() + 1, viewingDate.getMonth(), 1));

  const calendarDates = useMemo(() => {
    const dates = [];
    const lastDayOfMonth = new Date(viewingDate.getFullYear(), viewingDate.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= lastDayOfMonth; day++) {
      dates.push(new Date(viewingDate.getFullYear(), viewingDate.getMonth(), day));
    }
    return dates;
  }, [viewingDate]);

  const filteredBookings = useMemo(() => {
    if (!calendarDates.length) return [];
    const viewStart = calendarDates[0];
    const viewEnd = new Date(calendarDates[calendarDates.length - 1]);
    viewEnd.setHours(23, 59, 59, 999);
    return bookings.filter(booking => booking.startDate <= viewEnd && booking.endDate >= viewStart);
  }, [calendarDates, bookings]);

  const calculateBookingStyle = (booking) => {
    const dayCellWidth = 80;
    const dayInMillis = 1000 * 60 * 60 * 24;
    
    if (!calendarDates.length) return { style: {}, isStartVisible: false, isEndVisible: false };

    const firstDisplayedDate = calendarDates[0];
    const lastDisplayedDate = new Date(calendarDates[calendarDates.length - 1]);
    lastDisplayedDate.setHours(23, 59, 59, 999);

    const bookingStart = new Date(booking.startDate);
    bookingStart.setHours(0, 0, 0, 0);
    const bookingEnd = new Date(booking.endDate);
    bookingEnd.setHours(0, 0, 0, 0);

    const effectiveStartDate = new Date(Math.max(bookingStart.getTime(), firstDisplayedDate.getTime()));
    const effectiveEndDate = new Date(Math.min(bookingEnd.getTime(), lastDisplayedDate.getTime()));
    
    let durationInDays = (effectiveEndDate.getTime() - effectiveStartDate.getTime()) / dayInMillis + 1;
    
    const offsetInDays = (effectiveStartDate.getTime() - firstDisplayedDate.getTime()) / dayInMillis;
    const leftPosition = offsetInDays * dayCellWidth;
    const width = durationInDays * dayCellWidth - 4; // -4 for padding

    const bookingBarHeight = 40;
    const rowHeight = 52;
    const topPosition = booking.row * rowHeight + 4;

    const isStartVisible = bookingStart >= firstDisplayedDate;
    const isEndVisible = bookingEnd <= lastDisplayedDate;

    return {
      style: {
        position: 'absolute',
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
    <div className="flex flex-col h-full  font-sans">
      <div className="flex-shrink-0">
        <p className="name  ">Front Desk</p>
        <div className="labeldash">___________</div>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="flex gap-3 flex-wrap">
          {Object.entries(legendStyles).map(([status, classes]) => (
            <span key={status} className={`px-4 py-1.5 text-xs font-semibold rounded-full border-2 ${classes}`}>{status}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
            <input type="text" placeholder="Search by name or room" value={search} onChange={(e) => setSearch(e.target.value)} className="w-80 px-4 py-2 rounded-full text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm" />
            <button onClick={() => setIsCreateBookingModalOpen(true)} className="px-6 py-2 bg-sky-600 text-white rounded-full font-semibold hover:bg-sky-700 transition-transform transform hover:scale-105">
                Create booking
            </button>
        </div>
      </div>

      <div className="flex-grow bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
        <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-center">
                <button onClick={handlePrevYear} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </button>
                <span className="text-xl font-bold text-slate-900 w-24 text-center">
                    {viewingDate.getFullYear()}
                </span>
                <button onClick={handleNextYear} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </button>
            </div>
            <div className="flex items-center justify-around mt-2">
                {months.map((month, index) => (
                    <button
                        key={month}
                        onClick={() => handleMonthClick(index)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${viewingDate.getMonth() === index ? 'bg-sky-100 text-sky-600 border-2 border-sky-500' : 'text-slate-500 hover:bg-slate-100 border-2 border-transparent'}`}>
                        {month}
                    </button>
                ))}
            </div>
        </div>
        
        <div ref={bookingGridScrollRef} className="flex-1 overflow-auto relative">
          {isLoading && <div className="absolute inset-0 flex justify-center items-center"><p className="text-gray-500">Loading bookings...</p></div>}
          {error && <div className="absolute inset-0 flex justify-center items-center"><p className="text-red-500 font-semibold">{error}</p></div>}
          
          {!isLoading && !error && (
            <div className="relative w-fit min-w-full" style={{minHeight: `${(assignRows(bookings)?.length || 0) * 52 + 60}px`}}>
              <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm">
                <div className="flex">
                  {calendarDates.map(date => (
                    <div key={date.toISOString()} className="flex-shrink-0 w-20 h-12 flex items-center justify-center border-r border-gray-200">
                      <span className={`text-sm ${date.toDateString() === today.toDateString() ? 'font-bold text-sky-600' : 'text-gray-500'}`}>{date.getDate()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-12 left-0 right-0 bottom-0 flex">
                  {calendarDates.map((date, index) => (<div key={index} className="w-20 h-full border-r border-gray-200"></div>))}
              </div>
              {filteredBookings.length > 0 ? (
                <div className="absolute top-12 left-0 right-0 z-10">
                  {filteredBookings.map((booking) => {
                    const { style, isStartVisible, isEndVisible } = calculateBookingStyle(booking);
                    return (
                      <div key={booking.id} onClick={() => handleBookingClick(booking.id)} style={style} className="cursor-pointer p-1 transition-all duration-200 hover:scale-[1.02]">
                        <BookingBar booking={booking} isStartVisible={isStartVisible} isEndVisible={isEndVisible} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="absolute inset-0 flex justify-center items-center">
                  <p className="text-gray-500 text-lg">No bookings found for this period.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isCreateBookingModalOpen && <CreateBookingModal isOpen={isCreateBookingModalOpen} onClose={() => setIsCreateBookingModalOpen(false)} />}
      {selectedBooking && <BookingDetail isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} booking={selectedBooking} />}
    </div>
  );
}
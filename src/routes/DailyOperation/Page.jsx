import { useState, useRef, useEffect, useMemo } from "react";
import "./FrontDesk.css";
import CreateBookingModal from "./CreateBooking";
import BookingDetail from "./BookingDetail"; // Giả sử bạn có component này để xem chi tiết
import { getAllBookings, getBookingById } from "../../API/FrontDeskAPI"; // Sửa lại đường dẫn nếu cần

// --- Các hằng số styles và months ---
const bookingBarStyles = {
  "Due in": { head: "bg-yellow-500 text-white", tail: "bg-yellow-100 text-yellow-800" },
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

// --- Các component và hàm trợ giúp ---
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


export default function FrontDeskPage() {
  // --- STATE MANAGEMENT ---
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);

  const today = useMemo(() => new Date(), []);
  const [viewingDate, setViewingDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [search, setSearch] = useState("");
  const bookingGridScrollRef = useRef(null);

  // --- DATA FETCHING ---
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

  // --- Các hàm tính toán và handlers ---
  const calendarDates = useMemo(() => {
     const dates = [];
    const lastDayOfMonth = new Date(viewingDate.getFullYear(), viewingDate.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= lastDayOfMonth; day++) {
      dates.push(new Date(viewingDate.getFullYear(), viewingDate.getMonth(), day));
    }
    return dates;
  }, [viewingDate]);

  const filteredBookings = useMemo(() => {
    const viewStart = calendarDates[0];
    const viewEnd = new Date(calendarDates[calendarDates.length - 1]);
    viewEnd.setHours(23, 59, 59, 999);
    return bookings.filter(booking => booking.startDate <= viewEnd && booking.endDate >= viewStart);
  }, [calendarDates, bookings]);

  // ... (calculateBookingStyle và các hàm handlers khác ở đây)

  // --- RENDER ---
  return (
    <div className="flex flex-col h-full ml-[1rem]">
      <div>
        <p className="name">Front Desk</p>
        <p className="labeldash">_____________</p>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4 mt-2">
        {/* ... JSX cho legend và search bar ... */}
        <button
            onClick={() => setIsCreateBookingModalOpen(true)}
            className="w-36 h-10 bg-sky-600 text-white rounded-[30px] border border-sky-700"
          >
            Create booking
          </button>
      </div>

      <div className="w-full h-[80%] bg-white rounded-[30px] shadow-lg flex flex-col overflow-hidden">
        {/* ... JSX cho Header (chọn năm, tháng) ... */}
        
        <div ref={bookingGridScrollRef} className="flex-1 overflow-auto relative">
          {isLoading && <div className="absolute inset-0 flex justify-center items-center"><p>Loading bookings...</p></div>}
          {error && <div className="absolute inset-0 flex justify-center items-center"><p className="text-red-500">{error}</p></div>}
          {!isLoading && !error && (
            <div className="relative w-fit min-w-full" style={{minHeight: `${filteredBookings.length * 48 + 60}px`}}>
              {/* Sticky Day Headers */}
              <div className="sticky top-0 z-20 bg-white">
                <div className="flex">
                  {calendarDates.map(date => (
                    <div key={date.toISOString()} data-date-string={date.toDateString()} className="day-cell flex-shrink-0 w-20 h-12 flex items-center justify-center border-r border-slate-200">
                      <span className={`text-sm ${date.toDateString() === today.toDateString() ? 'font-bold text-blue-600' : 'text-slate-500'}`}>{date.getDate()}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Grid lines & Booking Bars */}
              <div className="absolute inset-0 z-10">
                {filteredBookings.map((booking, index) => {
                  // ... logic tính toán style ...
                  return (
                    <div key={booking.id} onClick={() => handleBookingClick(booking.id)} style={{ top: `${index * 48 + 60}px`, height: '40px' }} className="absolute cursor-pointer">
                      <BookingBar booking={booking} isStartVisible={true} isEndVisible={true} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateBookingModal isOpen={isCreateBookingModalOpen} onClose={() => setIsCreateBookingModalOpen(false)} />
      {selectedBooking && <BookingDetail isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} booking={selectedBooking} />}
    </div>
  );
}
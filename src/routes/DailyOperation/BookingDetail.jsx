import { useState, useEffect, useRef } from 'react';
import { updateBooking } from '../../API/FrontDeskAPI';

const statusStyles = {
  "Due In": "bg-yellow-100 text-yellow-800 border-yellow-400",
  "Checked In": "bg-green-100 text-green-800 border-green-400",
  "Due Out": "bg-orange-100 text-orange-800 border-orange-400",
  "Checked Out": "bg-blue-100 text-blue-800 border-blue-400",
};

export default function BookingDetail({ isOpen, onClose, booking, onBookingUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef(null);

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
    }
  }, [booking]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [statusMenuRef]);

  if (!isOpen || !booking) {
    return null;
  }
  
  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    setIsStatusMenuOpen(false);
  };
  
  const handleConfirmChanges = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setError('');
    try {
      const updatedData = { ...booking, status: selectedStatus };
      await updateBooking(booking.booking_id, updatedData);
      if (onBookingUpdate) {
        onBookingUpdate();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update booking.');
    } finally {
      setIsUpdating(false);
    }
  };

  const possibleStatuses = ['Due In', 'Checked In', 'Due Out', 'Checked Out'];
  
  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB');
  const formatCurrency = (amount) => (amount || 0).toLocaleString('vi-VN');
  const nights = Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000*60*60*24)) || 1;
  const roomTotal = (booking.nightly_rate || 0) * nights;
  const total = roomTotal + (roomTotal * 0.10);

  // --- MOVED HELPER COMPONENTS INSIDE TO FIX THE ERROR ---
  const InputField = ({ label, value }) => (
    <div className="bg-slate-50 p-3 rounded-lg w-full">
        <label className="text-xs text-slate-400 block mb-1">{label}</label>
        <p className="font-medium text-slate-700 truncate">{value || 'N/A'}</p>
    </div>
  );

  const InvoiceLineItem = ({ label, amount }) => (
    <div className="flex justify-between items-center text-slate-600">
        <span>{label}</span>
        <span className="font-medium">{amount.toLocaleString('vi-VN')}</span>
    </div>
  );
  // --- END OF MOVED SECTION ---

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-lg flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-4 m-4 transform transition-all max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start p-4">
          <h2 className="text-2xl font-bold text-slate-800">Booking #{booking.booking_id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-8 p-4">
          <div className="w-full md:w-3/5 space-y-6">
            {/* Guest, Reservation, Payment sections are unchanged */}
            <div>
                <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">GUEST</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Fullname" value={booking.guest_fullname} />
                    <InputField label="ID" value={booking.guest_id_card} />
                    <InputField label="Phone" value={booking.guest_phone} />
                    <InputField label="Email" value={booking.guest_email} />
                    <InputField label="Type" value={booking.guest_type_name} />
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">RESERVATION</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Check in" value={formatDate(booking.check_in)} />
                    <InputField label="Room type" value={booking.room_type_name} />
                    <InputField label="Adults" value={booking.adults} />
                    <InputField label="Check out" value={formatDate(booking.check_out)} />
                    <InputField label="Room no" value={booking.room_id} />
                    <InputField label="Children" value={booking.children} />
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">PAYMENT</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Nightly rate" value={`${formatCurrency(booking.nightly_rate)} VND`} />
                    <InputField label="Payment method" value={booking.payment_method} />
                </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">STATUS</p>
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              <div className="relative w-full sm:w-auto" ref={statusMenuRef}>
                <button
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  disabled={isUpdating}
                  className={`px-5 py-2 w-full sm:w-auto text-sm font-bold rounded-full border-2 transition-colors ${statusStyles[selectedStatus] || 'bg-gray-100 text-gray-800'}`}
                >
                  {selectedStatus}
                </button>
                {isStatusMenuOpen && (
                  <div className="absolute bottom-full mt-2 w-full sm:w-auto bg-white rounded-2xl shadow-lg border p-2 z-10 space-y-1">
                    {possibleStatuses.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`px-5 py-2 w-full text-left text-sm font-bold rounded-xl transition-colors ${selectedStatus === status ? statusStyles[status] : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={onClose} className="px-6 py-2 rounded-full font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Close</button>
              <button onClick={handleConfirmChanges} disabled={isUpdating} className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {isUpdating ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-2/5 bg-slate-50 rounded-2xl p-6">
            <div className="text-center mb-4">
              <h3 className="font-bold text-slate-800">Hotel Name</h3>
              <p className="text-sm font-semibold text-slate-600">Logo</p>
            </div>
            <div className="space-y-2 text-sm text-slate-600 mb-6">
              <div className="flex justify-between"><span className="font-semibold">Address:</span> <span>123 Example St, City</span></div>
              <div className="flex justify-between"><span className="font-semibold">Contact:</span> <span>099877542</span></div>
            </div>
            <div className="border-y border-slate-200 py-4 mb-4">
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span className="font-semibold">Fullname:</span> <span>{booking.guest_fullname}</span></div>
                <div className="flex justify-between"><span className="font-semibold">ID:</span> <span>{booking.guest_id_card}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Phone:</span> <span>{booking.guest_phone}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Email:</span> <span>{booking.guest_email}</span></div>
              </div>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Including</h4>
            <div className="space-y-3 text-sm">
              <InvoiceLineItem label={`Room - ${booking.room_type_name} (${nights} ${nights > 1 ? 'nights' : 'night'})`} amount={roomTotal} />
            </div>
            <div className="border-t border-slate-200 mt-4 pt-4 space-y-3 text-sm">
              <InvoiceLineItem label="VAT (10%)" amount={total - roomTotal} />
              <div className="flex justify-between items-center text-base font-bold text-slate-800 pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
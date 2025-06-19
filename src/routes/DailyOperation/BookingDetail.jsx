import React from 'react';

// A mapping for status colors, similar to what you have on the main page.
const statusStyles = {
  "Due in": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Check in": "bg-green-100 text-green-800 border-green-300",
  "Due out": "bg-orange-100 text-orange-800 border-orange-300",
  "Check out": "bg-blue-100 text-blue-800 border-blue-300",
};

/**
 * A modal component to display the details of a booking.
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {Function} props.onClose - The function to call when the modal should be closed.
 * @param {object} props.booking - The booking object containing details to display.
 */
export default function BookingDetail({ isOpen, onClose, booking }) {
  // If the modal is not open or there's no booking data, render nothing.
  if (!isOpen || !booking) {
    return null;
  }

  // Helper function to format dates for display.
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
      if(amount === undefined || amount === null) return 'N/A';
      return `${amount.toLocaleString('vi-VN')}`;
  }

  // Invoice Calculations
  const nights = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) || 1;
  const roomTotal = (booking.nightly_rate || 0) * nights;
  const servicesTotal = (booking.services || []).reduce((acc, service) => acc + service.price * service.quantity, 0);
  const subTotal = roomTotal + servicesTotal;
  const vat = subTotal * 0.10; // 10% VAT
  const additionalFee = subTotal * (booking.additional_fee_percent || 0);
  const total = subTotal + vat + additionalFee;


  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black/10 backdrop-blur-lg flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-4 m-4 transform transition-all duration-300 overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4">
            <h2 className="text-2xl font-bold text-slate-800">Booking #{booking.id}</h2>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 p-4">
            {/* Left Side: Booking Form */}
            <div className="w-full md:w-3/5 space-y-6">
                {/* Guest Information */}
                <div>
                    <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">GUEST</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Fullname" value={booking.guest} />
                    <InputField label="ID" value={booking.id_number} />
                    <InputField label="Phone" value={booking.phone} />
                    <InputField label="Email" value={booking.email} />
                    <InputField label="Type" value={booking.guest_type} />
                    </div>
                </div>

                {/* Reservation Details */}
                <div>
                    <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">RESERVATION</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Check in" value={formatDate(booking.startDate)} />
                    <InputField label="Room type" value={booking.room_type} />
                    <InputField label="Adults" value={booking.adults} />
                    <InputField label="Check out" value={formatDate(booking.endDate)} />
                    <InputField label="Room no" value={booking.room} />
                    <InputField label="Children" value={booking.children} />
                    </div>
                </div>

                {/* Payment Details */}
                <div>
                    <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">PAYMENT</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Nightly rate" value={`${formatCurrency(booking.nightly_rate)} VND`} />
                    <InputField label="Payment method" value={booking.payment_method} />
                    </div>
                </div>

                {/* Booking Status */}
                <div className="pt-2">
                    <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">STATUS</p>
                    <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 text-sm font-semibold rounded-full border-2 ${statusStyles[booking.status]}`}>
                            {booking.status}
                        </span>
                    </div>
                </div>

                 {/* Footer Buttons */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-full font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                    >
                        Close
                    </button>
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                    >
                        {booking.status === 'Check out' ? 'Confirm and Print Invoice' : 'Confirm'}
                    </button>
                </div>
            </div>

            {/* Right Side: Invoice Preview */}
            <div className="w-full md:w-2/5 bg-slate-50 rounded-2xl p-6">
                <div className="text-center mb-4">
                    <h3 className="font-bold text-slate-800">Tên khách sạn</h3>
                    <p className="text-sm font-semibold text-slate-600">Logo</p>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-6">
                    <div className="flex justify-between"><span className="font-semibold">Address:</span> <span>123 Example St, City</span></div>
                    <div className="flex justify-between"><span className="font-semibold">Contact:</span> <span>099877542</span></div>
                </div>

                <div className="border-y border-slate-200 py-4 mb-4">
                     <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between"><span className="font-semibold">Fullname:</span> <span>{booking.guest}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">ID:</span> <span>{booking.id_number}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Phone:</span> <span>{booking.phone}</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Email:</span> <span>{booking.email}</span></div>
                    </div>
                </div>
                
                <h4 className="font-bold text-slate-800 mb-2">Including</h4>
                <div className="space-y-3 text-sm">
                    <InvoiceLineItem label={`Room type (${nights} ${nights > 1 ? 'nights' : 'night'})`} amount={roomTotal} />
                     {(booking.services || []).map((service, index) => (
                         <InvoiceLineItem key={index} label={`${service.name} (x${service.quantity})`} amount={service.price * service.quantity}/>
                     ))}
                </div>

                <div className="border-t border-slate-200 mt-4 pt-4 space-y-3 text-sm">
                    <InvoiceLineItem label="VAT (10%)" amount={vat} />
                    {additionalFee > 0 && <InvoiceLineItem label={`Additional Fee (${(booking.additional_fee_percent*100).toFixed(0)}%)`} amount={additionalFee} />}
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

// A simple reusable component for displaying labeled data fields.
const InputField = ({ label, value }) => (
    <div className="bg-slate-50 p-3 rounded-lg w-full">
        <label className="text-xs text-slate-400 block mb-1">{label}</label>
        <p className="font-medium text-slate-700 truncate">{value || 'N/A'}</p>
    </div>
);

// A reusable component for a line item in the invoice.
const InvoiceLineItem = ({ label, amount }) => (
    <div className="flex justify-between items-center text-slate-600">
        <span>{label}</span>
        <span className="font-medium">{amount.toLocaleString('vi-VN')}</span>
    </div>
);

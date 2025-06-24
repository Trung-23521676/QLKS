import { useState, useEffect, useRef } from 'react';
import { updateBooking, deleteBookingById } from '../../API/FrontDeskAPI';
import { getAllGuestTypes } from '../../API/GuestTypeAPI';
import { getInvoiceByBookingId } from '../../API/invoiceAPI';

const statusStyles = {
  "Due In": "bg-yellow-100 text-yellow-800 border-yellow-400",
  "Checked In": "bg-green-100 text-green-800 border-green-400",
  "Due Out": "bg-orange-100 text-orange-800 border-orange-400",
  "Checked Out": "bg-blue-100 text-blue-800 border-blue-400",
};

const EditableField = ({ label, name, value, onChange, type = 'text', readOnly = false }) => (
    <div>
        <label className="text-xs font-semibold text-slate-500 block mb-1 tracking-wider">{label}</label>
        <input
            type={type}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            readOnly={readOnly}
            className={`w-full p-3 rounded-lg font-medium text-slate-700 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${readOnly ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`}
        />
    </div>
);

const InvoiceLineItem = ({ label, amount, isBold = false }) => (
    <div className={`flex justify-between items-center ${isBold ? 'font-bold text-slate-800 text-base' : 'text-slate-600'}`}>
        <span>{label}</span>
        <span className="font-medium">{(parseFloat(amount) || 0).toLocaleString('vi-VN')}</span>
    </div>
);


export default function BookingDetail({ isOpen, onClose, booking, onBookingUpdate }) {
  const [editableBooking, setEditableBooking] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef(null);
  
  const [isGuestTypeOpen, setIsGuestTypeOpen] = useState(false);
  const guestTypeMenuRef = useRef(null);
  const guestTypeOptions = ['National', 'International'];
  const [allGuestTypes, setAllGuestTypes] = useState([]);

  const [invoiceData, setInvoiceData] = useState(null);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);

   useEffect(() => {
    const fetchGuestTypes = async () => {
        try {
            const types = await getAllGuestTypes();
            setAllGuestTypes(types);
        } catch (error) {
            console.error("Không thể tải danh sách loại khách:", error);
            setError("Không thể tải danh sách loại khách.");
        }
    };
    fetchGuestTypes();
  }, []);

  useEffect(() => {
    if (booking) {
      const companionsWithTempId = (booking.companions || []).map(c => ({
        ...c,
        temp_id: Date.now() + Math.random()
      }));
      setEditableBooking({ ...booking, companions: companionsWithTempId });
      setInvoiceData(null); 
      if (booking.status === 'Checked Out') {
        fetchInvoiceData(booking.booking_id);
      }
    }
  }, [booking]);

  useEffect(() => {
    if (editableBooking?.status === 'Checked Out' && !invoiceData && !isInvoiceLoading) {
        fetchInvoiceData(editableBooking.booking_id);
    }
  }, [editableBooking?.status]);
  
  const fetchInvoiceData = async (bookingId) => {
    setIsInvoiceLoading(true);
    setError('');
    try {
      const data = await getInvoiceByBookingId(bookingId);
      setInvoiceData(data.invoice);
    } catch (err) {
      setError('Could not load invoice data.');
      console.error(err);
    } finally {
      setIsInvoiceLoading(false);
    }
  };


  useEffect(() => {
    function handleClickOutside(event) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }
      if (guestTypeMenuRef.current && !guestTypeMenuRef.current.contains(event.target)) {
        setIsGuestTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [statusMenuRef, guestTypeMenuRef]);

  if (!isOpen || !editableBooking) {
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (newStatus) => {
    setEditableBooking(prev => ({ ...prev, status: newStatus }));
    setIsStatusMenuOpen(false);
  };

 const handleGuestTypeChange = (newTypeName) => {
    setEditableBooking(prev => ({ ...prev, guest_type_name: newTypeName }));
    setIsGuestTypeOpen(false);
  };
  
  const handleAddCompanion = () => {
    const newCompanion = {
      temp_id: Date.now(),
      fullname: '',
      id_card: '',
      address: '',
      guest_type_id: 1,
      guest_type_name: 'National'
    };
    setEditableBooking(prev => ({
      ...prev,
      companions: [...(prev.companions || []), newCompanion]
    }));
  };

  const handleRemoveCompanion = (temp_id) => {
    if (window.confirm('Are you sure you want to remove this companion?')) {
      setEditableBooking(prev => ({
        ...prev,
        companions: prev.companions.filter(c => c.temp_id !== temp_id)
      }));
    }
  };

  const handleCompanionChange = (temp_id, field, value) => {
    const newCompanions = editableBooking.companions.map(comp => {
      if (comp.temp_id === temp_id) {
        const updatedComp = { ...comp, [field]: value };
        if (field === 'guest_type_name') {
            const selectedType = allGuestTypes.find(t => t.guest_type_name === value);
            if (selectedType) {
                updatedComp.guest_type_id = selectedType.guest_type_id;
            }
        }
        return updatedComp;
      }
      return comp;
    });
    setEditableBooking(prev => ({ ...prev, companions: newCompanions }));
  };
  
  const handleConfirmChanges = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setError('');
    try {
      await updateBooking(booking.booking_id, editableBooking);
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
  const handleDeleteBooking = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đặt phòng này không? Hành động này không thể hoàn tác.')) {
      return;
    }

    setIsUpdating(true);
    setError('');
    try {
      await deleteBookingById(booking.booking_id);
      alert('Xóa đặt phòng thành công!');
      onBookingUpdate();
      onClose();
    } catch (err) {
      setError(err.message || 'Xóa đặt phòng thất bại.');
    } finally {
      setIsUpdating(false);
    }
  };

  const possibleStatuses = ['Due In', 'Checked In', 'Due Out', 'Checked Out'];
  const formatDateForInput = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

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
          <div className={`w-full ${editableBooking.status === 'Checked Out' ? 'md:w-3/5' : 'md:w-full'} space-y-6 transition-all duration-300`}>
            
            <div>
                <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">GUEST</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableField label="Fullname" name="guest_fullname" value={editableBooking.guest_fullname} onChange={handleChange} />
                    <EditableField label="ID Card" name="guest_id_card" value={editableBooking.guest_id_card} onChange={handleChange} />
                    <EditableField label="Phone" name="guest_phone" value={editableBooking.guest_phone} onChange={handleChange} />
                    <EditableField label="Email" name="guest_email" value={editableBooking.guest_email} onChange={handleChange} type="email" />
                    <div className="relative" ref={guestTypeMenuRef}>
                        <label className="text-xs font-semibold text-slate-500 block mb-1 tracking-wider">Type</label>
                        <button type="button" onClick={() => setIsGuestTypeOpen(!isGuestTypeOpen)} className="w-full p-3 rounded-lg font-medium text-left text-slate-700 border border-slate-200 bg-white flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                            <span>{editableBooking.guest_type_name}</span>
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {isGuestTypeOpen && (
                            <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border z-20 py-1">
                                {allGuestTypes.map(type => (
                                    <button 
                                        key={type.guest_type_id} 
                                        type="button" 
                                        onClick={() => handleGuestTypeChange(type.guest_type_name)} 
                                        className={`block w-full text-left px-4 py-2 text-slate-700 transition-colors duration-150 ${editableBooking.guest_type_name === type.guest_type_name ? 'bg-blue-600 text-white' : 'hover:bg-blue-500 hover:text-white'}`}
                                    >
                                        {type.guest_type_name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-slate-500 tracking-wider">COMPANIONS</p>
                    <button 
                        type="button" 
                        onClick={handleAddCompanion}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        + Add Companion
                    </button>
                </div>
                <div className="space-y-4">
                    {(editableBooking.companions || []).map((companion, index) => (
                        <div key={companion.temp_id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                            <p className="text-xs font-bold text-slate-600 mb-3">Companion {index + 1}</p>
                            <button 
                                onClick={() => handleRemoveCompanion(companion.temp_id)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 rounded-full"
                                title="Remove Companion"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <EditableField 
                                    label="Fullname" 
                                    name="fullname" 
                                    value={companion.fullname} 
                                    onChange={(e) => handleCompanionChange(companion.temp_id, 'fullname', e.target.value)} 
                                />
                                <EditableField 
                                    label="ID Card" 
                                    name="id_card" 
                                    value={companion.id_card} 
                                    onChange={(e) => handleCompanionChange(companion.temp_id, 'id_card', e.target.value)}
                                />
                                <div className="md:col-span-2">
                                     <label className="text-xs font-semibold text-slate-500 block mb-1 tracking-wider">Type</label>
                                     <select
                                        value={companion.guest_type_name}
                                        onChange={(e) => handleCompanionChange(companion.temp_id, 'guest_type_name', e.target.value)}
                                        className="w-full p-3 rounded-lg font-medium text-slate-700 border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    >
                                        {allGuestTypes.map(type => (
                                            <option key={type.guest_type_id} value={type.guest_type_name}>
                                                {type.guest_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">RESERVATION</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <EditableField label="Check in" name="check_in" value={formatDateForInput(editableBooking.check_in)} onChange={handleChange} type="date" readOnly={true} />
                    <EditableField label="Room No" name="room_id" value={editableBooking.room_id} onChange={handleChange} readOnly={true} />
                    <EditableField label="Adults" name="adults" value={editableBooking.adults} onChange={handleChange} type="number" readOnly={true} />
                    <EditableField label="Check out" name="check_out" value={formatDateForInput(editableBooking.check_out)} onChange={handleChange} type="date" readOnly={true} />
                    <EditableField label="Room Type" name="room_type_name" value={editableBooking.room_type_name} onChange={handleChange} readOnly={true} />
                    <EditableField label="Children" name="children" value={editableBooking.children ?? 0} onChange={handleChange} type="number" readOnly={true} />
                </div>
            </div>

            <div>
                <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">PAYMENT</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditableField label="Nightly Rate (VND)" name="nightly_rate" value={editableBooking.nightly_rate} onChange={handleChange} type="number" readOnly={true} />
                    <EditableField label="Payment Method" name="payment_method" value={editableBooking.payment_method} onChange={handleChange} readOnly={true} />
                </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-500 mb-2 tracking-wider">STATUS</p>
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              <div className="relative w-full sm:w-auto" ref={statusMenuRef}>
                <button
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  disabled={isUpdating}
                  className={`px-5 py-2 w-full sm:w-auto text-sm font-bold rounded-full border-2 transition-colors ${statusStyles[editableBooking.status] || 'bg-gray-100 text-gray-800'}`}
                >
                  {editableBooking.status}
                </button>
                {isStatusMenuOpen && (
                  <div className="absolute bottom-full mb-2 w-full sm:w-auto bg-white rounded-2xl shadow-lg border p-2 z-10 space-y-1">
                    {possibleStatuses.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`px-5 py-2 w-full text-left text-sm font-bold rounded-xl transition-colors ${editableBooking.status === status ? statusStyles[status] : 'hover:bg-slate-100 text-slate-700'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

             <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={handleDeleteBooking}
                disabled={isUpdating}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Booking
              </button>

              <div className="flex gap-3">
                <button onClick={onClose} className="px-6 py-2 rounded-full font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Close</button>
                <button onClick={handleConfirmChanges} disabled={isUpdating} className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                  {isUpdating ? 'Saving...' : (editableBooking.status === 'Checked Out' ? 'Confirm and Print Invoice' : 'Confirm Changes')}
                </button>
              </div>
            </div>
          </div>
          
          {editableBooking.status === 'Checked Out' && (
            <div className="w-full md:w-2/5 bg-slate-50 rounded-2xl p-6">
              {isInvoiceLoading && <p className="text-center text-slate-500">Loading Invoice...</p>}
              {error && !isInvoiceLoading && <p className="text-center text-red-500">{error}</p>}

              {!isInvoiceLoading && invoiceData && (
                <>
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
                      <div className="flex justify-between"><span className="font-semibold">Fullname:</span> <span>{editableBooking.guest_fullname}</span></div>
                      <div className="flex justify-between"><span className="font-semibold">ID:</span> <span>{editableBooking.guest_id_card}</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Phone:</span> <span>{editableBooking.guest_phone}</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Email:</span> <span>{editableBooking.guest_email}</span></div>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">Including</h4>
                  <div className="space-y-3 text-sm">
                    {invoiceData.roomDetails.map((detail, index) => (
                        <InvoiceLineItem key={`room-${index}`} label={`Room - ${editableBooking.room_type_name} (${detail.night_count} nights)`} amount={detail.room_total} />
                    ))}
                    {invoiceData.serviceDetails.map((service, index) => (
                        <InvoiceLineItem key={`service-${index}`} label={`${service.service_name} (x${service.quantity})`} amount={service.service_total} />
                    ))}
                  </div>
                  <div className="border-t border-slate-200 mt-4 pt-4 space-y-3 text-sm">
                    <InvoiceLineItem label="Room Total" amount={invoiceData.total_room} />
                    <InvoiceLineItem label="Service Total" amount={invoiceData.total_service} />
                    <InvoiceLineItem label="Surcharges" amount={invoiceData.additional_fee} />
                    <InvoiceLineItem label={`VAT (${invoiceData.vat_rate * 100}%)`} amount={invoiceData.vat_amount} />
                    <InvoiceLineItem label="Total" amount={invoiceData.total} isBold={true} />
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
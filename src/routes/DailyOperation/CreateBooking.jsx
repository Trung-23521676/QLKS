import React, { useState, useEffect } from 'react';
import { createBooking } from '../../API/FrontDeskAPI';
import { getAvailableRooms } from '../../API/RoomAPI';
// Giả định có một hàm để lấy tất cả các loại phòng
import { getRoomTypeById, getAllRoomTypes } from '../../API/RoomTypeAPI'; 
import useDebounce from '../../hooks/DeBounce';

const CreateBookingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // --- State Hooks ---
  const [fullname, setFullname] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [guestTypeId, setGuestTypeId] = useState(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [nightlyRate, setNightlyRate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pay at hotel');
  const [companions, setCompanions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isFetchingRooms, setIsFetchingRooms] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const debouncedRoomTypeId = useDebounce(roomTypeId, 500);

  // --- START: MODIFICATION 1 ---
  const [allRoomTypes, setAllRoomTypes] = useState([]);

  // Effect to fetch all room types on component mount
  useEffect(() => {
    const fetchAllRoomTypes = async () => {
      try {
        const types = await getAllRoomTypes(); // Giả định API này tồn tại
        setAllRoomTypes(types || []);
      } catch (err) {
        console.error("Failed to fetch all room types:", err);
      }
    };
    fetchAllRoomTypes();
  }, []);
  // --- END: MODIFICATION 1 ---

  // --- Effect to fetch room data when dependencies change ---
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!debouncedRoomTypeId) {
        setSelectedRoomType(null);
        setNightlyRate('');
        setAvailableRooms([]);
        return;
      }

      try {
        const roomTypeDetails = await getRoomTypeById(debouncedRoomTypeId);
        setSelectedRoomType(roomTypeDetails);
        setNightlyRate(roomTypeDetails.price_room || '');
      } catch (err) {
        console.error("Failed to fetch room type details:", err);
        setSelectedRoomType(null);
        setNightlyRate('');
      }

      if (checkInDate && checkOutDate && adults > 0) {
        setIsFetchingRooms(true);
        setAvailableRooms([]);
        setRoomId('');
        try {
          const rooms = await getAvailableRooms({
            roomTypeId: debouncedRoomTypeId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            adults: adults,
            children: children
          });
          setAvailableRooms(rooms.map(id => ({ room_id: id })));
        } catch (err) {
          console.error("Failed to fetch available rooms:", err);
          setAvailableRooms([]);
        } finally {
          setIsFetchingRooms(false);
        }
      } else {
        setAvailableRooms([]);
      }
    };
    fetchRoomData();
  }, [debouncedRoomTypeId, checkInDate, checkOutDate, adults, children]);

  // --- Companion Management ---
  const addCompanion = () => {
    const numAdults = parseInt(adults, 10) || 1;
    const numChildren = parseInt(children, 10) || 0;
    if (!selectedRoomType || (numAdults + numChildren) > selectedRoomType.max_guests || (companions.length >= numAdults - 1)) {
      return;
    }
    setCompanions([...companions, { id: Date.now(), fullname: '', idNumber: '', guest_type_id: 1, address: '' }]);
  };

  const removeCompanion = (idToRemove) => {
    setCompanions(companions.filter(comp => comp.id !== idToRemove));
  };

  const handleCompanionChange = (id, field, value) => {
    const finalValue = field === 'guest_type_id' ? parseInt(value, 10) : value;
    setCompanions(companions.map(comp => comp.id === id ? { ...comp, [field]: finalValue } : comp));
  };

  // --- Form Submission ---
  const handleSubmit = async (e, status = 'Due In') => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const bookingData = {
      guest_fullname: fullname,
      guest_id_card: idNumber,
      guest_phone: phone,
      guest_email: email,
      guest_address: address,
      guest_type_id: guestTypeId,
      check_in: checkInDate,
      check_out: checkOutDate,
      room_type_id: roomTypeId,
      room_id: roomId,
      adults: parseInt(adults, 10),
      children: parseInt(children || 0, 10),
      payment_method: paymentMethod,
      status: status,
      nightly_rate: nightlyRate,
      companions: companions.map(c => ({
          fullname: c.fullname,
          id_card: c.idNumber,
          address: c.address,
          guest_type_id: c.guest_type_id,
      })),
    };
  };

  // --- Derived State for UI Logic ---
  const numAdults = parseInt(adults, 10) || 0;
  const numChildren = parseInt(children, 10) || 0;
  const isAddCompanionDisabled = !selectedRoomType || (numAdults + numChildren) > selectedRoomType.max_guests || companions.length >= numAdults - 1;

  // --- Render Method ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Create Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form className="p-6 space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
          <div className="relative">
            <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Guest</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Card / Passport</label>
                <input required type="text" placeholder="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={guestTypeId} onChange={(e) => setGuestTypeId(parseInt(e.target.value, 10))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                  <option value={1}>National</option>
                  <option value={2}>International</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Booking Details</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <input required type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                {/* --- START: MODIFICATION 2 --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                    <select 
                      required 
                      value={roomTypeId} 
                      onChange={(e) => setRoomTypeId(e.target.value)} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                        <option value="">Select a Room Type</option>
                        {allRoomTypes.map(type => (
                            <option key={type.room_type_id} value={type.room_type_id}>
                                {type.room_type_id} 
                            </option>
                        ))}
                    </select>
                </div>
                {/* --- END: MODIFICATION 2 --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                    <input required type="number" placeholder="Number of adults" min="1" value={adults} onChange={(e) => setAdults(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <input required type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
                    <input type="text" placeholder="Select from available rooms" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                    <input type="number" placeholder="Number of children" min="0" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
            </div>
            
            {selectedRoomType && (numAdults + numChildren) > selectedRoomType.max_guests && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    Warning: The total number of guests ({numAdults} Adults, {numChildren} Children) exceeds the maximum capacity of {selectedRoomType.max_guests} for this room type.
                </div>
            )}

            <div className="mt-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</span>
              <div className="flex gap-2 flex-wrap min-h-[38px] items-center p-2 bg-gray-50 rounded-lg">
                {isFetchingRooms && <p className="text-sm text-gray-500">Searching for rooms...</p>}
                {!isFetchingRooms && availableRooms.length > 0 && (
                  availableRooms.map(room => (
                    <button 
                      key={room.room_id} 
                      type="button" 
                      className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${roomId === room.room_id ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}
                      onClick={() => setRoomId(room.room_id)}>
                        {room.room_id}
                    </button>
                  ))
                )}
                {!isFetchingRooms && availableRooms.length === 0 && roomTypeId && checkInDate && checkOutDate &&(
                  <p className="text-sm text-gray-500">No available rooms for the selected dates/type.</p>
                )}
                {!(roomTypeId && checkInDate && checkOutDate) && (
                   <p className="text-sm text-gray-500">Please enter room type, check-in, and check-out dates.</p>
                )}
              </div>
            </div>
          </div>
          <div>
             <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase text-gray-500 font-semibold">Companions</p>
              <button 
                type="button" 
                onClick={addCompanion} 
                disabled={isAddCompanionDisabled} 
                className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add Companion
              </button>
            </div>
            {companions.map((companion, index) => (
              <div key={companion.id} className="relative border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Companion {index + 1}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" placeholder="Full Name" value={companion.fullname} onChange={(e) => handleCompanionChange(companion.id, 'fullname', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Card / Passport</label>
                    <input type="text" placeholder="ID Number" value={companion.idNumber} onChange={(e) => handleCompanionChange(companion.id, 'idNumber', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={companion.guest_type_id} onChange={(e) => handleCompanionChange(companion.id, 'guest_type_id', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                      <option value={1}>National  </option>
                      <option value={2}>International</option>
                    </select>
                  </div>
                   <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" placeholder="Address" value={companion.address} onChange={(e) => handleCompanionChange(companion.id, 'address', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"/>
                  </div>
                </div>
                <button type="button" onClick={() => removeCompanion(companion.id)} className="absolute top-2 right-0 p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200" title="Remove Companion">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
           <div>
            <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Payment</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night</label>
                <input type="text" placeholder="Select a room type" readOnly value={nightlyRate} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="Pay at hotel">Pay at Hotel</option>
                  <option value="Online payment">Online Payment</option>
                  <option value="Corporate billing">Corporate Billing</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, 'Checked In')} disabled={isLoading} className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save & check in'}
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, 'Due In')} disabled={isLoading} className="px-6 py-2 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600 disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingModal;
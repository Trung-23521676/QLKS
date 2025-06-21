
import { createBooking } from '../../API/FrontDeskAPI'; 

const CreateBookingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // --- STATE CHO CÁC TRƯỜNG TRONG FORM ---
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
  const recommendedRooms = ['A102', 'A122', 'B202'];

  // --- STATE ĐỂ XỬ LÝ VIỆC GỌI API ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- CÁC HÀM XỬ LÝ COMPANION ---
  const addCompanion = () => {
    if (companions.length < 3) {
      setCompanions([...companions, { id: Date.now(), fullname: '', idNumber: '', guest_type_id: 1, address: '' }]);
    }
  };
  const removeCompanion = (idToRemove) => {
    setCompanions(companions.filter(comp => comp.id !== idToRemove));
  };
  const handleCompanionChange = (id, field, value) => {
    const finalValue = field === 'guest_type_id' ? parseInt(value, 10) : value;
    setCompanions(companions.map(comp => comp.id === id ? { ...comp, [field]: finalValue } : comp));
  };

  // --- HÀM SUBMIT FORM HOÀN CHỈNH ---
  const handleSubmit = async (e, status = 'Due In') => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const bookingData = {
      guest_fullname: fullname, guest_id_card: idNumber, guest_phone: phone,
      guest_email: email, guest_address: address, guest_type_id: guestTypeId,
      check_in: checkInDate, check_out: checkOutDate, room_type_id: roomTypeId,
      room_id: roomId, adults: parseInt(adults, 10), children: parseInt(children || 0, 10),
      payment_method: paymentMethod, status: status,
      companions: companions.map(c => ({
          fullname: c.fullname, id_card: c.idNumber, address: c.address, guest_type_id: c.guest_type_id,
      })),
    };
    try {
      await createBooking(bookingData);
      alert('Booking created successfully!');
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Create booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form className="p-6 space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

          {/* --- GUEST INFORMATION --- */}
          <div className="relative">
            <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Guest</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fullname</label>
                <input type="text" placeholder="Fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input type="text" placeholder="ID" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={guestTypeId} onChange={(e) => setGuestTypeId(parseInt(e.target.value, 10))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                  <option value={1}>National</option>
                  <option value={2}>Foreign</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
              </div>
            </div>
          </div>

          {/* --- RESERVATION DETAILS --- */}
          <div>
            <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Reservation</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check in</label>
                    <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room type</label>
                    <input type="text" placeholder="Room Type ID" value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                    <input type="number" placeholder="Adults" min="1" value={adults} onChange={(e) => setAdults(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check out</label>
                    <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
                    <input type="text" placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                    <input type="number" placeholder="Children" min="0" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
            </div>
            <div className="mt-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">Recommended</span>
              <div className="flex gap-2 flex-wrap">
                {recommendedRooms.map(room => (<button key={room} type="button" className="px-4 py-2 border border-blue-300 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50" onClick={() => setRoomId(room)}>{room}</button>))}
              </div>
            </div>
          </div>
          
          {/* --- COMPANIONS --- */}
          <div>
             <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase text-gray-500 font-semibold">Companions</p>
              <button type="button" onClick={addCompanion} disabled={companions.length >= 3} className="flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add Companion
              </button>
            </div>
            {companions.map((companion, index) => (
              <div key={companion.id} className="relative border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Companion {index + 1}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fullname</label>
                    <input type="text" placeholder="Fullname" value={companion.fullname} onChange={(e) => handleCompanionChange(companion.id, 'fullname', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input type="text" placeholder="ID" value={companion.idNumber} onChange={(e) => handleCompanionChange(companion.id, 'idNumber', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={companion.guest_type_id} onChange={(e) => handleCompanionChange(companion.id, 'guest_type_id', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                      <option value={1}>National</option>
                      <option value={2}>Foreign</option>
                    </select>
                  </div>
                   <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" placeholder="Address" value={companion.address} onChange={(e) => handleCompanionChange(companion.id, 'address', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"/>
                  </div>
                </div>
                <button type="button" onClick={() => removeCompanion(companion.id)} className="absolute top-2 right-0 p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200" title="Remove companion">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          {/* --- PAYMENT --- */}
           <div>
            <p className="text-xs uppercase text-gray-500 font-semibold mb-3">Payment</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nightly rate</label>
                <input type="text" value={nightlyRate} onChange={(e) => setNightlyRate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="Pay at hotel">Pay at hotel</option>
                  <option value="Online payment">Online payment</option>
                  <option value="Corporate billing">Corporate billing</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50">
              Cancel
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, 'Check in')} disabled={isLoading} className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 disabled:opacity-50">
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
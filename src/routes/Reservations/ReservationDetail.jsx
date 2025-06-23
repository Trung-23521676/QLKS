  import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReservationById, updateReservation } from "../../API/ReservationAPI"; 
import { getAvailableRooms } from "../../API/RoomAPI";

export default function ReservationDetail() {
  const navigate = useNavigate();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [displayStatus, setDisplayStatus] = useState("Awaiting");
  const [roomId, setRoomId] = useState("");
  const [assignNote, setAssignNote] = useState("");
  const [reservationNote, setReservationNote] = useState("");
  const [declinedReason, setDeclinedReason] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (!reservation_id) {
      setIsLoading(false);
      setError("Reservation ID is missing from the URL.");
      return;
    }

    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getReservationById(reservation_id);
        setReservation(data);

        setDisplayStatus(data.status || "Awaiting");
        setRoomId(data.assigned_room || "");
        setReservationNote(data.reservation_note || "");
        setAssignNote(data.assign_note || "");
        setDeclinedReason(data.declined_reason || "");
        setPaymentMethod(data.payment_method || "Pay at hotel");

        if (data.status === 'Awaiting' && data.room_type_id) {
          try {
            const rooms = await getAvailableRooms({
              roomTypeId: data.room_type_id,
              checkIn: data.check_in,
              checkOut: data.check_out,
              adults: data.adults,
              children: data.children
            });
            setAvailableRooms(rooms.map(id => ({ room_id: id })));
          } catch (roomError) {
            console.error("Failed to fetch available rooms:", roomError);
            setAvailableRooms([]);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [reservation_id]); // SỬA LỖI: Dùng 'reservation_id' trong dependency array

  const handleSave = async () => {
    const updatedData = {
      ...reservation,
      status: displayStatus,
      reservation_note: reservationNote,
      assigned_room: roomId,
      assign_note: assignNote,
      declined_reason: declinedReason,
      payment_method: paymentMethod,
    };

    if (displayStatus === 'Confirmed') {
        updatedData.declined_reason = null;
    } else if (displayStatus === 'Declined') {
        updatedData.assigned_room = null;
        updatedData.assign_note = null;
    } else {
        updatedData.declined_reason = null;
    }

    try {
      // SỬA LỖI: Dùng 'reservation_id' khi gọi API update
      await updateReservation(reservation_id, updatedData);
      alert("Reservation updated successfully!");
      navigate("/Reservations");
    } catch (err) {
      alert(`Error updating reservation: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, '/');
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  }

  const renderAssignmentUI = () => {
    switch (displayStatus) {
        case 'Awaiting':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Gán phòng</label>
                <input
                  type="text"
                  placeholder="Chọn một phòng ở dưới"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phòng đề xuất</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableRooms.length > 0 ? (
                    availableRooms.map(room => (
                      <button
                        key={room.room_id}
                        onClick={() => setRoomId(room.room_id)}
                        className={`px-3 py-1 border rounded-full text-sm font-semibold transition-colors ${roomId === room.room_id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-50'}`}
                      >
                        {room.room_id}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Không có phòng trống cho loại phòng này.</p>
                  )}
                </div>
              </div>
            </div>
          );
        case 'Declined':
          return (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Lý do từ chối</label>
              <input
                 type="text"
                 value={declinedReason}
                 onChange={(e) => setDeclinedReason(e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          );
        case 'Confirmed':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phòng đã gán</label>
                <p className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-700 font-medium">{roomId || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Ghi chú gán phòng</label>
                <input
                   type="text"
                   value={assignNote}
                   onChange={(e) => setAssignNote(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          );
        default:
          return null;
      }
  };

  if (isLoading) return <div className="p-8">Loading reservation details...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!reservation) return <div className="p-8">Reservation not found.</div>;

  return (
    <div className="p-2 md:p-8 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservation #{reservation.reservation_id}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Thời gian</p>
            <p className="text-base text-gray-800">{formatFullDate(reservation.created_at)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 mr-4 flex-shrink-0"></div>
              <h3 className="text-xl font-semibold text-gray-800">{reservation.guest_fullname}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex"><p className="font-medium text-gray-600 w-20">ID</p>: {reservation.guest_id_card || 'N/A'}</div>
              <div className="flex"><p className="font-medium text-gray-600 w-20">Điện thoại</p>: {reservation.guest_phone}</div>
              <div className="flex"><p className="font-medium text-gray-600 w-20">Email</p>: {reservation.guest_email}</div>
              <div className="flex"><p className="font-medium text-gray-600 w-20">Địa chỉ</p>: {reservation.guest_address}</div>
              <div className="flex"><p className="font-medium text-gray-600 w-20">Loại khách</p>: {reservation.guest_type?.type_name || 'National'}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Phương thức thanh toán</p>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                  <option value="Pay at hotel">Thanh toán tại khách sạn</option>
                  <option value="Online payment">Thanh toán trực tuyến</option>
                  <option value="Corporate billing">Thanh toán qua công ty</option>
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phí phát sinh</p>
              <p className="text-base text-gray-800">{reservation.additional_fee || 'Không có'}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div><p className="text-sm font-medium text-gray-500">Check in</p><p className="text-lg font-semibold text-gray-800">{formatDate(reservation.check_in)}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Check out</p><p className="text-lg font-semibold text-gray-800">{formatDate(reservation.check_out)}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Loại phòng</p><p className="text-lg font-semibold text-gray-800">{reservation.room_type_id}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Số lượng phòng</p><p className="text-lg font-semibold text-gray-800">{reservation.number_of_rooms || 1}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Người lớn</p><p className="text-lg font-semibold text-gray-800">{reservation.adults}</p></div>
              <div><p className="text-sm font-medium text-gray-500">Trẻ em</p><p className="text-lg font-semibold text-gray-800">{reservation.children}</p></div>
            </div>
            <hr className="my-6 border-gray-200" />
            <div>
              <label className="text-sm font-medium text-gray-500">Ghi chú đặt trước</label>
              <textarea value={reservationNote} onChange={(e) => setReservationNote(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-gray-800 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-300"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row">
          <div className="md:w-1/2 md:pr-6 mb-6 md:mb-0">
            <p className="text-sm font-medium text-gray-500 mb-2">Trạng thái hiện tại</p>
            <select value={displayStatus} onChange={(e) => setDisplayStatus(e.target.value)} className="w-auto px-3 py-1 border border-blue-400 bg-blue-50 text-blue-700 rounded-full font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option value="Awaiting">Awaiting</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Declined">Declined</option>
            </select>
            <p className="text-sm font-medium text-gray-500 mt-4">Thay đổi lần cuối</p>
            <p className="text-base text-gray-800">{formatFullDate(reservation.updated_at)}</p>
          </div>
          <div className="w-full md:w-px bg-gray-200 mx-auto md:mx-0 h-px md:h-auto"></div>
          <div className="md:w-1/2 md:pl-6 mt-6 md:mt-0">
            {renderAssignmentUI()}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button onClick={() => navigate("/Reservations")} className="px-8 py-2.5 border border-gray-300 bg-white rounded-full text-gray-800 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">Quay lại</button>
        <button onClick={handleSave} className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Lưu</button>
      </div>
    </div>
  );
}

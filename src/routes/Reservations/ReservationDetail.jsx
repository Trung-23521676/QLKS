// src/routes/Reservations/ReservationDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ReservationDetail.css";
import { getReservationById, updateReservation } from "../../API/ReservationAPI"; // Import API

export default function ReservationDetail() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [reservation, setReservation] = useState(null); // State cho dữ liệu chi tiết
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho các trường có thể chỉnh sửa
  const [status, setStatus] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!bookingId) return;
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getReservationById(bookingId);
        setReservation(data);
        // Cập nhật state cho các trường edit
        setStatus(data.status);
        setRoomId(data.room_id || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [bookingId]);

  const handleSave = async () => {
    const updatedData = {
      // Chỉ gửi những trường có thể thay đổi
      status: status,
      room_id: roomId,
      // Thêm các trường khác nếu bạn cho phép sửa
      ...reservation, // Gửi lại dữ liệu cũ để backend không xóa các trường không thay đổi
    };
    
    try {
      await updateReservation(bookingId, updatedData);
      alert("Reservation updated successfully!");
      navigate("/Reservations");
    } catch (err) {
      alert(`Error updating reservation: ${err.message}`);
    }
  };

  if (isLoading) return <div className="p-4">Loading reservation details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!reservation) return <div className="p-4">Reservation not found.</div>;

  return (
    <div className="reservation-detail">
      <p className="name">Reservations - Details</p>
      <p className="labeldash">__________</p>
      <p className="id">Reservation #{reservation.booking_id}</p>
      {/* ...Phần JSX của bạn... */}
      {/* Thay thế dữ liệu giả bằng dữ liệu từ state `reservation` */}
      {/* Ví dụ: */}
      {/* <p>{reservation.guest_fullname}</p> */}
      {/* <p>{new Date(reservation.check_in).toLocaleDateString()}</p> */}
      
      {/* Ví dụ cho phần Status và Assigned Room */}
      <section className="detail-section">
        <div className="chartcard">
          <div className="rdata">
            <p className="bold">Current Status</p>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Due In">Due In</option>
              <option value="Check in">Check in</option>
              <option value="Due out">Due out</option>
              <option value="Check out">Check out</option>
            </select>
          </div>
          <div className="rdata">
            <p className="bold">Assigned room</p>
            <input
              type="text"
              className="roomNo"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="but">
        <button className="return-button" onClick={() => navigate("/Reservations")}>Return</button>
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
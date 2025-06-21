// src/routes/Reservations/Page.jsx

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Reservation.css";
import { getAllReservations } from "../../API/ReservationAPI"; // Import hàm API

export default function Reservations() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [reservations, setReservations] = useState([]); // State để lưu dữ liệu thật
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const data = await getAllReservations();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const StatusBadge = ({ status }) => {
    const className = `status-badge ${status.toLowerCase().replace(' ', '-')}`;
    return <span className={className}>{status}</span>;
  };
  
  const filteredReservations = reservations.filter((res) => {
    const query = search.toLowerCase();
    return (
      res.guest_fullname.toLowerCase().includes(query) ||
      String(res.booking_id).toLowerCase().includes(query)
    );
  });

  if (isLoading) return <div className="p-4">Loading reservations...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="rooms-container">
      <p className="name">Reservations</p>
      <p className="labeldash">_____________</p>
      <div className="rheader">
        <input
          type="text"
          placeholder="Search by name or booking ID"
          className="rsearch-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="rtable-container">
        <table className="table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Booking ID</th>
              <th>Check in</th>
              <th>Check out</th>
              <th>Room type ID</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((res) => (
                <tr key={res.booking_id}>
                  <td className="guest">{res.guest_fullname}</td>
                  <td>{res.booking_id}</td>
                  <td>{new Date(res.check_in).toLocaleDateString()}</td>
                  <td>{new Date(res.check_out).toLocaleDateString()}</td>
                  <td>{res.room_type_id}</td>
                  <td><StatusBadge status={res.status} /></td>
                  <td>
                    <button onClick={() => navigate(`/Reservations/${res.booking_id}`)} style={{ cursor: 'pointer' }}>
                      <ChevronRight size={16}/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="no-data">No matching reservations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
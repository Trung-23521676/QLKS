// src/routes/Reservations/Page.jsx

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Reservation.css";
import { getAllReservations } from "../../API/ReservationAPI"; 

export default function Reservations() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [reservations, setReservations] = useState([]);
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
    if (!status) {
        return <span className="status-badge unknown">Unknown</span>;
    }
    const className = `status-badge ${status.toLowerCase().replace(' ', '-')}`;
    return <span className={className}>{status}</span>;
  };
  
  const filteredReservations = reservations.filter((res) => {
    const query = search.toLowerCase();
    return (
      (res.guest_fullname || '').toLowerCase().includes(query) || 
      // SỬA LỖI: Tìm kiếm theo reservation_id
      String(res.reservation_id).toLowerCase().includes(query)
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
          placeholder="Search by name or reservation ID"
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
              {/* SỬA LỖI: Sửa tiêu đề cột */}
              <th>Reservation ID</th>
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
                // SỬA LỖI: Dùng reservation_id làm key
                <tr key={res.reservation_id}>
                  <td className="guest">{res.guest_fullname}</td>
                  {/* SỬA LỖI: Hiển thị reservation_id */}
                  <td>{res.reservation_id}</td>
                  <td>{new Date(res.check_in).toLocaleDateString()}</td>
                  <td>{new Date(res.check_out).toLocaleDateString()}</td>
                  <td>{res.room_type_id}</td>
                  <td><StatusBadge status={res.status} /></td>
                  <td>
                    {/* SỬA LỖI: Điều hướng đến đúng URL với reservationId */}
                    <button onClick={() => navigate(`/Reservations/${res.reservation_id}`)} style={{ cursor: 'pointer' }}>
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

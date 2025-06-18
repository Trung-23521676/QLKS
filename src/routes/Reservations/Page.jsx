import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Reservation.css"

export default function Reservations() {

  const navigate = useNavigate();

  const getFakeReservations = () => [
    {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Confirmed",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Declined",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Declined",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Zzzzzzzz",
    bookingId: "1111",
    checkIn: "11/11/2025",
    checkOut: "11/11/2025",
    roomType: "A",
    status: "Awaiting",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  ];

  const StatusBadge = ({ status }) => {
    const className = `status-badge ${
      status === "Confirmed"
        ? "status-confirmed"
        : status === "Declined"
        ? "status-declined"
        : "status-awaiting"
    }`;
    return <span className={className}>{status}</span>;
  };
  
  const [search, setSearch] = useState("");
  const [reservation, setReservation] = useState([]);

  useEffect(() => {
    setReservation(getFakeReservations());
  }, []);

  const filteredReservation = reservation.filter((reservation) => {
  const query = search.toLowerCase();
  return (
    reservation.name.toLowerCase().includes(query) ||
    reservation.bookingId.toLowerCase().includes(query)
  );
});

  return (
    <div className="rooms-container">
      <p className="name">Reservations</p>
      <p className="labeldash">__________</p>

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
              <th>Room type</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReservation.length > 0 ? (
              filteredReservation.map((reservation, index) => (
                <tr key={`${reservation.bookingId}-${index}`}>
                  <td className="guest">
                    <img
                      src={reservation.avatar}
                      alt={reservation.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {reservation.name}</td>
                  <td>{reservation.bookingId}</td>
                  <td>{reservation.checkIn}</td>
                  <td>{reservation.checkOut}</td>
                  <td>{reservation.roomType}</td>
                  <td>
                    <StatusBadge status={reservation.status} />
                  </td>
                  <td>
                    <button 
                      onClick={() => navigate(`/Reservations/${reservation.bookingId}`)}
                      style={{cursor: 'pointer'}}>
                      <ChevronRight size={16}/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-data">
                  No matching rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

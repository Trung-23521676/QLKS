import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ReservationDetail.css";
import { useNavigate } from "react-router-dom";


export default function ReservationDetail() {
  const navigate = useNavigate();

  const { bookingId } = useParams();
  const [status, setStatus] = useState("Confirmed");
  const [lastUpdated, setLastUpdated] = useState("");

  const [roomNumbers, setRoomNumbers] = useState(Array(2).fill(""));
  const [declineReason, setDeclineReason] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const guest = {
    avatar: "https://i.pravatar.cc/150?img=5",
    name: "Sannihheheheh",
    id: "1234",
    phone: "012345678",
    email: "123@gmail.com",
    address: "123 hehe, HCM",
    type: "National",
  };

  const reservation = {
    bookingId: "1234",
    timestamp: "2025-09-01T21:53:00+07:00",
    checkIn: "2025-09-03",
    checkOut: "2025-09-06",
    roomType: "A",
    numberOfRooms: 2,
    adults: 4,
    children: 0,
    note: "blabla bla...",
    paidMethod: "Pay at hotel",
    additionalFee: "International, extra people",
  };

  const handleStatusSelect = (newStatus) => {
    setStatus(newStatus);
    setShowDropdown(false);
  };

  const handleRoomNumberChange = (index, value) => {
    const updated = [...roomNumbers];
    updated[index] = value;
    setRoomNumbers(updated);
  };

  return (
    <div className="reservation-detail">
      <p className="name">Reservations - Details</p>
      <p className="labeldash">__________</p>
      <p className="id">Reservation #{reservation.bookingId}</p>

      <section className="detail-section">
        <div className="left">
          <div className="chartcard">
            <div className="ldatacontainer">
              <div className="rdata">
                <p className="label">Time</p>
                <p className="rcontent">{new Date(reservation.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="chartcard">
            <div className="ldatacontainer">
              <div className="avatar-block">
                <img src={guest.avatar} alt={guest.name} className="avatar" />
                <p className="rguest">{guest.name}</p>
              </div>
              {["ID", "Phone", "Email", "Address", "Type"].map((label, i) => (
                <div className="rdata" key={i}>
                  <p className="label">{label}</p>
                  <p className="rcontent">{guest[label.toLowerCase()]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="chartcard">
            <div className="ldatacontainer">
              <div className="rdata">
                <p className="label">Pay method</p>
                <p className="rcontent">{reservation.paidMethod}</p>
              </div>
              <div className="rdata">
                <p className="label">Additional fee</p>
                <p className="rcontent">{reservation.additionalFee}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="chartcard">
            <div className="datacontainer">
              <div className="rdata">
                <p className="label">Check in</p>
                <p className="bold">{reservation.checkIn}</p>
              </div>
              <hr className="line" />
              <div className="rdata">
                <p className="label">Check out</p>
                <p className="bold">{reservation.checkOut}</p>
              </div>
              <hr className="line" />
              <div className="data2">
                <div className="rdata">
                  <p className="label">Room type</p>
                  <p className="bold">{reservation.roomType}</p>
                </div>
                <div className="rdata">
                  <p className="label">Number of rooms</p>
                  <p className="bold">{reservation.numberOfRooms}</p>
                </div>
              </div>
              <hr className="line" />
              <div className="data2">
                <div className="rdata">
                  <p className="label">Adults</p>
                  <p className="bold">{reservation.adults}</p>
                </div>
                <div className="rdata">
                  <p className="label">Children</p>
                  <p className="bold">{reservation.children}</p>
                </div>
              </div>
              <hr className="line" />
              <p className="label">Reservation note</p>
              <input
                type="text"
                id="note"
                placeholder="Reservation note"
                className="rinput"
                value={reservation.note}
                readOnly
              />
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section">
  <div className="chartcard">
    <div className="rdata">
      <div className="datacontainer">
        <div className="rdata">
          <p className="bold">Current Status</p>
          <div className="status-dropdown-wrapper">
            <button
              className={`status-button ${status.toLowerCase()}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {status}
            </button>
            {showDropdown && (
              <ul className="dropdown">
                {["Confirmed", "Awaiting", "Declined"].map((s) => (
                  <li
                    key={s}
                    className={`dropdown-item ${s.toLowerCase()}`}
                    onClick={() => handleStatusSelect(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="rdata">
          <p className="label">Last change</p>
          <p className="rcontent">{lastUpdated ? new Date(lastUpdated).toLocaleString() : "Chưa có thay đổi"}</p>
        </div>
      </div>

      <hr className="vertical-line" />

      <div className="datacontainer">
        {status === "Confirmed" && (
          <div className="rdata" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <p className="bold">Assigned room</p>
            <div style={{ display: "flex", gap: 8 }}>
              {roomNumbers.map((room, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="roomNo"
                  value={room}
                  onChange={(e) => handleRoomNumberChange(idx, e.target.value)}
                />
              ))}
            </div>
          </div>
        )}

        {status === "Awaiting" && (
          <>
                <div className="datacontainer">
                  <div className="rdata">
                    <p className="bold">Assigned room</p>
                    {roomNumbers.map((room, idx) => (
                      <input
                        key={idx}
                        type="text"
                        className="roomNo"
                        value={room}
                        onChange={(e) => handleRoomNumberChange(idx, e.target.value)}
                      />
                    ))}
                  </div>
                  <div className="rdata">
                    <p className="label">Recommended</p>
                    {["B101", "B102", "B103"].map((rec, i) => (
                      <input
                        key={i}
                        type="text"
                        className="roomNo"
                        value={rec}
                        onChange={(e) => handleRoomNumberChange(idx, e.target.value)}
                        readOnly
                      />
                    ))}
                  </div>
                </div>
                
          </>
        )}

        {status === "Declined" && (
          <div className="rdata" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <p className="bold">Declined reason</p>
            <input
              type="text"
              className="decReason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  </div>
</section>


      <div className="but">
        <div 
          className="return-button"
          onClick={() => navigate("/Reservations")}>
            
          <button >Return</button>
        </div>
        <div className="save-button"
        onClick={() => {
            const now = new Date().toISOString();
            setLastUpdated(now);
            navigate("/Reservations");
          }}>
          <button 
          >Save</button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import "./Rooms.css";
import { fetchRooms } from "../../API/RoomAPI";
import { fetchRoomTypes } from "../../API/PricesAPI";

export default function Rooms() {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const filterRef = useRef(null);
  const buttonRef = useRef(null);

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleFloorChange = (floor) => {
    setSelectedFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomsData, typesData] = await Promise.all([fetchRooms(), fetchRoomTypes()]);
        setRooms(roomsData);
        setRoomTypes(typesData.map(t => t.room_type_id)); // e.g. "Single bed", "Double bed"
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu phòng:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.room_id.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(room.room_type_id);
    const matchesFloor =
      selectedFloors.length === 0 || selectedFloors.includes(`Floor - ${room.room_floor}`);
    return matchesSearch && matchesType && matchesFloor;
  });

  const StatusBadge = ({ status }) => {
    const className = `status-badge ${
      status === "Available" ? "status-available" : "status-booked"
    }`;
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="rooms-container">
      <p className="name">Rooms</p>
      <p className="labeldash">__________</p>

      <div className="labelsearch">
        <button className="filter" ref={buttonRef} onClick={() => setShowFilter(!showFilter)}>
          <SlidersHorizontal size={24} />
        </button>

        {showFilter && (
          <div className="filter-panel" ref={filterRef}>
            <div>
              <p className="filter-title">Room floor</p>
              <div className="filter-options">
                {[...Array(10)].map((_, index) => {
                  const floor = index + 1;
                  return (
                    <label key={floor} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedFloors.includes(`Floor - ${floor}`)}
                        onChange={() => handleFloorChange(`Floor - ${floor}`)}
                      />
                      {floor}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="filter-title">Room type</p>
              <div className="filter-options">
                {roomTypes.map((type) => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeChange(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="room-header">
          <input
            type="text"
            placeholder="Search by room ID"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rtable-container">
        <table className="table">
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Booking ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <tr key={`${room.room_id}-${index}`}>
                  <td>{room.room_id}</td>
                  <td>{room.room_type_id}</td>
                  <td>{room.room_floor}</td>
                  <td>{room.booking_id || ""}</td>
                  <td>
                    <StatusBadge status={room.is_booked_today ? "Booked" : "Available"} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="no-data">No matching rooms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

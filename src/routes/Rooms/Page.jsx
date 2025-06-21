<<<<<<< HEAD
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const rooms = [
  { number: "A045", type: "Double bed", floor: "Floor - 1", bookingId: "", status: "Available" },
  { number: "A020", type: "Single bed", floor: "Floor - 2", bookingId: "1111", status: "Booked" },
  { number: "B003", type: "VIP", floor: "Floor - 1", bookingId: "1111", status: "Reserved" },
  { number: "B040", type: "VIP", floor: "Floor - 1", bookingId: "1111", status: "Reserved" },
  { number: "C015", type: "Single bed", floor: "Floor - 1", bookingId: "1111", status: "Reserved" },
];

const statusColors = {
  Available: "bg-blue-100 text-blue-600",
  Booked: "bg-red-100 text-red-600",
  Reserved: "bg-green-100 text-green-600",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
      {status}
    </span>
  );
}
=======
import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import "./Rooms.css";
import { fetchRooms } from "../../API/RoomAPI";
import { fetchRoomTypes } from "../../API/PricesAPI";
>>>>>>> sanni

export default function Rooms() {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);
<<<<<<< HEAD
=======
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const filterRef = useRef(null);
  const buttonRef = useRef(null);
>>>>>>> sanni

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

<<<<<<< HEAD
  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      room.number.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase()) ||
      room.floor.toLowerCase().includes(search.toLowerCase()) ||
      room.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      room.status.toLowerCase().includes(search.toLowerCase());

    const matchType = selectedTypes.length === 0 || selectedTypes.includes(room.type);
    const matchFloor = selectedFloors.length === 0 || selectedFloors.includes(room.floor);

    return matchSearch && matchType && matchFloor;
  });

  return (
    <>
      <div>
          <p className="name">Prices</p>
          <p className="labeldash">__________</p>
      </div>
      <div className="flex items-center justify-between mb-4 relative">
        <button onClick={() => setShowFilter(!showFilter)}>
          <SlidersHorizontal className="text-gray-900" size={24} />
        </button>
        
        <div className="flex-1 flex justify-end text-black">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by Request ID, Room, Service, or Note"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 pl-4 pr-4 py-2 rounded-full text-sm bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {showFilter && (
          <div className="absolute top-10 left-0 z-10 w-64 p-4 bg-white border rounded-lg shadow-lg text-sm space-y-4 text-black">
            <div>
              <p className="font-semibold mb-1">Bed type</p>
              <div className="flex gap-2 flex-wrap">
                {["Single bed", "Double bed", "VIP"].map((type) => (
                  <label key={type} className="flex items-center gap-1">
=======
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
>>>>>>> sanni
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
<<<<<<< HEAD

            <div>
              <p className="font-semibold mb-1">Room floor</p>
              <div className="flex gap-2 flex-wrap">
                {["Floor - 1", "Floor - 2", "Floor - 3", "Floor - 4", "Floor - 5", "Floor - 6"].map((floor) => (
                  <label key={floor} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selectedFloors.includes(floor)}
                      onChange={() => handleFloorChange(floor)}
                    />
                    {floor.replace("Floor - ", "")}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1">Room facility</p>
              <div className="flex gap-2 flex-wrap">
                {["AC", "Shower", "TV", "Bathtub"].map((facility) => (
                  <label key={facility} className="flex items-center gap-1">
                    <input type="checkbox" />
                    {facility}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-blue-200 rounded-lg text-black">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Room number</th>
              <th className="px-4 py-2 text-left">Room type</th>
              <th className="px-4 py-2 text-left">Room floor</th>
              <th className="px-4 py-2 text-left">Booking ID</th>
              <th className="px-4 py-2 text-left">Status</th>
=======
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
>>>>>>> sanni
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
<<<<<<< HEAD
              filteredRooms.map((room) => (
                <tr key={room.number} className="bg-white border-b last:border-b-0">
                  <td className="px-4 py-2">{room.number}</td>
                  <td className="px-4 py-2">{room.type}</td>
                  <td className="px-4 py-2">{room.floor}</td>
                  <td className="px-4 py-2">{room.bookingId || "-"}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={room.status} />
=======
              filteredRooms.map((room, index) => (
                <tr key={`${room.room_id}-${index}`}>
                  <td>{room.room_id}</td>
                  <td>{room.room_type_id}</td>
                  <td>{room.room_floor}</td>
                  <td>{room.booking_id || ""}</td>
                  <td>
                    <StatusBadge status={room.is_booked ? "Booked" : "Available"} />
>>>>>>> sanni
                  </td>
                </tr>
              ))
            ) : (
              <tr>
<<<<<<< HEAD
                <td colSpan={5} className="px-4 py-3 text-center bg-white text-gray-500">
                  No matching rooms found.
                </td>
=======
                <td colSpan={5} className="no-data">No matching rooms found.</td>
>>>>>>> sanni
              </tr>
            )}
          </tbody>
        </table>
      </div>
<<<<<<< HEAD
    </>
=======
    </div>
>>>>>>> sanni
  );
}

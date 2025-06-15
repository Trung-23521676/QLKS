import React, { useEffect, useState } from "react";
import "./Table.css";
import { Pencil, X } from "lucide-react";

export default function RoomTable({ search }) {
  const [rooms, setRooms] = useState([]);

  // Dữ liệu giả
  const getFakeRooms = () => [
    {
      id: "1",
      roomTypeId: "A1",
      roomType: "A",
      area: 55,
      bed: "2 King",
      max: 4,
      price: 1000,
      surcharge: 0.15,
      rooms: "A102 - 2, A103 - 3",
      note: "",
    },
    {
      id: "2",
      roomTypeId: "A2",
      roomType: "A",
      area: 55,
      bed: "2 King",
      max: 4,
      price: 1000,
      surcharge: 0.15,
      rooms: "A204 - 2, A205 - 1",
      note: "",
    },
    {
      id: "3",
      roomTypeId: "B1",
      roomType: "B",
      area: 50,
      bed: "2 King",
      max: 4,
      price: 1000,
      surcharge: 0.15,
      rooms: "B107 - 4, B109 - 3",
      note: "",
    },
    {
      id: "4",
      roomTypeId: "B2",
      roomType: "B",
      area: 50,
      bed: "2 King",
      max: 4,
      price: 1000,
      surcharge: 0.15,
      rooms: "B204 - 2",
      note: "",
    },
    {
      id: "5",
      roomTypeId: "C1",
      roomType: "C",
      area: 40,
      bed: "2 King",
      max: 4,
      price: 1000,
      surcharge: 0.15,
      rooms: "C110 - 3",
      note: "",
    },
    {
      id: "6",
      roomTypeId: "C1",
      roomType: "C",
      area: 40,
      bed: "2 King",
      max: 4,
      price: 1000,
      surcharge: 0.15,
      rooms: "C110 - 3",
      note: "",
    },
    {
      id: "7",
      roomTypeId: "C1",
      roomType: "C",
      area: 40,
      bed: "2 King",
      max: 4,
      price: 1000,
      surcharge: 0.15,
      rooms: "C110 - 3",
      note: "",
    },
    {
      id: "8",
      roomTypeId: "C1",
      roomType: "C",
      area: 40,
      bed: "2 King",
      max: 4,
      price: 1000,
      surcharge: 0.15,
      rooms: "C110 - 3",
      note: "",
    },
  ];

  useEffect(() => {
    setRooms(getFakeRooms());
  }, []);

  const filteredData = search
    ? rooms.filter((room) =>
        room.roomTypeId.toLowerCase().includes(search.toLowerCase())
      )
    : rooms;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Room type id</th>
            <th>Room type</th>
            <th>Area</th>
            <th>Bed</th>
            <th>Max</th>
            <th>Price</th>
            <th>Surcharge</th>
            <th>Rooms</th>
            <th>Note</th>
            <th>Adjustment</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.slice(0, 5).map((room) => (
            <tr key={room.id}>
              <td>{room.roomTypeId}</td>
              <td>{room.roomType}</td>
              <td>{room.area}</td>
              <td>{room.bed}</td>
              <td>{room.max}</td>
              <td>{room.price}</td>
              <td>{room.surcharge}</td>
              <td>{room.rooms}</td>
              <td>{room.note}</td>
              <td className="actions">
                <button className="edit-btn">
                  <Pencil size={16} />
                </button>
                <button className="delete-btn">
                  <X size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

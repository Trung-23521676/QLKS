import React, { useEffect, useState } from "react";
import "./Table.css";
import { Pencil, X } from "lucide-react";
import {
  fetchRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../../API/PricesAPI";


export default function RoomTable({ rooms, search, onEdit, onDelete}) {

  const filteredData = search
    ? rooms.filter((rooms) =>
        rooms.room_type_id.toLowerCase().includes(search.toLowerCase())
      )
    : rooms;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Room type ID</th>
            <th>Room type</th>
            <th>Area</th>
            <th>Bed</th>
            <th>Max</th>
            <th>Price</th>
            <th>Surcharge</th>
            {/* <th>Rooms</th> */}
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.slice().map((rooms) => (
              <tr key={rooms.room_type_id}>
                <td>{rooms.room_type_id}</td>
                <td>{rooms.room_type_name}</td>
                <td>{rooms.room_size}</td>
                <td>{rooms.bed}</td>
                <td>{rooms.max_guests}</td>
                <td>{rooms.price_room}</td>
                <td>{rooms.surcharge_rate}</td>
                {/* <td>{room.rooms}</td> */}
                <td>{rooms.note}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => onEdit(rooms)}>
                    <Pencil size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(rooms)}>
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="no-data">No matching room types found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

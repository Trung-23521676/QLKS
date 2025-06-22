import React, { useState } from "react";
import "./CreateRoomNoModal.css";
import { X } from "lucide-react";
import { createRoomByRoomType } from "../../API/PricesAPI";

export default function CreateRoomNoModal({ isOpen, onClose, roomTypeId, onCreated }) {
  const [roomId, setRoomId] = useState("");
  const [floor, setFloor] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      if (!roomTypeId) {
        alert("Missing room type ID");
        return;
      }

      const newRoom = {
        room_id: roomId,
        room_type_id: roomTypeId,
        room_floor: floor,
        is_booked: 0
      };

      await createRoomByRoomType(roomTypeId, newRoom);
      setRoomId("");
      setFloor("");
      onCreated?.(); // callback reload
      onClose();
    } catch (err) {
      console.error("Failed to create room:", err);
      alert("Failed to create room");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="roomno-modal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Create room</p>

        <div className="form-container">
          <div className="form-group">
            <label className="label" htmlFor="roomId">Room ID</label>
            <input
              type="text"
              id="roomId"
              className="input"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="floor">Floor</label>
            <input
              type="number"
              id="floor"
              className="input"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
          </div>

          <button className="button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

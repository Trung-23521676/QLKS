import React, { useState, useEffect } from "react";
import "./CreateRoomNoModal.css";
import { X } from "lucide-react";
import { updateRoomByRoomType } from "../../API/PricesAPI";

export default function EditRoomNoModal({ roomNo, isOpen, onClose, roomTypeId, onUpdated }) {
  const [roomId, setRoomId] = useState("");
  const [floor, setFloor] = useState("");

  useEffect(() => {
    if (roomNo) {
      setRoomId(roomNo.room_id || "");
      setFloor(roomNo.room_floor?.toString() || "");
    }
  }, [roomNo]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      const updated = { room_id: roomId, room_floor: floor, room_type_id: roomTypeId, is_booked: 0 };
      await updateRoomByRoomType(roomTypeId, roomId, updated);
      onUpdated?.(); // callback reload
      onClose();
    } catch (err) {
      console.error("Failed to update room:", err);
      alert("Failed to update room");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="roomno-modal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Edit room</p>

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
              type="text"
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

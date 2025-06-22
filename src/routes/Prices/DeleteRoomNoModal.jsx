import React, { useState, useEffect } from "react";
import "./Delete.css";
import { X } from "lucide-react";
import { deleteRoomByRoomType } from "../../API/PricesAPI";

export default function DeleteRoomNoModal({ roomNo, isOpen, onClose, roomTypeId, onDeleted }) {
  const [roomId, setRoomId] = useState("");
  const [floor, setFloor] = useState("");

  useEffect(() => {
    if (roomNo) {
      setRoomId(roomNo.room_id || "");
      setFloor(roomNo.room_floor?.toString() || "");
    }
  }, [roomNo]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await deleteRoomByRoomType(roomTypeId, roomId);
      onDeleted?.();
      onClose();
    } catch (err) {
      console.error("Failed to delete room:", err);
      alert("Failed to delete room");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="roomno-modal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Delete this room?</p>

        <div className="form-container">
          <div className="form-group">
            <label className="label">Room ID</label>
            <input type="text" className="input" value={roomId} readOnly />
          </div>
          <div className="form-group">
            <label className="label">Floor</label>
            <input type="text" className="input" value={floor} readOnly />
          </div>

          <button className="button1" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

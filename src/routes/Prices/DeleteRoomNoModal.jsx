import React from "react";
import "./Delete.css";
import { X } from "lucide-react";
import RoomNoTable from "./RoomNoTable";
import { useState, useEffect } from "react";

export default function DeleteRoomNoModal({ roomNo, isOpen, onClose }) {
  if (!isOpen) return null;

  const [roomId, setRoomId] = useState("");
  const [floor, setFloor] = useState("");

  useEffect(() => {
    if (roomNo) {
      setRoomId(roomNo.roomId || "");
      setFloor(roomNo.floor?.toString() || "");
    }
  }, [roomNo]);

  const handleSave = async () => {
    console.log("saved");
  }

  return (
    <div className="modal-overlay">
      <div className="roomno-modal-content">
            
        <button className="close-button" onClick={onClose}>
            <X size={24} />
        </button>

        <p className="title">Delete this room?</p>

        <div className="form-container">
            <div className="form-group">
                <label 
                className="label"
                htmlFor="roomId">
                    Room ID
                </label>
                <input
                type="text"
                id="roomId"
                placeholder="Enter room ID"
                className="input"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                readOnly
                />
            </div>

            <div className="form-group">
                <label 
                className="label"
                htmlFor="floor">
                    Floor
                </label>
                <input
                type="text"
                id="floor"
                placeholder="Enter room floor"
                className="input"
                value={floor}
                onChange={e => setFloor(e.target.value)}
                readOnly
                />
            </div>
            
            <button className="button1" onClick={handleSave}>
                Delete
            </button>
        </div>
        
      </div>
    </div>
  );
}

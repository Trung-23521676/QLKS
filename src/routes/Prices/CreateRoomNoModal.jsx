import React from "react";
import "./CreateRoomNoModal.css";
import { X } from "lucide-react";
import RoomNoTable from "./RoomNoTable";
import { useState } from "react";

export default function CreateRoomNoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [roomId, setRoomId] = useState("");
  const [floor, setFloor] = useState("");

  const handleSave = async () => {
    console.log("saved");
  }

  return (
    <div className="modal-overlay">
      <div className="roomno-modal-content">
            
        <button className="close-button" onClick={onClose}>
            <X size={24} />
        </button>

        <p className="title">Create room</p>

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
                />
            </div>

            <div className="form-group">
                <label 
                className="label"
                htmlFor="floor">
                    Floor
                </label>
                <input
                type="number"
                id="floor"
                placeholder="Enter room floor"
                className="input"
                value={floor}
                onChange={e => setFloor(e.target.value)}
                />
            </div>
            
            <button className="button" onClick={handleSave}>
                Save
            </button>
        </div>
        
      </div>
    </div>
  );
}

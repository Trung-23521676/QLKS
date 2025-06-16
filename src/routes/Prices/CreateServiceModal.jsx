import React from "react";
import "./CreateServiceModal.css";
import { X } from "lucide-react";
import RoomNoTable from "./RoomNoTable";
import { useState } from "react";

export default function CreateServiceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSave = async () => {
    console.log("saved");
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
            
        <button className="close-button" onClick={onClose}>
            <X size={24} />
        </button>

        <p className="title">Create service</p>

        <div className="form-container">
            <div className="form-group">
                <label 
                className="label"
                htmlFor="serviceId">
                    Service ID
                </label>
                <input
                type="text"
                id="serviceId"
                placeholder="Enter service ID"
                className="input"
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label 
                className="label"
                htmlFor="name">
                    Name
                </label>
                <input
                type="text"
                id="name"
                placeholder="Enter service name"
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label 
                className="label"
                htmlFor="price">
                    Price
                </label>
                <input
                type="text"
                id="price"
                placeholder="Enter price"
                className="input"
                value={price}
                onChange={e => setPrice(e.target.value)}
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

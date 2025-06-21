import React from "react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import "./Create.css"
import { createServiceRequest } from "../../API/ServiceAPI";

export default function CreateRequestModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const services = [
  "Room Cleaning",
  "Food Delivery",
  "Laundry",
  "Spa Booking",
  "Wake-up Call",
  "Taxi Booking",
];

  const [requestId, setRequestId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleCreate = async () => {
  const requestData = {
    request_id: requestId,
    room_id: roomNumber,
    service_id: service,
    amount: parseFloat(amount),
    note,
  };

  try {
    await createServiceRequest(requestData);
    console.log("Service request created:", requestData);
    onSuccess(); // gọi lại parent để cập nhật danh sách
    onClose();     // đóng modal
  } catch (error) {
    console.error("Lỗi khi tạo yêu cầu dịch vụ:", error);
    alert("Failed to create service request.");
  }
};

  useEffect(() => {
    const generateId = () => {
      const random = Math.floor(1000 + Math.random() * 9000);
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      return `SR-${today}-${random}`;
    };
    setRequestId(generateId());
  }, []);

  return (
    <div className="modal-overlay">
      <div className="smodal-content">
            
        <button className="close-button" onClick={onClose}>
            <X size={24} />
        </button>

        <p className="title">Create request</p>

        <div className="form-container">

            <div className="form-group">
                <label 
                className="label"
                htmlFor="roomNumber">
                    Room number
                </label>
                <input
                type="text"
                id="roomNumber"
                placeholder="Enter room number"
                className="input"
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label 
                className="label"
                htmlFor="service">
                    Service ID
                </label>
                {/* <select
                  id="service"
                  className="select"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                <option value="">-- Select a service --</option>
                  {services.map((srv, index) => (
                   <option key={index} value={srv}>
                    {srv}
                </option>
                  ))}
                </select> */}
                <input
                type="text"
                id="service"
                placeholder="Enter service id"
                className="input"
                value={service}
                onChange={e => setService(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label 
                className="label"
                htmlFor="amount">
                    Amount
                </label>
                <input
                type="text"
                id="amount"
                placeholder="Enter service amount"
                className="input"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label 
                className="label"
                htmlFor="note">
                    Note
                </label>
                <input
                type="text"
                id="note"
                placeholder="Enter note"
                className="input"
                value={note}
                onChange={e => setNote(e.target.value)}
                />
            </div>
            
            <button className="button" onClick={handleCreate}>
                Save
            </button>
        </div>
        
      </div>
    </div>
  );
}

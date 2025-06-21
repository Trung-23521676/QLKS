import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./Create.css";
import { updateServiceRequest } from "../../API/ServiceAPI";

export default function EditRequestModal({ request, isOpen, onClose, onSuccess }) {
  if (!isOpen || !request) return null;

  const services = [
    "Room Cleaning",
    "Food Delivery",
    "Laundry",
    "Spa Booking",
    "Wake-up Call",
    "Taxi Booking",
  ];

  const [roomNumber, setRoomNumber] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setRoomNumber(request.room_id || "");
    setService(request.service_id || "");
    setAmount(request.amount?.toString() || "");
    setNote(request.note || "");
  }, [request]);

  const handleSave = async () => {
    try {
      await updateServiceRequest(request.request_id, {
        room_id: roomNumber,
        service_id: service,
        amount: Number(amount),
        note: note,
        status: request.status // giữ nguyên status cũ
      });

      if (onSuccess) onSuccess(); // cập nhật lại danh sách nếu cần
      onClose(); // đóng modal
    } catch (error) {
      console.error("Failed to update request:", error);
      alert("Failed to update request. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="smodal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Edit request</p>

        <div className="form-container">
          <div className="form-group">
            <label className="label" htmlFor="roomNumber">Room number</label>
            <input
              type="text"
              id="roomNumber"
              className="input"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="service">Service</label>
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
            <label className="label" htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="note">Note</label>
            <input
              type="text"
              id="note"
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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

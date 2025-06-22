import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./Delete.css";
import { deleteServiceRequest } from "../../API/ServiceAPI";

export default function DeleteRequestModal({ request, isOpen, onClose, onSuccess }) {
  if (!isOpen || !request) return null;

  const [roomNumber, setRoomNumber] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (request) {
      setRoomNumber(request.room_id || "");
      setService(request.service_id || "");
      setAmount(request.amount?.toString() || "");
      setNote(request.note || "");
    }
  }, [request]);

  const handleDelete = async () => {
    try {
      await deleteServiceRequest(request.request_id);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete request:", error);
      alert("Failed to delete request. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="smodal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Delete this request?</p>

        <div className="form-container">
          <div className="form-group">
            <label className="label">Room number</label>
            <input className="input" value={roomNumber} readOnly />
          </div>

          <div className="form-group">
            <label className="label">Service</label>
            <input className="input" value={service} readOnly />
          </div>

          <div className="form-group">
            <label className="label">Amount</label>
            <input className="input" value={amount} readOnly />
          </div>

          <div className="form-group">
            <label className="label">Note</label>
            <input className="input" value={note} readOnly />
          </div>

          <button className="dbutton" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { createGuestType } from "../../API/PricesAPI";
import "./CreateServiceModal.css"
import { X } from "lucide-react";

export default function CreateGuestTypeModal({ isOpen, onClose, onSuccess }) {
  const [guest_type_name, setGuestTypeName] = useState("");
  const [surcharge_rate, setSurchargeRate] = useState("");

  const handleCreate = async () => {
    try {
      await createGuestType({ guest_type_name, surcharge_rate });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to create guest type.");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
            <X size={24} />
        </button>
        <p className="title">Create guest type</p>
        <div className="form-container">
        <div className="form-group">
                <label 
                className="label"
                htmlFor="guestType">
                    Guest type
                </label>
                <input
                type="text"
                id="guestType"
                placeholder="Enter guest type name"
                className="input"
                value={guest_type_name}
                onChange={e => setGuestTypeName(e.target.value)}
                />
            </div>
            

            <div className="form-group">
                <label 
                className="label"
                htmlFor="surcharge">
                    Surcharge
                </label>
                <input
                type="text"
                id="surcharge"
                placeholder="Enter surcharge rate"
                className="input"
                value={surcharge_rate}
                onChange={e => setSurchargeRate(e.target.value)}
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

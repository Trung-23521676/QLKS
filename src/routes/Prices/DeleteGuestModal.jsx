import React, {useState, useEffect} from "react";
import "./Delete.css"
import { deleteGuestType } from "../../API/PricesAPI";
import { X } from "lucide-react";

export default function DeleteGuestTypeModal({ isOpen, onClose, onSuccess, guest }) {
  const [guest_type_name, setGuestTypeName] = useState("");
    const [surcharge_rate, setSurchargeRate] = useState("");

  useEffect(() => {
      if (guest) {
        setGuestTypeName(guest.guest_type_name);
        setSurchargeRate(guest.surcharge_rate);
      }
    }, [guest]);
  const handleDelete = async () => {
    try {
      await deleteGuestType(guest.guest_type_id);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to delete guest type.");
    }
  };

  if (!isOpen || !guest) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
            <X size={24} />
        </button>
        <p className="title">Delete guest type</p>
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
                readOnly
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
                readOnly
                />
            </div>
            
            <button className="button1" onClick={handleDelete}>
                Delete
            </button>
            </div>
      </div>
    </div>
  );
}

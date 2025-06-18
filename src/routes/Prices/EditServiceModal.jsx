import React, { useEffect, useState } from "react";
import "./CreateServiceModal.css";
import { X } from "lucide-react";
import { updateService } from "../../API/PricesAPI";

export default function EditServiceModal({ service, onClose, onSuccess }) {
  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
  if (service) {
    setServiceId(service.service_id || "");
    setName(service.service_name || "");
    setPrice(service.price_service || "");
  }
}, [service]);

  const handleSave = async () => {
    const updatedService = {
      service_name: name,
      price_service: parseFloat(price),
    };

    try {
      await updateService(serviceId, updatedService);
      console.log("Service updated");
      onClose();
      onSuccess(); // gọi lại fetch nếu cần
    } catch (error) {
      console.error("Lỗi khi cập nhật service:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Edit service</p>

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
                readOnly
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

import React, { useEffect, useState } from "react";
import "./Delete.css";
import { X } from "lucide-react";
import { deleteService } from "../../API/PricesAPI";

export default function DeleteServiceModal({ service, onClose, onSuccess }) {
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

  const handleDelete = async () => {
    try {
      await deleteService(serviceId); // 👈 Gọi API xóa
      console.log("Service deleted");
      onClose(); // Đóng modal
      onSuccess(); // Refresh lại danh sách nếu cần
    } catch (error) {
      console.error("Lỗi khi xóa service:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Delete this service?</p>

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
                readOnly
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

import React, { useEffect, useState } from "react";
import "./CreateServiceModal.css";
import { X } from "lucide-react";

export default function EditServiceModal({ service, onClose }) {
  const [serviceId, setServiceId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
  if (service) {
    setServiceId(service.serviceId || "");
    setName(service.name || "");
    setPrice(service.price || "");
  }
}, [service]);

  const handleSave = async () => {
    // // Gửi dữ liệu cập nhật lên backend hoặc lưu vào state (nếu dùng local)
    // const updatedRoom = {
    //   ...room,
    //   roomTypeId,
    //   roomType,
    //   area: Number(area),
    //   bed,
    //   max: Number(max),
    //   price: Number(price),
    //   surcharge: Number(surcharge),
    // };
    console.log("Saving service");
    // // Đóng modal sau khi lưu
    // onClose();
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

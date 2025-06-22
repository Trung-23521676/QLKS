import React, { useEffect, useState } from "react";
import "./CreateRoomModal.css";
import { X } from "lucide-react";
import RoomNoTable from "./RoomNoTable";
import { updateRoomType } from "../../API/PricesAPI";

export default function EditRoomModal({ room, onClose, onSuccess }) {
  const [roomTypeId, setRoomTypeId] = useState("");
  const [roomType, setRoomType] = useState("");
  const [area, setArea] = useState("");
  const [bed, setBed] = useState("");
  const [max, setMax] = useState("");
  const [price, setPrice] = useState("");
  const [surcharge, setSurcharge] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (room) {
      setRoomTypeId(room.room_type_id || "");
      setRoomType(room.room_type_name || "");
      setArea(room.room_size?.toString() || "");
      setBed(room.bed || "");
      setMax(room.max_guests?.toString() || "");
      setPrice(room.price_room?.toString() || "");
      setSurcharge(room.surcharge_rate?.toString() || "");
      setNote(room.note || "");
    }
  }, [room]);

  const handleSave = async () => {
    try {
      const updatedData = {
        room_type_name: roomType,
        room_size: Number(area),
        bed,
        max_guests: Number(max),
        price_room: Number(price),
        surcharge_rate: Number(surcharge),
        note,
      };

      await updateRoomType(roomTypeId, updatedData);
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Lỗi khi cập nhật room type:", err);
      alert("Failed to update room type");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="room-modal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Edit room type</p>

        <div className="form-container">
          <div className="form-group">
            <label className="label" htmlFor="roomTypeId">Room type ID</label>
            <input
              type="text"
              id="roomTypeId"
              className="input"
              value={roomTypeId}
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="roomType">Room type</label>
            <input
              type="text"
              id="roomType"
              className="input"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="area">Area</label>
            <input
              type="text"
              id="area"
              className="input"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="bed">Bed</label>
            <input
              type="text"
              id="bed"
              className="input"
              value={bed}
              onChange={(e) => setBed(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="max">Max</label>
            <input
              type="text"
              id="max"
              className="input"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="price">Price</label>
            <input
              type="text"
              id="price"
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="surcharge">Surcharge</label>
            <input
              type="text"
              id="surcharge"
              className="input"
              value={surcharge}
              onChange={(e) => setSurcharge(e.target.value)}
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

          <p className="dash">
            _________________________________________________________________________________________
          </p>

          <RoomNoTable
            search=""
            readOnly={false}
            roomTypeId={roomTypeId}
            onSuccess={onSuccess}
          />

          <button className="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

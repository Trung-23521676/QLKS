import React, { useEffect, useState } from "react";
import "./CreateRoomModal.css";
import { X } from "lucide-react";
import RoomNoTable from "./RoomNoTable";

export default function EditRoomModal({ room, onClose }) {
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
    setRoomTypeId(room.roomTypeId || "");
    setRoomType(room.roomType || "");
    setArea(room.area?.toString() || "");
    setBed(room.bed || "");
    setMax(room.max?.toString() || "");
    setPrice(room.price?.toString() || "");
    setSurcharge(room.surcharge?.toString() || "");
    setNote(room.note?.toString() || "");
  }
}, [room]);

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
    console.log("Saving room:");
    // // Đóng modal sau khi lưu
    // onClose();
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
            <label className="label" htmlFor="roomTypeId">
              Room type ID
            </label>
            <input
              type="text"
              id="roomTypeId"
              placeholder="Enter room type ID"
              className="input"
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="roomType">
              Room type
            </label>
            <input
              type="text"
              id="roomType"
              placeholder="Enter room type"
              className="input"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="area">
              Area
            </label>
            <input
              type="text"
              id="area"
              placeholder="Enter room area"
              className="input"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="bed">
              Bed
            </label>
            <input
              type="text"
              id="bed"
              placeholder="Enter bed type"
              className="input"
              value={bed}
              onChange={(e) => setBed(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="max">
              Max
            </label>
            <input
              type="text"
              id="max"
              placeholder="Enter max guests"
              className="input"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="price">
              Price
            </label>
            <input
              type="text"
              id="price"
              placeholder="Enter price"
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="surcharge">
              Surcharge
            </label>
            <input
              type="text"
              id="surcharge"
              placeholder="Enter surcharge"
              className="input"
              value={surcharge}
              onChange={(e) => setSurcharge(e.target.value)}
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

          <p className="dash">
            _________________________________________________________________________________________
          </p>

          <RoomNoTable />

          <button className="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

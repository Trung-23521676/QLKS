import React, { useEffect, useState } from "react";
import "./Delete.css";
import { X } from "lucide-react";
import RoomNoTable from "./RoomNoTable";
import { deleteRoomType } from "../../API/PricesAPI";

export default function DeleteRoomModal({ room, onClose, onSuccess }) {
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
  const handleDelete = async () => {
  try {
    await deleteRoomType(roomTypeId);
    console.log("Đã xoá room type:", roomTypeId);
    onClose();     // Đóng modal
    onSuccess();   // Refresh lại danh sách
  } catch (err) {
    console.error("Lỗi khi xoá room type:", err);
    alert("Xoá thất bại. Vui lòng thử lại.");
  }
};

  return (
    <div className="modal-overlay">
      <div className="room-modal-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <p className="title">Delete this room type?</p>

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
              readOnly
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
              readOnly
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
              readOnly
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
              readOnly
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
              readOnly
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
              readOnly
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
              readOnly
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
                readOnly
                />
            </div>

          <p className="dash">
            _________________________________________________________________________________________
          </p>

          <RoomNoTable readOnly={true}/>

          <button className="button1" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

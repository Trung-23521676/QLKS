import React, { useEffect, useState } from "react";
import "./RoomNoTable.css";
import { Pencil, X, Plus } from "lucide-react";
import CreateRoomNoModal from "./CreateRoomNoModal";
import EditRoomNoModal from "./EditRoomNoModal";
import DeleteRoomNoModal from "./DeleteRoomNoModal";
import { fetchRoomsByRoomType } from "../../API/PricesAPI";

export default function RoomNoTable({ search, readOnly, roomTypeId, onSuccess }) {
  const [roomNo, setRoomNo] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      const res = await fetchRoomsByRoomType(roomTypeId);
      setRoomNo(res);
    } catch (err) {
      console.error("Failed to fetch room no:", err);
    }
  };

  useEffect(() => {
    if (roomTypeId) {
      fetchRooms();
    }
  }, [roomTypeId]);

  

  const handleCreated = () => {
    setIsModalOpen(false);
    fetchRooms();
    onSuccess?.();
  };

  const handleUpdated = () => {
    setEditModalOpen(false);
    fetchRooms();
    onSuccess?.();
  };

  const handleDeleted = () => {
    setDeleteModalOpen(false);
    fetchRooms();
    onSuccess?.();
  };

  const filteredRoomNo = roomNo.filter((r) =>
    String(r.room_id).toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="table-container1">
      {error && <p className="error-message">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Floor</th>
            {!readOnly && (
              <th>
                <button className="add" onClick={() => setIsModalOpen(true)}>
                  <Plus size={16} />
                </button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredRoomNo.length > 0 ? (
            filteredRoomNo.map((room) => (
              <tr key={room.room_id}>
                <td>{room.room_id}</td>
                <td>{room.room_floor}</td>
                {!readOnly && (
                  <td className="actions">
                    <button className="edit-btn" onClick={() => {
                      setSelectedRoom(room);
                      setEditModalOpen(true);
                    }}>
                      <Pencil size={16} />
                    </button>
                    <button className="delete-btn" onClick={() => {
                      setSelectedRoom(room);
                      setDeleteModalOpen(true);
                    }}>
                      <X size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="no-data">No matching rooms found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <CreateRoomNoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomTypeId={roomTypeId}
        onCreated={handleCreated}
      />

      {editModalOpen && selectedRoom && (
        <EditRoomNoModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          roomNo={selectedRoom}
          roomTypeId={roomTypeId}
          onUpdated={handleUpdated}
        />
      )}

      {deleteModalOpen && selectedRoom && (
        <DeleteRoomNoModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          roomNo={selectedRoom}
          roomTypeId={roomTypeId}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

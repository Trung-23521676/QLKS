import React, { useEffect, useState } from "react";
import "./RoomNoTable.css";
import { Pencil, X, Plus } from "lucide-react";
import CreateRoomNoModal from "./CreateRoomNoModal";
import EditRoomNoModal from "./EditRoomNoModal";

export default function RoomNoTable({ search, onEdit, onDelete, readOnly }) {
  const [roomNo, setRoomNo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dữ liệu giả
  const getFakeRoomNo = () => [
    {
      id: "1",
      roomId: "A1",
      floor: "1"
    },
    {
      id: "2",
      roomId: "A2",
      floor: "2"
    },
    {
      id: "3",
      roomId: "A3",
      floor: "3"
    },
    {
      id: "4",
      roomId: "B2",
      floor: "2"
    },
    {
      id: "5",
      roomId: "A7",
      floor: "1"
    },
    {
      id: "6",
      roomId: "C2",
      floor: "1"
    },
    {
      id: "7",
      roomId: "C3",
      floor: "1"
    },
  ];

  useEffect(() => {
    setRoomNo(getFakeRoomNo());
  }, []);


  return (
    <div className="table-container1">
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
              
              <CreateRoomNoModal isOpen ={isModalOpen} onClose={() => setIsModalOpen(false)}/>
            </th>
            )}
          </tr>
        </thead>
        <tbody>
          {roomNo.map((roomNo) => (
            <tr key={roomNo.id}>
              <td>{roomNo.roomId}</td>
              <td>{roomNo.floor}</td>
              {!readOnly && (
              <td className="actions">
                
                  <button className="edit-btn" onClick={() => onEdit(roomNo)}>
                    <Pencil size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(roomNo)}>
                    <X size={16} />
                  </button>
              </td>
               )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

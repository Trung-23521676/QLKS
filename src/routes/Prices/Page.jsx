import React, { useState } from "react";

import "./prices.css";
import RoomTable from "./RoomTable";
import ServiceTable from "./ServiceTable";
import CreateRoomModal from "./CreateRoomModal";
import EditRoomModal from "./EditRoomModal";
import DeleteRoomModal from "./DeleteRoomModal";
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";

export default function Prices() {
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isEditModalOpen1, setIsEditModalOpen1] = useState(false);
  const [isDeleteModalOpen1, setIsDeleteModalOpen1] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditModalOpen2, setIsEditModalOpen2] = useState(false);
  const [isDeleteModalOpen2, setIsDeleteModalOpen2] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setIsEditModalOpen1(true);
  };

  const handleDeleteRoom = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen1(true);
  }

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsEditModalOpen2(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen2(true);
  }

  return (
    <div className="prices-container">

      <p className="name">Prices</p>
      <p className="labeldash">__________</p>

      <div className="labelsearch">
        <div>
          <p className="name">Rooms</p>
          <p className="labeldash">__________</p>
        </div>

        <div className="prices-header">
          <input
            type="text"
            placeholder="Search by room type ID"
            className="search-input"
            value={search1}
            onChange={(e) => setSearch1(e.target.value)}/>

          <button 
            className="create-button"
            onClick={() => setIsModalOpen1(true)}>
              Create room type
          </button>

          <CreateRoomModal isOpen={isModalOpen1} onClose={() => setIsModalOpen1(false)} />
        </div>
      </div>

      <div>
          <RoomTable search={search1} onEdit={handleEditRoom} onDelete={handleDeleteRoom}/>

          {isEditModalOpen1 && (
            <EditRoomModal
              room={selectedRoom}
              onClose={() => setIsEditModalOpen1(false)}
            />
          )}

          {isDeleteModalOpen1 && (
            <DeleteRoomModal
              room={selectedRoom}
              onClose={() => setIsDeleteModalOpen1(false)}
            />
          )}
      </div>

      <div className="labelsearch">
        <div>
          <p className="name">Service</p>
          <p className="labeldash">__________</p>
        </div>

        <div className="prices-header">
          <input
            type="text"
            placeholder="Search by service ID"
            className="search-input"
            value={search2}
            onChange={(e) => setSearch2(e.target.value)}/>

          <button 
            className="create-button"
            onClick={() => setIsModalOpen2(true)}>
            Create service
          </button>

          <CreateServiceModal isOpen={isModalOpen2} onClose={() => setIsModalOpen2(false)} />
        </div>
      </div>

      <div>
        <ServiceTable search={search2} onEdit={handleEditService} onDelete={handleDeleteService}/>

        {isEditModalOpen2 && (
            <EditServiceModal
              service={selectedService}
              onClose={() => setIsEditModalOpen2(false)}
            />
          )}

          {isDeleteModalOpen2 && (
            <DeleteServiceModal
              service={selectedService}
              onClose={() => setIsDeleteModalOpen2(false)}
            />
          )}
      </div>
    </div>
  );
}

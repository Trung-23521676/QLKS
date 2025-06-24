import React, { useState, useEffect } from "react";

import "./prices.css";
import RoomTable from "./RoomTable";
import ServiceTable from "./ServiceTable";
import CreateRoomModal from "./CreateRoomModal";
import EditRoomModal from "./EditRoomModal";
import DeleteRoomModal from "./DeleteRoomModal";
import CreateServiceModal from "./CreateServiceModal";
import EditServiceModal from "./EditServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";
import { fetchRoomTypes } from "../../API/PricesAPI";
import { fetchServices } from "../../API/PricesAPI";
import { fetchGuestTypes } from "../../API/PricesAPI";
import GuestTypeTable from "./GuestTypeTable";
import CreateGuestTypeModal from "./CreateGuestModal";
import EditGuestTypeModal from "./EditGuestModal";
import DeleteGuestTypeModal from "./DeleteGuestModal";



export default function Prices() {
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isEditModalOpen1, setIsEditModalOpen1] = useState(false);
  const [isDeleteModalOpen1, setIsDeleteModalOpen1] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditModalOpen2, setIsEditModalOpen2] = useState(false);
  const [isDeleteModalOpen2, setIsDeleteModalOpen2] = useState(false);
  const [isEditModalOpen3, setIsEditModalOpen3] = useState(false);
  const [isDeleteModalOpen3, setIsDeleteModalOpen3] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [guestTypes, setGuestTypes] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const rooms = await fetchRoomTypes();
      setRooms(rooms);
      const services = await fetchServices();
      setServices(services);
      const guestType = await fetchGuestTypes();
      setGuestTypes(guestType);
    } catch (err) {
      console.log('et o et');
    }
  };
  fetchData();
}, []);

const refreshRoomTypes = async () => {
  try {
    const rooms = await fetchRoomTypes();
    setRooms(rooms);
  } catch (err) {
    // đã log
  }
};

const refreshServices = async () => {
  try {
    const services = await fetchServices();
    setServices(services);
  } catch (err) {
    // đã log
  }
};

const refreshGuestTypes = async () => {
  try {
    const data = await fetchGuestTypes();
    setGuestTypes(data);
  } catch (err) {
    // log đã xử lý
  }
};



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

  const handleEditGuest = (guest) => {
  setSelectedGuest(guest);
  setIsEditModalOpen3(true);
};

const handleDeleteGuest = (guest) => {
  setSelectedGuest(guest);
  setIsDeleteModalOpen3(true);
};



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

          <CreateRoomModal isOpen={isModalOpen1} onClose={() => setIsModalOpen1(false) } onSuccess={refreshRoomTypes}/>
        </div>
      </div>

      <div>
          <RoomTable rooms={rooms} search={search1} onEdit={handleEditRoom} onDelete={handleDeleteRoom} onSuccess={refreshRoomTypes}/>

          {isEditModalOpen1 && (
            <EditRoomModal
              room={selectedRoom}
              onClose={() => setIsEditModalOpen1(false)}
             onSuccess={refreshRoomTypes}
            />
          )}

          {isDeleteModalOpen1 && (
            <DeleteRoomModal
              room={selectedRoom}
              onClose={() => setIsDeleteModalOpen1(false)}
              onSuccess={refreshRoomTypes}
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

          <CreateServiceModal onSuccess={refreshServices} isOpen={isModalOpen2} onClose={() => setIsModalOpen2(false)} />
        </div>
      </div>

      <div>
        <ServiceTable  onSuccess={refreshServices} services={services} search={search2} onEdit={handleEditService} onDelete={handleDeleteService}/>

        {isEditModalOpen2 && (
            <EditServiceModal
              service={selectedService}
              onClose={() => setIsEditModalOpen2(false)}
              onSuccess={refreshServices}
            />
          )}

          {isDeleteModalOpen2 && (
            <DeleteServiceModal
              service={selectedService}
              onClose={() => setIsDeleteModalOpen2(false)}
              onSuccess={refreshServices}
            />
          )}
      </div>


      <div className="labelsearch">
  <div>
    <p className="name">Guest Types</p>
    <p className="labeldash">__________</p>
  </div>

  <div className="prices-header">
    <input
      type="text"
      placeholder="Search by guest type name"
      className="search-input"
      value={search3}
      onChange={(e) => setSearch3(e.target.value)}
    />

    <button
      className="create-button"
      onClick={() => setIsModalOpen3(true)}
    >
      Create guest type
    </button>
    <CreateGuestTypeModal onSuccess={refreshGuestTypes} isOpen={isModalOpen3} onClose={() => setIsModalOpen3(false)} />
  </div>
</div>

<div>
  <GuestTypeTable
    guestTypes={guestTypes}
    search={search3}
    onEdit={handleEditGuest}
    onDelete={handleDeleteGuest}
  />

  {isEditModalOpen3 && (
    <EditGuestTypeModal
      isOpen={isEditModalOpen3}
      guest={selectedGuest}
      onClose={() => setIsEditModalOpen3(false)}
      onSuccess={refreshGuestTypes}
    />
  )}

  {isDeleteModalOpen3 && (
    <DeleteGuestTypeModal
      isOpen={isDeleteModalOpen3}
      guest={selectedGuest}
      onClose={() => setIsDeleteModalOpen3(false)}
      onSuccess={refreshGuestTypes}
    />
  )}
</div>
    </div>
  );
}

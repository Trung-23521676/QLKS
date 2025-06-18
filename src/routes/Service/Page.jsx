import React, { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X, Pencil } from "lucide-react";
import CreateRequestModal from "./CreateRequestModal";
import EditRequestModal from "./EditRequestModal";
import DeleteRequestModal from "./DeleteRequestModal";
import "./Service.css";
import { fetchServiceRequests } from "../../API/ServiceAPI";
import { updateServiceRequest } from "../../API/ServiceAPI";
import { fetchServices } from "../../API/PricesAPI";

export default function Service() {

  const StatusBadge = ({ status }) => {
    const lowerStatus = status.toLowerCase();
    const className = `status-badge ${
      lowerStatus === "confirmed" ? "status-confirmed" : "status-awaiting"
    }`;
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={className}>{label}</span>;
  };

  const toggleStatus = async (request_id, currentStatus) => {
  const newStatus = currentStatus === "awaiting" ? "confirmed" : "awaiting";

  const existingRequest = service.find((item) => item.request_id === request_id);
  if (!existingRequest) return;

  try {
    await updateServiceRequest(request_id, {
      ...existingRequest,
      status: newStatus,
    });

    setService((prev) =>
      prev.map((item) =>
        item.request_id === request_id
          ? { ...item, status: newStatus }
          : item
      )
    );
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Failed to update status. Please try again.");
  }
};

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedService, setSelectedService] = useState([]);
  const [service, setService] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [serviceType, setServiceType] = useState([]);

  const filterRef = useRef(null);
  const buttonRef = useRef(null);

  const handleServiceChange = (service) => {
    setSelectedService((prev) =>
      prev.includes(service)
        ? prev.filter((t) => t !== service)
        : [...prev, service]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchServiceRequests();
        setService(data);
        onSuccess();
      } catch (error) {
        console.error("Failed to fetch service requests:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceType = await fetchServices();
        setServiceType(serviceType);
        onSuccess();
      } catch (error) {
        console.error("Failed to fetch service type requests:", error);
      }
    };
    fetchData();
  }, []);

  const refreshRequest = async () => {
  try {
    const data = await fetchServiceRequests();
    setService(data);
  } catch (error) {
    console.error("Failed to refresh requests:", error);
  }
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredService = service.filter((s) => {
  const matchesSearch = s.room_id?.toLowerCase().includes(search.toLowerCase());

  const matchesService =
    selectedService.length === 0 || selectedService.includes(s.service_id);

  return matchesSearch && matchesService;
});

  const handleDeleteClick = (request) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRequest) return;
    setService((prev) =>
      prev.filter((item) => item.request_id !== selectedRequest.request_id)
    );
    setIsDeleteModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="rooms-container">
      <p className="name">Service</p>
      <p className="labeldash">__________</p>

      <div className="labelsearch">
        <button
          className="filter"
          ref={buttonRef}
          onClick={() => setShowFilter(!showFilter)}
        >
          <SlidersHorizontal size={24} />
        </button>

        {showFilter && (
          <div className="filter-panel" ref={filterRef}>
            <div>
              <p className="filter-title">Service</p>
              <div className="filter-options">
                {serviceType.map((type) => (
  <label key={type.service_id} className="checkbox-label">
    <input
      type="checkbox"
      checked={selectedService.includes(type.service_id)}
      onChange={() => handleServiceChange(type.service_id)}
    />
    {type.service_id}
  </label>
))}
              </div>
            </div>
          </div>
        )}


        <div className="room-header">
          <input
            type="text"
            placeholder="Search by room number"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="create-button"
            onClick={() => setIsModalOpen(true)}
          >
            Create request
          </button>

          <CreateRequestModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={refreshRequest}
          />
        </div>
      </div>

      <div className="rtable-container">
        <table className="table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Room number</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredService.length > 0 ? (
              filteredService.map((service) => (
                <tr key={service.request_id}>
                  <td>{service.request_id}</td>
                  <td>{service.room_id}</td>
                  <td>{service.service_id}</td>
                  <td>{service.amount}</td>
                  <td>{service.note}</td>
                  <td>
                    <span
                      onClick={() => toggleStatus(service.request_id, service.status) }
                      style={{ cursor: "pointer" }}
                    >
                    <StatusBadge status={service.status} />
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedRequest(service);
                        setIsModalOpen1(true);
                      }}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(service)}
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-data">
                  No matching requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isModalOpen1 && selectedRequest && (
        <EditRequestModal
          isOpen={isModalOpen1}
          onClose={() => {
            setIsModalOpen1(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
           onSuccess={refreshRequest}
        />
      )}

      <DeleteRequestModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onConfirm={handleConfirmDelete}
         onSuccess={refreshRequest}
      />
    </div>
  );
}

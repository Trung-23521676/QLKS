import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, X, Pencil } from "lucide-react";
import CreateRequestModal from "./CreateRequestModal";
import EditRequestModal from "./EditRequestModal";
import DeleteRequestModal from "./DeleteRequestModal";
import "./Service.css";

// Giả sử bạn đã tạo các hàm này trong file API tương ứng
import { fetchServiceRequests, updateServiceRequest, deleteServiceRequest } from "../../API/ServiceAPI";
import { fetchServices } from "../../API/PricesAPI";

export default function Service() {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedService, setSelectedService] = useState([]);
  const [service, setService] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filterRef = useRef(null);
  const buttonRef = useRef(null);
  
  // --- DATA FETCHING ---
  // Đã gộp 2 useEffect thành 1 để tối ưu và sửa lỗi "onSuccess"
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [requestsData, servicesData] = await Promise.all([
          fetchServiceRequests(),
          fetchServices()
        ]);
        setService(requestsData);
        setServiceType(servicesData);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        alert("Could not load page data. Please refresh.");
      }
    };
    loadInitialData();
  }, []);

  // --- EVENT HANDLERS & LOGIC ---
  const handleServiceChange = (serviceId) => {
    setSelectedService((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleStatus = async (requestId, currentStatus) => {
    const newStatus = currentStatus === "awaiting" ? "confirmed" : "awaiting";
    try {
      // Chỉ cần gửi những gì cần update
      await updateServiceRequest(requestId, { status: newStatus });
      // Sau khi update thành công, cập nhật lại state trên UI
      setService((prev) =>
        prev.map((item) =>
          item.request_id === requestId
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  };
  
  const refreshRequests = async () => {
    try {
      const data = await fetchServiceRequests();
      setService(data);
    } catch (error) {
      console.error("Failed to refresh requests:", error);
    }
  };
  
  const handleEditClick = (request) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (request) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  // Sửa lại hàm xóa để gọi API
  const handleConfirmDelete = async () => {
    if (!selectedRequest) return;
    try {
      // Gọi API để xóa request khỏi database
      await deleteServiceRequest(selectedRequest.request_id);
      
      // Nếu API thành công, cập nhật lại UI
      setService((prev) =>
        prev.filter((item) => item.request_id !== selectedRequest.request_id)
      );
      
      // Đóng modal và reset
      setIsDeleteModalOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to delete request:", error);
      alert(`Error: ${error.message}`);
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
    const matchesService = selectedService.length === 0 || selectedService.includes(s.service_id);
    return matchesSearch && matchesService;
  });

  const StatusBadge = ({ status }) => {
    const lowerStatus = status.toLowerCase();
    const className = `status-badge ${
      lowerStatus === "confirmed" ? "status-confirmed" : "status-awaiting"
    }`;
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={className}>{label}</span>;
  };

  // --- RENDER ---
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
                    {type.service_name}
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
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create request
          </button>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredService.length > 0 ? (
              filteredService.map((item) => (
                <tr key={item.request_id}>
                  <td>{item.request_id}</td>
                  <td>{item.room_id}</td>
                  <td>{item.service_id}</td>
                  <td>{item.amount}</td>
                  <td>{item.note}</td>
                  <td>
                    <span
                      onClick={() => toggleStatus(item.request_id, item.status)}
                      style={{ cursor: "pointer" }}
                    >
                      <StatusBadge status={item.status} />
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(item)}>
                      <Pencil size={16} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(item)}>
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
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refreshRequests}
      />
      
      {isEditModalOpen && selectedRequest && (
        <EditRequestModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
          onSuccess={refreshRequests}
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
      />
    </div>
  );
}
// services/roomTypeAPI.js
// Lấy token từ localStorage để xác thực các request
const getAuthToken = () => localStorage.getItem("token");

// Xử lý response chung, kiểm tra lỗi và parse JSON
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Bắt lỗi nếu response không phải JSON
    throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
  }
  return response.json();
};

export const fetchRoomTypes = async () => {
  try {
    const res = await fetch("/api/prices/roomType");
    if (!res.ok) throw new Error("Failed to fetch room types");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi khi tải room types:", err);
    throw err;
  }
};

export const createRoomType = async (newRoomType) => {
  const res = await fetch('/api/prices/roomType', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRoomType),
  });
  if (!res.ok) throw new Error('Failed to create room type');
  return res.json();
};

export const updateRoomType = async (roomTypeId, updatedData) => {
  const res = await fetch(`/api/prices/roomType/${roomTypeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error('Failed to update room type');
  return res.json();
};

export const deleteRoomType = async (roomTypeId) => {
  const res = await fetch(`/api/prices/roomType/${roomTypeId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete room type');
  return res.json();
};

export const fetchServices = async () => {
  const res = await fetch("/api/prices/service");
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
};

// Tạo một service mới
export const createService = async (newService) => {
  const res = await fetch("/api/prices/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newService),
  });
  if (!res.ok) throw new Error("Failed to create service");
  return res.json();
};

// Cập nhật service theo service_id
export const updateService = async (serviceId, updatedData) => {
  const res = await fetch(`/api/prices/service/${serviceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
};

// Xoá service theo service_id
export const deleteService = async (serviceId) => {
  const res = await fetch(`/api/prices/service/${serviceId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return res.json();
};
// API/ServiceRequestAPI.js

// Lấy danh sách tất cả yêu cầu dịch vụ
export const fetchServiceRequests = async () => {
  const res = await fetch("/api/serviceRequest");
  if (!res.ok) throw new Error("Failed to fetch service requests");
  return res.json();
};

// Tạo mới một yêu cầu dịch vụ
export const createServiceRequest = async (requestData) => {
  const res = await fetch("/api/serviceRequest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!res.ok) throw new Error("Failed to create service request");
  return res.json();
};

// Cập nhật một yêu cầu dịch vụ
export const updateServiceRequest = async (requestId, updatedData) => {
  const res = await fetch(`/api/serviceRequest/${requestId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error("Failed to update service request");
  return res.json();
};

// Xóa một yêu cầu dịch vụ
export const deleteServiceRequest = async (requestId) => {
  const res = await fetch(`/api/serviceRequest/${requestId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete service request");
  return res.json();
};

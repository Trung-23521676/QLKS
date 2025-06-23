// This function gets the authentication token from local storage.
const getAuthToken = () => localStorage.getItem("token");

// This function handles the response from the server, checking for errors.
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
    throw new Error(errorData.message);
  }
  return response.json();
};

// SỬA LỖI: Trỏ đến đúng API của reservations
export const getAllReservations = async () => {
  const response = await fetch("/api/reservation", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};

// SỬA LỖI: Trỏ đến đúng API của reservations và dùng đúng tham số
export const getReservationById = async (reservationId) => {
  const response = await fetch(`/api/reservation/${reservationId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};

// SỬA LỖI: Trỏ đến đúng API của reservations và dùng đúng tham số
export const updateReservation = async (reservationId, updatedData) => {
  const response = await fetch(`/api/reservation/${reservationId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
};

// Thêm hàm tạo reservation mới
export const createReservation = async (reservationData) => {
  const response = await fetch("/api/reservation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(reservationData),
  });
  return handleResponse(response);
};

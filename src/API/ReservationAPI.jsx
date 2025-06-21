// src/API/ReservationAPI.js

const getAuthToken = () => localStorage.getItem("token");

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Lỗi HTTP: ${response.status}` }));
    throw new Error(errorData.message);
  }
  return response.json();
};

export const getAllReservations = async () => {
  // Sử dụng lại endpoint đã có
  const response = await fetch("/api/frontdesk/bookings", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};

export const getReservationById = async (bookingId) => {
  const response = await fetch(`/api/frontdesk/booking/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};

export const updateReservation = async (bookingId, updatedData) => {
  const response = await fetch(`/api/frontdesk/booking/${bookingId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
};
const getAuthToken = () => localStorage.getItem("token");
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

/*
 * Lấy danh sách tất cả các roomTypes.
 * @returns {Promise<Array>} Danh sách các roomTypes.
 */
export const getAllRoomTypes = async () => {
  const response = await fetch("/api/prices/roomType", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};


export const getRoomTypeById = async (roomTypeId) => {
  const response = await fetch(`/api/prices/roomType/details/${roomTypeId}`, { // Assumes /api/roomtype prefix
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};
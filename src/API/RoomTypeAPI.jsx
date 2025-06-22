const getAuthToken = () => localStorage.getItem("token");
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

export const getRoomTypeById = async (roomTypeId) => {
  const response = await fetch(`/api/prices/roomtype/details/${roomTypeId}`, { // Assumes /api/roomtype prefix
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};
// --- Helper Functions ---

// Gets the authentication token from local storage.
const getAuthToken = () => localStorage.getItem("token");

// Handles the server response, checking for errors and parsing JSON.
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

// --- API Functions ---

/**
 * Fetches all rooms without any filters.
 */
export const fetchRooms = async () => {
  const response = await fetch('/api/room', {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};

/**
 * Fetches available rooms by sending check-in/out dates and guest details
 * to the backend recommendation controller.
 * @param {object} criteria - The criteria for finding rooms (roomTypeId, checkIn, checkOut, adults, children).
 * @returns {Promise<Array>} A list of suitable room IDs.
 */
export const getAvailableRooms = async (criteria) => {
  const { roomTypeId, checkIn, checkOut, adults, children } = criteria;

  // FIXED: The URL now correctly points to the endpoint defined in your frontDeskRoute.js
  const response = await fetch('/api/frontdesk/recommended-rooms', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({
      room_type_id: roomTypeId,
      check_in: checkIn,
      check_out: checkOut,
      adults: adults,
      children: children,
    }),
  });
  
  const data = await handleResponse(response);
  return data.recommended_rooms || [];
};

/**
 * Creates a new room.
 * @param {Object} newRoom - Data for the new room.
 */
export const createRoom = async (newRoom) => {
  const response = await fetch('/api/room', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(newRoom),
  });
  return handleResponse(response);
};

/**
 * Updates a room's information.
 * @param {string} roomId - The ID of the room to update.
 * @param {Object} updatedRoom - The updated data.
 */
export const updateRoom = async (roomId, updatedRoom) => {
  const response = await fetch(`/api/room/${roomId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(updatedRoom),
  });
  return handleResponse(response);
};

/**
 * Deletes a room.
 * @param {string} roomId - The ID of the room to delete.
 */
export const deleteRoom = async (roomId) => {
  const response = await fetch(`/api/room/${roomId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};
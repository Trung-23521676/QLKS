// --- Các hàm trợ giúp để tái sử dụng ---

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

// --- Các hàm gọi API ---

/**
 * Lấy tất cả các phòng (không lọc).
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
 * Lấy danh sách các phòng trống dựa trên loại phòng.
 * @param {string} roomTypeId - ID của loại phòng.
 * @returns {Promise<Array>} Danh sách các phòng trống.
 */
export const getAvailableRooms = async (roomTypeId) => {
  // Gọi đến API /api/room với các query parameters để lọc
  const response = await fetch(`/api/room?room_type_id=${roomTypeId}&is_booked=0`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};

/**
 * Tạo một phòng mới.
 * @param {Object} newRoom - Dữ liệu của phòng mới.
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
 * Cập nhật thông tin một phòng.
 * @param {string} roomId - ID của phòng cần cập nhật.
 * @param {Object} updatedRoom - Dữ liệu cập nhật.
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
 * Xóa một phòng.
 * @param {string} roomId - ID của phòng cần xóa.
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
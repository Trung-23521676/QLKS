// Lấy token từ localStorage để xác thực các request
const getAuthToken = () => localStorage.getItem("token");

// Hàm trợ giúp để xử lý các response từ API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
  }
  return response.json();
};

/**
 * Lấy danh sách tất cả các booking.
 * @returns {Promise<Array>} Danh sách các booking.
 */
export const getAllBookings = async () => {
  const response = await fetch("/api/frontdesk/bookings", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};

/**
 * Lấy chi tiết của một booking cụ thể bằng ID.
 * @param {string|number} bookingId - ID của booking cần lấy.
 * @returns {Promise<Object>} Chi tiết của booking.
 */
export const getBookingById = async (bookingId) => {
  const response = await fetch(`/api/frontdesk/bookings/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};

/**
 * Tạo một booking mới.
 * @param {Object} bookingData - Dữ liệu của booking cần tạo.
 * @returns {Promise<Object>} Booking vừa được tạo.
 */
export const createBooking = async (bookingData) => {
  const response = await fetch("/api/frontdesk/booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

 /**
 * Cập nhật một booking hiện có bằng ID.
 * @param {string|number} bookingId - ID của booking cần cập nhật.
 * @param {Object} bookingData - Dữ liệu mới để cập nhật cho booking.
 * @returns {Promise<Object>} Booking sau khi đã được cập nhật.
 */
export const updateBooking = async (bookingId, bookingData) => {
  const response = await fetch(`/api/frontdesk/booking/${bookingId}`, {
    method: 'PUT', // Use PUT for updating an existing resource
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

/**
 * Xóa một booking dựa vào ID
 * @param {number} bookingId - ID của booking cần xóa
 * @returns {Promise<Object>} - Thông báo thành công từ API
 */
export const deleteBookingById = async (bookingId) => {
  try {
    const response = await fetch(`/api/frontdesk/booking/${bookingId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Xóa đặt phòng thất bại');
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi xóa đặt phòng:', error);
    throw error;
  }
};
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
  const response = await fetch(`/api/frontdesk/booking/${bookingId}`, {
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
  const response = await fetch("/api/frontdesk/create-booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

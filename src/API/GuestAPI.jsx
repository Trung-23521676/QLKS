// Hàm trợ giúp để lấy token
const getAuthToken = () => localStorage.getItem("token");

// Hàm trợ giúp để xử lý response và lỗi
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
  }
  return response.json();
};

/**
 * Lấy danh sách tất cả các khách hàng từ backend.
 * @returns {Promise<Array>} Danh sách khách hàng.
 */
export const fetchAllGuests = async () => {
  // Giả sử endpoint của bạn là /api/guests
  const response = await fetch("/api/guests", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return handleResponse(response);
};
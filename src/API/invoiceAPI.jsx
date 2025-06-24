const API_BASE_URL = '/api/frontdesk';

/**
 * Lấy dữ liệu hóa đơn chi tiết cho một booking
 * @param {number} bookingId - ID của booking cần lấy hóa đơn
 * @returns {Promise<Object>} - Dữ liệu hóa đơn từ API
 */
export const getInvoiceByBookingId = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/invoice/${bookingId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi máy chủ: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu hóa đơn:', error);
    // Ném lỗi ra ngoài để component có thể xử lý
    throw error;
  }
};
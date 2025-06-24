const API_BASE_URL = '/api'; 

/**
 * Lấy tất cả các loại khách từ database
 * @returns {Promise<Array>} - Mảng các đối tượng guest_type
 */
export const getAllGuestTypes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/guests/guestType`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi máy chủ: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại khách:', error);
    throw error;
  }
};
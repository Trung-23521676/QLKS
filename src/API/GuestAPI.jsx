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

export const fetchGuests = async () => {
  const res = await fetch("/api/guests");
  if (!res.ok) throw new Error("Failed to fetch guests");
  return res.json();
};

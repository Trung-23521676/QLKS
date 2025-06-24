const API_BASE = "/api/report"; // đổi nếu bạn deploy ở nơi khác

// 1. Lấy thống kê Check-in / Check-out
export const fetchCheckInOutOverview = async () => {
  const res = await fetch(`${API_BASE}/CheckInOut`);
  if (!res.ok) throw new Error("Failed to fetch check-in/out stats");
  return await res.json();
};

// 2. Lấy thống kê theo loại phòng
export const fetchRoomTypeStats = async () => {
  const res = await fetch(`${API_BASE}/RoomTypeStats`);
  if (!res.ok) throw new Error("Failed to fetch room type stats");
  return await res.json();
};

// 3. Lấy thống kê dịch vụ
export const fetchServiceStats = async () => {
  const res = await fetch(`${API_BASE}/ServiceStats`);
  if (!res.ok) throw new Error("Failed to fetch service stats");
  return await res.json();
};

// 4. Lấy thống kê doanh thu theo tháng
export const fetchRevenueStats = async () => {
  const res = await fetch(`${API_BASE}/RevenueStats`);
  if (!res.ok) throw new Error("Failed to fetch revenue stats");
  return await res.json();
};

// 5. Gửi chartBase64 để xuất báo cáo PDF
export const exportReportWithChart = async (chartBase64) => {
  const res = await fetch(`${API_BASE}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chartBase64 }),
  });

  if (!res.ok) throw new Error("Failed to export PDF");

  const blob = await res.blob();
  return blob; // trả về blob để bạn có thể tải xuống hoặc mở file PDF
};

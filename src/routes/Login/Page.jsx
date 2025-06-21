// src/routes/Login/Page.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  // --- Thêm state để quản lý lỗi và trạng thái loading ---
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- Cập nhật hàm handleLogin ---
  const handleLogin = async () => {
    // Reset lỗi cũ và bắt đầu loading
    setError("");
    setIsLoading(true);

    try {
      // Gọi API đến backend qua proxy của Vite
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: phone, password }),
      });

      // Lấy dữ liệu JSON từ response
      const data = await response.json();

      // Nếu response không thành công (vd: sai pass), backend sẽ trả về lỗi
      if (!response.ok) {
        // Ném lỗi với message từ backend
        throw new Error(data.message || "Đăng nhập thất bại.");
      }

      // Nếu đăng nhập thành công:
      // 1. Lưu token vào localStorage
      localStorage.setItem("token", data.token);

      // 2. Điều hướng đến trang chính, thay thế trang login trong lịch sử trình duyệt
      navigate("/", { replace: true });

    } catch (err) {
      // Bắt lỗi từ network hoặc từ backend và hiển thị cho người dùng
      setError(err.message);
    } finally {
      // Dừng loading dù thành công hay thất bại
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-transparent font-['Inter']">
      {/* Background image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
        alt="background"
      />

      {/* Logo */}
      <div className="absolute top-6 left-6 w-20 h-20 z-10">
        <div className="absolute inset-0 bg-[#14274a] rounded-br-3xl rounded-tl-3xl" />
        <div className="absolute inset-[3px] bg-white rounded-br-3xl rounded-tl-3xl flex items-center justify-center">
          <div className="text-[#14274a] font-serif text-xs leading-tight text-center font-semibold">
            <div>SERENITY</div>
            <div>HOTEL</div>
          </div>
        </div>
      </div>

      {/* Form center */}
      <div className="relative z-10 flex items-center justify-center h-screen">
        <div className="w-[539px] bg-white/75 rounded-[30px] px-10 py-12">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-medium text-black mb-2">Sign in</h1>
          </div>

          {/* Phone input */}
          <div className="mb-6">
            <label className="block text-black text-base mb-1">
              Enter your phone number or ID
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number or ID"
              className="w-full h-14 px-6 bg-white rounded-[10px] border border-gray-500 text-sm text-zinc-700 font-light focus:outline-none"
            />
          </div>

          {/* Password input */}
          <div className="mb-8">
            <label className="block text-black text-base mb-1">
              Enter your Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-14 px-6 bg-white rounded-[10px] border border-gray-500 text-sm text-zinc-700 font-light focus:outline-none"
            />
          </div>

          {/* --- Hiển thị thông báo lỗi nếu có --- */}
          {error && (
            <div className="text-red-600 text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* Sign in button */}
          <button
            onClick={handleLogin}
            // --- Vô hiệu hóa nút khi đang loading ---
            disabled={isLoading}
            className="w-full h-12 bg-sky-600 text-white text-base font-medium rounded-[30px] shadow-md hover:bg-sky-700 transition disabled:bg-sky-400 disabled:cursor-not-allowed"
          >
            {/* --- Thay đổi text khi đang loading --- */}
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
// src/routes/Login/Page.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginPage() {
<<<<<<< Updated upstream
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login with", phone, password);
    navigate("/");
=======
  // --- Thêm state để quản lý lỗi, trạng thái loading và hiển thị mật khẩu ---
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <-- NEW: State để ẩn/hiện mật khẩu
  const navigate = useNavigate();

  // --- Hàm chuyển đổi trạng thái hiển thị mật khẩu ---
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

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
      
      console.log('sos');
      // 2. Điều hướng đến trang chính, thay thế trang login trong lịch sử trình duyệt
      navigate("/", { replace: true });
    } catch (err) {
      // Bắt lỗi từ network hoặc từ backend và hiển thị cho người dùng
      setError(err.message);
    } finally {
      // Dừng loading dù thành công hay thất bại
      setIsLoading(false);
    }
>>>>>>> Stashed changes
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-transparent font-['Inter']">
      {/* Background image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"
        alt="background"
      />

      {/* Logo góc trái trên */}
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

          {/* Password input with toggle button */}
          <div className="mb-8 relative"> {/* <-- Thêm relative cho container */}
            <label className="block text-black text-base mb-1">
              Enter your Password
            </label>
            <input
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-14 px-6 bg-white rounded-[10px] border border-gray-500 text-sm text-zinc-700 font-light focus:outline-none pr-12" // <-- Thêm padding phải để icon không bị che
            />
            <button
              type="button" // Quan trọng: set type="button" để tránh submit form
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6 text-gray-500 hover:text-gray-700 focus:outline-none" // <-- Đặt icon button
            >
              {showPassword ? (
                // Icon mắt đóng (hide password)
               <Eye size={24} strokeWidth={1.5} color="currentColor" />
              ) : (
                // Icon mắt mở (show password)
                <EyeClosed size={24} strokeWidth={1.5} color="currentColor" />
              )}
            </button>
          </div>

          {/* Sign in button */}
          <button
            onClick={handleLogin}
            className="w-full h-12 bg-sky-600 text-white text-base font-medium rounded-[30px] shadow-md hover:bg-sky-700 transition"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

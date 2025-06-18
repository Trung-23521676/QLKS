// src/routes/Login/Page.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login with", phone, password);
    navigate("/");
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

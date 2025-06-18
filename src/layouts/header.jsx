import { Bell } from "lucide-react";
import profileImg from "../assets/react.svg";
import "./Header.css"; // Import file CSS
import RealTimeClock from "./clock"; // Tuỳ bạn dùng hoặc comment
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: "1111", type: "service", title: "Service request" },
    { id: "1111", type: "reservation", title: "New reservation" },
  ];

  const handleNotificationClick = (id) => {
    navigate(`/Reservations/${id}`);
    setShowDropdown(false);
  };
  return (
    <header className="header">
      {/* Left side: thời gian */}
      <div className="header-time">
        {RealTimeClock && <RealTimeClock />}
      </div>

      {/* Right side: thông báo và avatar */}
      <div className="header-right">
        <div
          className="notification-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Bell size={22} className="bell-icon" />
          <span className="notification-badge">2</span>
        </div>
        <img
          src={profileImg}
          alt="profile"
          className="profile-avatar"
        />
        {showDropdown && (
          <div className="notification-dropdown">
            <p className="dropdown-section-title">New</p>

            {notifications.map((item, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleNotificationClick(item.id)}
              >
                <div className="icon">
                  {item.type === "reservation" ? "📄" : "🔖"}
                </div>
                <div className="info">
                  <p className="title">{item.title}</p>
                  <p className="subtitle">{item.id}</p>
                </div>
              </div>
            ))}

            <hr />

            <p className="dropdown-section-title">Before</p>

            {[...Array(3)].map((_, i) => (
              <div key={i} className="dropdown-item">
                <div className="icon">🔖</div>
                <div className="info">
                  <p className="title">Service request</p>
                  <p className="subtitle">1111</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </header>
  );
};

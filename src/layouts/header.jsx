import { Bell } from "lucide-react";
import profileImg from "../assets/react.svg";
import "./Header.css"; // Import file CSS
import RealTimeClock from "./clock"; // Tuỳ bạn dùng hoặc comment

export const Header = () => {
  return (
    <header className="header">
      {/* Left side: thời gian */}
      <div className="header-time">
        {RealTimeClock && <RealTimeClock />}
      </div>

      {/* Right side: thông báo và avatar */}
      <div className="header-right">
        <div className="notification-icon">
          <Bell size={22} className="bell-icon" />
          <span className="notification-badge">2</span>
        </div>
        <img
          src={profileImg}
          alt="profile"
          className="profile-avatar"
        />
      </div>
    </header>
  );
};

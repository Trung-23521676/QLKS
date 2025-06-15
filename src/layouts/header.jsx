import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import profileImg from "../assets/react.svg";
import NotiBox from "./Noti";
import "./Header.css";
import RealTimeClock from "./clock";

export const Header = () => {
  const [showNoti, setShowNoti] = useState(false);
  const notiRef = useRef(null);

  // Close notification box when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNoti(false);
      }
    }
    if (showNoti) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNoti]);

  return (
    <header className="header" style={{ position: "relative" }}>
      <div className="header-time">
        {RealTimeClock && <RealTimeClock />}
      </div>
      <div className="header-right" ref={notiRef} style={{ position: "relative" }}>
        <div
          className="notification-icon"
          style={{ cursor: "pointer", position: "relative", display: "inline-block" }}
          onClick={() => setShowNoti((v) => !v)}
        >
          <Bell size={22} className="bell-icon" />
          <span className="notification-badge">2</span>
          {/* Notification box absolutely positioned to the bell */}
          {showNoti && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 50,
              }}
            >
              <NotiBox onClose={() => setShowNoti(false)} />
            </div>
          )}
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
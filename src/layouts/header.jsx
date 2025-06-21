import { useState } from "react";
import { Search, Bell } from "lucide-react";
import profileImg from "../assets/react.svg";
import NotiBox from "./Noti";
import RealTimeClock from "./clock";
import "./Header.css";

export const Header = () => {
    const [showNoti, setShowNoti] = useState(false);

    return (
        <header className="header bg-transparent shadow-none">
            <div className="header-time">
                <RealTimeClock />
            </div>
            <div className="header-right">
                <div className="notification-icon" onClick={() => setShowNoti((v) => !v)}>
                    <Bell size={22} className="bell-icon" />
                    <span className="notification-badge">2</span>
                    {showNoti && <NotiBox onClose={() => setShowNoti(false)} />}
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
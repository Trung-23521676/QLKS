import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "../constants";
import PropTypes from "prop-types";
import "../layouts/sidebar.css";
import { useNavigate } from "react-router-dom";

export const Sidebar = forwardRef((props, ref) => {

    const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Xóa token/localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // nếu có

    // 2. Điều hướng về trang đăng nhập
    navigate("/login");
  };
    return (
        <aside ref={ref} className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <span style={{
                    fontWeight: 700,
                    fontSize: 28,
                    color: "#0077B6",
                    width: "100%",
                    textAlign: "center",
                    letterSpacing: 1,
                }}>
                    Your Logo
                </span>
            </div>
            <div className="sidebar-content">
                {navbarLinks.map((navbarLink) => (
                    <nav key={navbarLink.title} className="sidebar-group">
                        <p className="sidebar-group-title">{navbarLink.title}</p>
                        {navbarLink.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={({ isActive }) =>
                                    [
                                        "sidebar-item",
                                        isActive ? "active" : "",
                                    ].join(" ")
                                }
                            >
                                <span className="sidebar-icon">
                                    <link.icon size={24} strokeWidth={1.5} />
                                </span>
                                <span className="sidebar-label">{link.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
            {/* Logout icon ở dưới cùng */}
            <div style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "center",
                padding: 16,
            }}>
                <button onClick={handleLogout} className="sidebar-item" style={{
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    justifyContent: "center",
                    padding: 0,
                }}>
                    <svg width="24" height="24" fill="none" stroke="#1B263B" strokeWidth="2">
                        <path d="M9 6v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                        <path d="M16 17v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2" />
                        <path d="M7 12h10" />
                        <path d="M15 16l4-4-4-4" />
                    </svg>
                </button>
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";
Sidebar.propTypes = {};

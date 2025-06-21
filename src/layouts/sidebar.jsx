import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "../constants";
import IMG from "../assets/react.svg";
import { cn } from "../utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside ref={ref} className="sidebar">

        <div className="sidebar-logo">
            {/* Logo */}
                <div className="relative w-20 h-20 mr-2">
                  <div className="absolute inset-0 bg-[#14274a] rounded-br-3xl rounded-tl-3xl"></div>
                  <div className="absolute inset-[3px] bg-white rounded-br-3xl rounded-tl-3xl flex items-center justify-center">
                    <div className="text-[#14274a] font-serif text-xs leading-tight text-center font-semibold" >
                      <div>SERENITY</div>
                      <div>HOTEL</div>
                    </div>
                  </div>
                </div>
        </div>

        <div className="sidebar-content">
            {navbarLinks.map((group) => (
                <nav key={group.title} className="sidebar-group">

                    <p className="sidebar-group-title">{group.title}</p>

                    {group.links.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.path}
                            className={({ isActive }) =>
                                cn(
                                    "sidebar-item",         
                                    isActive && "active"    
                                )
                            }>
                            <link.icon size={22} className="sidebar-icon" />

                            <p className="sidebar-label">{link.label}</p>
                        </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
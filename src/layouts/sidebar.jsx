import { forwardRef } from "react"
import {cn} from "../utils/cn"
import IMG from "../assets/react.svg"
import PropTypes from "prop-types";
import { navbarLinks } from "../constants";
import { NavLink } from "react-router-dom";

export const Sidebar = forwardRef((_, ref) => {
    return (
        <aside ref={ref} className="sidebar">

        <div className="sidebar-logo">
            <img src={IMG} alt="Logo" className="logo-light" />
            {/* <img src={IMG} alt="Logo" className="logo-dark" /> */}
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

Sidebar.propTypes = {};
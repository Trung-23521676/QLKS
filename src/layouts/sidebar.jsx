import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "../constants";
import IMG from "../assets/react.svg";
import { cn } from "../utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex flex-col overflow-x-hidden bg-white top-4 left-4 h-[calc(100vh-2rem)]",
                "rounded-3xl shadow-2xl", 
                "[transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1)]",
                "md:w-[300px]",
                "max-md:left-4", 
            )}
        >
            <div className="flex gap-x-3 p-3">
                <img src={IMG} alt="Logoipsum" className="dark:hidden" />
                {!collapsed  && <p className="text-lg font-medium text-slate-900 transition-colors ">Logoipsum</p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav key={navbarLink.title} className={cn("sidebar-group", collapsed && "md:items-center")}>
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
                        {navbarLink.links.map((link) => (
                            <NavLink key={link.label} to={link.path} className={cn("sidebar-item", collapsed && "md:w-[45px]")}>
                                <link.icon size={22} className="flex-shrink-0" />
                                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
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
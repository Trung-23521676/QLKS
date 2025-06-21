import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "../hooks/use-click-ouside";
import { Sidebar } from "../layouts/sidebar";
import { Header } from "../layouts/header";
import { cn } from "../utils/cn";
import { useEffect, useRef, useState } from "react";

const Layout = () => {
    const sidebarRef = useRef(null);

    return (
        <div className="min-h-screen bg-slate-100 transition-colors">
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
                )}
            />
            <Sidebar
                ref={sidebarRef}
            />
            <div className={cn("transition-[margin] duration-300", "md:ml-[320px]")}>
                <Header/>
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;